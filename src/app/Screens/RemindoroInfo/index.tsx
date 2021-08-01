import React from 'react'
import styled from 'styled-components'
import { useLocation, Link } from 'react-router-dom'
import { get } from 'lodash'

import { Screens } from '@app/Routes/'
import Info from '@app/Components/Remindoros/Remindoro/Info/'

const Holder = styled.div`
  height: 100%;
`

type Maybe<T> = T | undefined

function RemindoroInfo() {
  const location = useLocation()
  const { state } = location
  const remindoroIdInfo: Maybe<{
    id: string
  }> = get(state, 'remindoro')

  if (!remindoroIdInfo) {
    // IMPORTANT: This edge case should never happen
    return (
      <div>
        {
          'Cannot find information ... Please give feedback if you encounter this issue'
        }
        <Link to={Screens.Home}>{'Go to Home'}</Link>
      </div>
    )
  }

  const { id: remindoroId } = remindoroIdInfo

  return (
    <Holder>
      <Info remindoroId={remindoroId} />
    </Holder>
  )
}

export default RemindoroInfo
