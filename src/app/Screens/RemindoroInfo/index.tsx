import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { get } from 'lodash'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { Screens } from '@app/Routes/'
import Info from '@app/Components/Remindoros/Remindoro/Info/'

type Maybe<T> = T | undefined

function RemindoroInfo() {
  const location = useLocation()

  const { state } = location

  const remindoro: Maybe<Remindoro> = get(state, 'remindoro')

  if (!remindoro) {
    // IMPORTANT: This edge case should never happen
    return (
      <div>
        {'Cannot find information ...'}
        <Link to={Screens.Home}>{'Go to Home'}</Link>
      </div>
    )
  }

  console.log('porumai ... location data ', location)

  return (
    <div>
      <div>{'porumai ... remindoro info'}</div>
      <div>{remindoro.id}</div>
    </div>
  )
}

export default RemindoroInfo
