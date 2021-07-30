import React from 'react'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Title from './Title'

interface Props extends Remindoro {}

function Info({ id, title }: Props) {
  return (
    <div>
      <div>{'Info'}</div>
      <div>{id}</div>
      <Title id={id} title={title} />
    </div>
  )
}

export default Info
