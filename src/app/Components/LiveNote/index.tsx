import React, { useMemo } from 'react'
import { isEmpty, debounce } from '@lodash'
import { useDispatch } from 'react-redux'
import {
  Plate,
  useStoreEditorRef,
  useEventEditorId,
  deserializeMD,
  SPEditor,
} from '@udecode/plate'

import Toolbar from './Toolbar'
import { plugins, options, components } from './options'
import { toHTML, toMd } from './utils'

const editableProps = {
  placeholder: 'Enter some rich text…',
  spellCheck: false,
  padding: '0 30px',
}

type Props = {
  id: string
  note: string
}

function LiveNote({ id, note }: Props) {
  const dispatch = useDispatch()
  const editor = useStoreEditorRef(useEventEditorId('focus')) as SPEditor
  const initialValue = useMemo(() => {
    if (isEmpty(note.trim())) {
      // ref: https://github.com/ianstormtaylor/slate/issues/713
      return [{ type: 'paragraph', children: [{ text: '' }] }]
    }
    return deserializeMD(editor, note)
  }, [editor, note])

  const lazyUpdate = useMemo(
    () =>
      // IMPORTANT: `remark-slate` has imperfect types
      // ref: https://github.com/hanford/remark-slate/issues/25
      // once we have correct types, we can type this properly
      debounce(updatedPlateNote => {
        // const updatedNote = toMd(updatedPlateNote)
        const updatedNote = toMd(toHTML(editor, updatedPlateNote))

        console.log('porumai ... udpated note ', updatedNote, updatedPlateNote)

        /* dispatch(
          updateNote({
            id,
            value: updatedNote,
          })
        ) */
      }, 2500),
    [id, dispatch, note, editor]
  )

  return (
    <div>
      <Plate
        id="porumai"
        plugins={plugins}
        components={components}
        options={options}
        editableProps={editableProps}
        initialValue={initialValue}
        onChange={updatedNote => {
          lazyUpdate(updatedNote)
        }}
      >
        <Toolbar />
      </Plate>
    </div>
  )
}

export default LiveNote
