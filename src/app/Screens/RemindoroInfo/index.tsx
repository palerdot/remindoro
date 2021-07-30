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
        {
          'Cannot find information ... Please give feedback if you encounter this issue'
        }
        <Link to={Screens.Home}>{'Go to Home'}</Link>
      </div>
    )
  }

  return (
    <div>
      <Info {...remindoro} />
    </div>
  )
}

export default RemindoroInfo
