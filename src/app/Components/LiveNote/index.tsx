import React, { useMemo } from 'react'
import { isEmpty, debounce, isEqual } from '@lodash'
import { useDispatch } from 'react-redux'
import { plateToMarkdownAsync } from 'slate-mark'
import {
  Plate,
  useStoreEditorRef,
  useEventEditorId,
  deserializeMD,
  SPEditor,
} from '@udecode/plate'

import Toolbar from './Toolbar'
import { plugins, options, components } from './options'
import { parseMd } from './transformers'
import { updateNote } from '@app/Store/Slices/Remindoros'

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

    // we are going to replace '\n' with `&nbsp;\n`
    console.log(
      'porumai ... md deserializing ',
      deserializeMD(editor, note.replaceAll(' \n ', '&nbsp;\n')),
      parseMd(editor, note)
    )

    return deserializeMD(editor, note.replaceAll(' \n ', '&nbsp;\n'))
  }, [editor, note])

  const lazyUpdate = useMemo(
    () =>
      // IMPORTANT: `remark-slate` has imperfect types
      // ref: https://github.com/hanford/remark-slate/issues/25
      // once we have correct types, we can type this properly
      debounce(updatedPlateNote => {
        plateToMarkdownAsync(updatedPlateNote).then(updatedNote => {
          if (!isEqual(note, updatedNote)) {
            console.log(
              'porumai ... dispatching update ',
              updatedPlateNote,
              updatedNote
            )

            dispatch(
              updateNote({
                id,
                value: updatedNote,
              })
            )
          }
        })
      }, 2500),
    [id, dispatch, note]
  )

  return (
    <div>
      {!readOnly && <Toolbar />}
      <div className={'editor'}>
        <Plate
          id="porumai"
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
      </div>
    </div>
  )
}

export default LiveNote
