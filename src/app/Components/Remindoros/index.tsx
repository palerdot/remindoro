import React from 'react'
import styled from 'styled-components'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Gist from './Remindoro/Gist/'

type Props = {
  remindoros: Array<Remindoro>
}

const Holder = styled.div`
  padding-bottom: 32px;
`

function Remindoros({ remindoros }: Props) {
  if (remindoros.length === 0) {
    return <div>{'No remindoros'}</div>
  }

  return (
    <Holder>
      {remindoros.map(ro => (
        <Gist key={ro.id} {...ro} />
      ))}
    </Holder>
  )
}

export default Remindoros
