import React from 'react'
import styled from 'styled-components'
import { orderBy } from 'lodash'

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

  // sort remindoros
  const sortedRemindoros = orderBy(remindoros, 'updated', 'desc')

  return (
    <Holder>
      {sortedRemindoros.map(ro => (
        <Gist key={ro.id} {...ro} />
      ))}
    </Holder>
  )
}

export default Remindoros
