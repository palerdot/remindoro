import React from 'react'
import Markdown from 'markdown-it'

type Props = {
  id: string
  note: string
}

const md = Markdown()

function Preview({ id, note }: Props) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: md.render(note),
      }}
    ></div>
  )
}

export default Preview
