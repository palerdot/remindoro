import React, { useMemo } from 'react'
import Editor from 'rich-markdown-editor'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { debounce, isEqual, get } from 'lodash'

import { updateNote } from '@app/Store/Slices/Remindoros'

type Props = {
  id: string
  note: string

  isFocussed: boolean
  setFocus: React.Dispatch<React.SetStateAction<boolean>>
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

  & > div {
    width: 100%;
  }
`

function Note({ id, note, isFocussed, setFocus }: Props) {
  const dispatch = useDispatch()
  const readOnly = !isFocussed

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
    <Holder
      className={readOnly ? 'read-only' : ''}
      onClick={() => {
        setFocus(true)
      }}
    >
      <Editor
        defaultValue={note}
        readOnly={readOnly}
        autoFocus={isFocussed}
        disableExtensions={['image', 'container_notice']}
        onChange={lazyUpdate}
        handleDOMEvents={{
          focus: () => {
            setFocus(true)
            return false
          },
          blur: (_, event) => {
            const relatedTarget: HTMLElement | undefined = get(
              event,
              'relatedTarget'
            )
            if (relatedTarget) {
              const classList = relatedTarget.classList
              const isMenuTrigger = classList.contains('block-menu-trigger')

              if (isMenuTrigger) {
                // menu trigger
                // do not proceed
                return false
              }
            }

            setFocus(false)
            return false
          },
        }}
      />
    </Holder>
  )
}

Note.defaultProps = defaultProps

export default Note
