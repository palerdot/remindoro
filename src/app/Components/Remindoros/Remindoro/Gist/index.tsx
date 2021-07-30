import React from 'react'

import type { Remindoro as RemindoroType } from '@app/Store/Slices/Remindoros/'

function Card({ id, title }: RemindoroType) {
  return (
    <div>
      <div>{id}</div>
      <div>{title}</div>
    </div>
  )
}

export default Card
