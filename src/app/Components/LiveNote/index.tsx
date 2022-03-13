import React, { useState, useEffect, useMemo } from 'react'
import { isEmpty, debounce, isEqual, DebouncedFunc } from '@lodash'
import { useSelector, useDispatch } from 'react-redux'

import type { RootState } from '@app/Store/'
import type { Descendant } from 'react-slite'

import { updateNote } from '@app/Store/Slices/Remindoros'
import ActionBar from './ActionBar'
import BackupEditor from './BackupEditor'
import PlainTextEditor from '@app/Components/LiveNote/PlainTextEditor'
import { EditorHolder } from './helpers'
import Slite, { Editor, mdToSlate, slateToMd } from 'react-slite'

type Props = {
  id: string
  note: string
  readOnly?: boolean
}

function LiveNote({ id, note, readOnly }: Props) {
  const dispatch = useDispatch()
  const [initialValue, setInitialValue] = useState<Descendant[] | undefined>(
    undefined
  )

  useEffect(() => {
    if (isEmpty(note)) {
      // ref: https://github.com/ianstormtaylor/slate/issues/713
      const emptyValue = [{ type: 'paragraph', children: [{ text: '' }] }]
      // @ts-ignore
      setInitialValue(emptyValue)

      // do not proceed
      return
    }

    mdToSlate(note).then(parsed => {
      setInitialValue(parsed)
    })
  }, [note])

  const lazyUpdate = useMemo(
    () =>
      debounce(updatedSlateNodes => {
        slateToMd(updatedSlateNodes).then(updatedNote => {
          if (!isEqual(note, updatedNote)) {
            dispatch(
              updateNote({
                id,
                value: updatedNote,
              })
            )
          }
        })
      }, 314),
    [id, dispatch, note]
  )

  if (initialValue === undefined) {
    return null
  }

  return (
    <EditorHolder className={`editor ${readOnly ? 'readonly' : ''}`}>
      <Slite
        initialValue={initialValue}
        onChange={updatedNote => {
          lazyUpdate(updatedNote)
        }}
      >
        {!readOnly && <ActionBar liveNoteEnabled={true} />}
        <div className={'react-slite'}>
          <Editor readOnly={readOnly} />
        </div>
      </Slite>
    </EditorHolder>
  )
}

interface WrapperProps extends Props {
  lazyUpdate: DebouncedFunc<(updatedNote: string) => void>
}

const NoteWrapper = ({ id, note, readOnly, lazyUpdate }: WrapperProps) => {
  const liveNoteEnabled = useSelector((state: RootState) => {
    return state.settings.liveNoteEnabled
  })

  return (
    <BackupEditor id={id} readOnly={readOnly} note={note} onChange={lazyUpdate}>
      {!readOnly && !liveNoteEnabled && <ActionBar liveNoteEnabled={false} />}
      <div>
        {liveNoteEnabled ? (
          <LiveNote id={id} note={note} readOnly={readOnly} />
        ) : (
          <PlainTextEditor
            id={id}
            note={note}
            readOnly={readOnly}
            onChange={lazyUpdate}
          />
        )}
      </div>
    </BackupEditor>
  )
}

const ResilientLiveNote = ({ id, readOnly, note }: Props) => {
  const dispatch = useDispatch()
  const lazyUpdate = useMemo(
    () =>
      debounce((updatedNote: string) => {
        dispatch(
          updateNote({
            id,
            value: updatedNote,
          })
        )
      }, 314),
    [id, dispatch]
  )

  return (
    <BackupEditor id={id} readOnly={readOnly} note={note} onChange={lazyUpdate}>
      <NoteWrapper
        id={id}
        readOnly={readOnly}
        note={note}
        lazyUpdate={lazyUpdate}
      />
    </BackupEditor>
  )
}

export default ResilientLiveNote
