import React from 'react'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

interface Props extends Remindoro {}

function Info({ id, title }: Props) {
  return (
    <div>
      <div>{'Info'}</div>
      <div>{id}</div>
    </div>
  )
}

export default Info
