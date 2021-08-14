import dayjs from 'dayjs'
import { omit } from '@lodash'

import type { Remindoro, Repeat } from '@app/Store/Slices/Remindoros/'

type Reminder = Remindoro['reminder']

// util function to correctly update schedule
// handles after reminder => on/off
// adds default reminder => 45 minutes from now
export function handleReminderChange(
  scheduleOn: boolean,
  currentSchedule: Reminder
) {
  let newSchedule = currentSchedule

  if (scheduleOn) {
    // we need to add next schedule 45 minutes from now
    newSchedule = {
      time: dayjs().add(45, 'minutes').valueOf(),
    }
  } else {
    // no schedule
    newSchedule = undefined
  }

  return newSchedule
}

// util function to correctly update schedule
// handles after repeat => on/off
// adds default repeat => every 45 minutes
export function handleRepeatChange(
  repeatOn: Boolean,
  currentSchedule: Reminder
) {
  // handling an edge case which should not happen
  // if we happen to have no schedule (but repeat is turned on)
  // we will just return a no schedule
  // IMPORTANT: we should never hit this case
  if (!currentSchedule) {
    return undefined
  }

  let newSchedule = currentSchedule

  if (repeatOn) {
    // we need to add next schedule 45 minutes from now
    newSchedule = {
      ...currentSchedule,
      repeat: {
        time: 45,
        interval: 'minutes',
      },
    }
  } else {
    // no repeat; remove repeat key from schedule
    newSchedule = omit(currentSchedule, 'repeat')
  }

  return newSchedule
}

// handles repeat duration change
export function handleRepeatDurationChange(
  time: Repeat['time'],
  currentSchedule: Reminder
): Reminder {
  // handling an edge case which should not happen
  // if we happen to have no schedule (but repeat is turned on)
  // we will just return a no schedule
  // IMPORTANT: we should never hit this case
  if (!currentSchedule) {
    return undefined
  }

  // Another unlikely edge case
  // if repeat is not turned on (but we got a request to configure repeat)
  // we will just give back the same schedule
  if (!currentSchedule.repeat) {
    return undefined
  }

  // we have reminder with repeat
  return {
    ...currentSchedule,
    repeat: {
      ...currentSchedule.repeat,
      // update new duration
      time,
    },
  }
}

// handles repeat interval change
export function handleRepeatIntervalChange(
  interval: Repeat['interval'],
  currentSchedule: Reminder
): Reminder {
  // handling an edge case which should not happen
  // if we happen to have no schedule (but repeat is turned on)
  // we will just return a no schedule
  // IMPORTANT: we should never hit this case
  if (!currentSchedule) {
    return undefined
  }

  // Another unlikely edge case
  // if repeat is not turned on (but we got a request to configure repeat)
  // we will just give back the same schedule
  if (!currentSchedule.repeat) {
    return undefined
  }

  // we have reminder with repeat
  return {
    ...currentSchedule,
    repeat: {
      ...currentSchedule.repeat,
      // update new duration
      interval,
    },
  }
}
