import React from 'react'
import { useSelector } from 'react-redux'
import { orderBy } from '@lodash'

import type { RootState } from '@app/Store/'

import AddRemindoro from '@app/Components/AddRemindoro'
import Remindoros from '@app/Components/Remindoros/'

function Home() {
  const remindoros = useSelector((state: RootState) => state.remindoros)

  // sort remindoros
  const sortedRemindoros = orderBy(remindoros, 'updated', 'desc')

  return (
    <div>
      <Remindoros remindoros={sortedRemindoros} />
      <AddRemindoro />
    </div>
  )
}

export default Home
