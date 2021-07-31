import React, { useCallback } from 'react'
import Editor from 'rich-markdown-editor'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { debounce } from 'lodash'

import { updateNote } from '@app/Store/Slices/Remindoros'

type Props = {
  id: string
  note: string
  readOnly: boolean
}

// Rich markdown editor save function signature
type SaveFn = () => string

const defaultProps = {
  readOnly: true,
}

const Holder = styled.div`
  display: flex;
  background: white;

  padding: 4px;
  padding-left: 28px;

  & .ProseMirror[contenteditable] {
    height: 100%;
  }
`

function Note({ id, note, readOnly }: Props) {
  const dispatch = useDispatch()

  const lazyUpdate = useCallback(
    debounce((saveFn: SaveFn) => {
      const updatedNote = saveFn()
      dispatch(
        updateNote({
          id,
          value: updatedNote,
        })
      )
    }, 2500),
    []
  )

  return (
    <Holder>
      <Editor
        defaultValue={note}
        readOnly={readOnly}
        disableExtensions={['image', 'container_notice']}
        onChange={lazyUpdate}
      />
    </Holder>
  )
}

Note.defaultProps = defaultProps

export default Note
