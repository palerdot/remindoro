import React from 'react'
import styled from '@emotion/styled'
import { DebouncedFunc } from '@lodash'

type Props = {
  id: string
  note?: string
  readOnly?: boolean
  onChange: DebouncedFunc<(updatedNote: string) => void>
}

const Wrapper = styled.div`
  textarea {
    color: ${props => props.theme.palette.text.primary};
    background: inherit;
    border: none;
    resize: none;

    &:focus {
      outline: none !important;
    }

    width: 100%;
    height: 400px;
    overflow-y: auto;

    padding: 8px;
  }
`

function PlainTextEditor({ readOnly, note, onChange }: Props) {
  return (
    <Wrapper>
      <textarea
        autoFocus={true}
        disabled={readOnly}
        defaultValue={note || ''}
        onChange={e => {
          onChange(e.target.value)
        }}
      ></textarea>
    </Wrapper>
  )
}

export default PlainTextEditor
