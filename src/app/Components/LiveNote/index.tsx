import React, { useMemo } from 'react'
import { isEmpty, debounce, isEqual } from '@lodash'
import { useSelector, useDispatch } from 'react-redux'
import { plateToMarkdownAsync } from 'slate-mark'
import {
  Plate,
  useStoreEditorRef,
  useEventEditorId,
  SPEditor,
} from '@udecode/plate'

import type { RootState } from '@app/Store/'

import ActionBar from './ActionBar'
import { plugins, options, components } from './options'
import { parseMd } from './transformers'
import { updateNote } from '@app/Store/Slices/Remindoros'
import BackupEditor from './BackupEditor'
import PlainTextEditor from '@app/Components/LiveNote/PlainTextEditor'
import { EditorHolder } from './utils'

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

  const initialValue = useMemo(() => {
    if (isEmpty(note.trim())) {
      // ref: https://github.com/ianstormtaylor/slate/issues/713
      return [{ type: 'paragraph', children: [{ text: '' }] }]
    }

    return parseMd(editor, note)
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
        initialValue={initialValue}
        onChange={updatedNote => {
          lazyUpdate(updatedNote)
        }}
      />
    </EditorHolder>
  )
}

const ResilientLiveNote = ({ id, note, readOnly }: Props) => {
  const dispatch = useDispatch()
  const liveNoteEnabled = useSelector((state: RootState) => {
    return state.settings.liveNoteEnabled
  })
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

export default ResilientLiveNote
