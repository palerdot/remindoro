import React from 'react'
import styled from 'styled-components'
import Editor from 'rich-markdown-editor'

const Holder = styled.div``

type Props = {
  id: string
  note: string
}

function Preview({ note }: Props) {
  return (
    <Holder>
      <Editor readOnly defaultValue={note} />
    </Holder>
  )
}

export default Preview
