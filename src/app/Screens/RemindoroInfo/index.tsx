import React from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'

import { Screens } from '@app/Routes/'
import Info from '@app/Components/Remindoros/Remindoro/Info/'

const Holder = styled.div`
  height: 100%;
`

type Maybe<T> = T | undefined

function RemindoroInfo() {
  const pathInfo = useParams<
    Maybe<{
      id: string
    }>
  >()

  if (!pathInfo?.id) {
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

  const { id: remindoroId } = pathInfo

  return (
    <Holder>
      <Info remindoroId={remindoroId} />
    </Holder>
  )
}

export default RemindoroInfo
