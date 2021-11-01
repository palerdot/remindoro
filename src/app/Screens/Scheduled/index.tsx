import React from 'react'
import { useSelector } from 'react-redux'
import { orderBy } from '@lodash'

import type { RootState } from '@app/Store/'

import AddRemindoro from '@app/Components/AddRemindoro'
import Remindoros from '@app/Components/Remindoros/'

function Scheduled() {
  const remindoros = useSelector((state: RootState) => state.remindoros)

  // filter only scheduled remindoros
  const scheduled = remindoros.filter(r => r.reminder)

  // sort remindoros
  const sortedRemindoros = orderBy(scheduled, 'reminder.time', 'asc')

  return (
    <div>
      <Remindoros remindoros={sortedRemindoros} />
      <AddRemindoro />
    </div>
  )
}

export default Scheduled
