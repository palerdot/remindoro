import React from 'react'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'

import AddRemindoro from '@app/Components/AddRemindoro'
import Remindoros from '@app/Components/Remindoros/'

function Home() {
  const remindoros = useSelector((state: RootState) => state.remindoros)

  return (
    <div>
      <Remindoros remindoros={remindoros} />
      <AddRemindoro />
    </div>
  )
}

export default Home
