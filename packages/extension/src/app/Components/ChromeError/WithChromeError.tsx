import React from 'react'
import { get, some, isNumber, isBoolean } from '@lodash'
import { useSelector } from 'react-redux'

import type { RootState } from '@app/Store/'

import { OldRemindoro } from '@app/Util/cleaners'
import { Remindoro } from '@app/Store/Slices/Remindoros/'

// HOC that renders the children component if chrome migration is not done
type Props = {
  children: React.ReactNode
}

export function isOldRemindoro(
  remindoro: OldRemindoro | Remindoro
): remindoro is OldRemindoro {
  const isBadRepeat = isBoolean(get(remindoro, 'reminder.is_repeat'))
  const reminderPresent = get(remindoro, 'reminder', false)
  const isBadTime =
    reminderPresent && !isNumber(get(remindoro, 'reminder.time'))

  return isBadRepeat || isBadTime
}

function isDataCorrupt(data: Array<{}>): boolean {
  // we have one main check
  // check 1: reminder.is_repeat is a boolean
  // check 2: reminder.time should be a number
  return some(data, isOldRemindoro)
}

function WithChromeError({ children }: Props) {
  const remindoros = useSelector((state: RootState) => state.remindoros)

  if (!isDataCorrupt(remindoros)) {
    return null
  }

  return <>{children}</>
}

export default WithChromeError
