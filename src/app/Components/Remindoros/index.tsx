import React from 'react'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Gist from './Remindoro/Gist/'

type Props = {
  remindoros: Array<Remindoro>
}

function Remindoros({ remindoros }: Props) {
  if (remindoros.length === 0) {
    return <div>{'No remindoros'}</div>
  }

  return (
    <div>
      {remindoros.map(ro => (
        <Gist key={ro.id} {...ro} />
      ))}
    </div>
  )
}

export default Remindoros
