import React, { useMemo } from 'react'
import Editor from 'rich-markdown-editor'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { debounce, isEqual } from 'lodash'

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

  &.read-only {
    padding-left: 16px;
  }

  & .ProseMirror[contenteditable] {
    height: 100%;
  }
`

function Note({ id, note, readOnly }: Props) {
  const dispatch = useDispatch()

  const lazyUpdate = useMemo(
    () =>
      debounce((saveFn: SaveFn) => {
        const updatedNote = saveFn()

        if (isEqual(updatedNote, note)) {
          // do not proceed
          return
        }

        dispatch(
          updateNote({
            id,
            value: updatedNote,
          })
        )
      }, 2500),
    [id, dispatch, note]
  )

  return (
    <Holder className={readOnly ? 'read-only' : ''}>
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
