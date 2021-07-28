import React from 'react'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'

function Remindoros() {
  const remindoros = useSelector((state: RootState) => state.remindoros)

  if (remindoros.length === 0) {
    return <div>{'porumai ... no remindoros'}</div>
  }

  return (
    <div>
      {remindoros.map(ro => (
        <div>{ro.id}</div>
      ))}
    </div>
  )
}

export default Remindoros
