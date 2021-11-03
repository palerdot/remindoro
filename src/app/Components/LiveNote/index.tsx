import React, { useState, useEffect, useMemo } from 'react'
import { isEmpty, debounce, isEqual, DebouncedFunc } from '@lodash'
import { useSelector, useDispatch } from 'react-redux'
import { plateToMarkdownAsync } from 'slate-mark'
import {
  Plate,
  useStoreEditorRef,
  useEventEditorId,
  SPEditor,
  TNode,
} from '@udecode/plate'

import type { RootState } from '@app/Store/'

import { plugins, options, components } from './options'
import { asyncParseMd } from './transformers'
import { updateNote } from '@app/Store/Slices/Remindoros'
import ActionBar from './ActionBar'
import BackupEditor from './BackupEditor'
import PlainTextEditor from '@app/Components/LiveNote/PlainTextEditor'
import { EditorHolder } from './utils'
import { cancellablePromise } from '@app/Hooks/useCancellablePromise'

const editableProps = {
  placeholder: 'Enter some rich text…',
  spellCheck: false,
  padding: '0 30px',
}

type Props = {
  id: string
  note: string
  readOnly?: boolean
}

function LiveNote({ id, note, readOnly }: Props) {
  const dispatch = useDispatch()
  const editor = useStoreEditorRef(useEventEditorId('focus')) as SPEditor

  const [initialValue, setInitialValue] = useState<TNode | undefined>(undefined)

  useEffect(() => {
    if (isEmpty(note.trim())) {
      // ref: https://github.com/ianstormtaylor/slate/issues/713
      const emptyValue = [{ type: 'paragraph', children: [{ text: '' }] }]
      // @ts-ignore
      setInitialValue(emptyValue)

      // do not proceed
      return
    }

    const { promise, cancel } = cancellablePromise<TNode>(
      asyncParseMd(editor, note)
    )

    // we will parse md async
    promise.then(parsedInitialValue => {
      setInitialValue(parsedInitialValue as TNode)
    })

    // cancel the promise when unmounting
    return cancel
  }, [editor, note])

  const lazyUpdate = useMemo(
    () =>
      // IMPORTANT: `remark-slate` has imperfect types
      // ref: https://github.com/hanford/remark-slate/issues/25
      // once we have correct types, we can type this properly
      debounce(updatedPlateNote => {
        plateToMarkdownAsync(updatedPlateNote).then(updatedNote => {
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
    <EditorHolder className={'editor'}>
      <Plate
        id={id}
        plugins={plugins}
        components={components}
        options={options}
        editableProps={{
          ...editableProps,
          readOnly,
          placeholder: readOnly ? '' : editableProps.placeholder,
        }}
        initialValue={initialValue as any}
        onChange={updatedNote => {
          lazyUpdate(updatedNote)
        }}
      />
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
      {!readOnly && <ActionBar liveNoteEnabled={liveNoteEnabled} />}
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
