import React from 'react'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Title from './Title'
import Note from './Note'

interface Props extends Remindoro {}

function Info({ id, title, note }: Props) {
  return (
    <div>
      <div>{'Info'}</div>
      <div>{id}</div>
      <Title id={id} title={title} />
      <Note id={id} note={note} readOnly={false} />
    </div>
  )
}

export default Info
