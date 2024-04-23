import dayjs from 'dayjs'
import { omit, cloneDeep } from 'lodash-es'

import { Remindoro } from '../types/'

// helper function to deal with time
const SECONDS = 1000 // in milliseconds
const MINUTES = 60 * SECONDS
// buffer time to decide how fresh a reminder is
const NOTIFICATION_BUFFER_TIME = 15 * MINUTES

export function notification_check(ro: Remindoro): {
  remindoro: Remindoro
  toNotify?: Remindoro
} {
  // CASE 1: no reminder scheduled
  // RESULT: WILL NOT NOTIFY; returning REMINDORO
  if (!ro.reminder) {
    // return the remindoro as it is
    return {
      remindoro: cloneDeep(ro),
    }
  }

  // we are using underscore casing
  // - since we find it more legible overall (compared to camelCase)
  // - also this is in the spirit of the orignal codebase

  // first let us take the current time
  const CURRENT_TIME = Date.now()

  const TIME_DELTA = CURRENT_TIME - ro.reminder.time
  // helper time utils
  // past: will be positive (1600000000000 - 1500000000000)
  const IS_PAST = TIME_DELTA > 0
  // future: will be negative (1600000000000 - 1700000000000)
  const IS_FUTURE = TIME_DELTA < 0

  // CASE 2: NON REPEATABLE reminders
  if (!ro.reminder.repeat) {
    // CASE 3: remindoro is in future
    // RESULT: WILL NOT NOTIFY; returning REMINDORO
    if (IS_FUTURE) {
      // returning the remindoro as it is
      return {
        remindoro: cloneDeep(ro),
      }
    }

    // our reminder is very old if it is past our buffer time
    // for past, delta will be positive
    // we are checking if it is not too old
    const TO_BE_NOTIFIED = IS_PAST && TIME_DELTA <= NOTIFICATION_BUFFER_TIME
    // CASE 4: remindoro is older than 15 mins (buffer time). NOT FRESH;
    // very past event STILL ALIVE (maybe browser was not opened for quite some time)
    // RESULT: WILL NOT NOTIFY; returning REMINDORO by CLEARING remindoro time
    if (!TO_BE_NOTIFIED) {
      console.log('clearing past remindoro')

      return {
        remindoro: omit(ro, 'reminder'),
      }
    }

    // CASE 5: remindoro is atmost 15 mins (buffer time) old; (not older than 15 mins)
    // RESULT: WILL NOTIFY
    // we will add our 'toNotify'

    return {
      remindoro: omit(ro, 'reminder'),
      toNotify: cloneDeep(ro),
    }
  }

  // CASE 6: REPEATABLE remindoros
  // short repeat => minutes, hours; long repeat => days, months
  const IS_SHORT_REPEAT = ['minutes', 'hours'].includes(
    ro.reminder.repeat.interval
  )
  const IS_LONG_REPEAT = !IS_SHORT_REPEAT

  if (IS_SHORT_REPEAT) {
    // determines if the reminder time is in the same day exactly to the scheduled "minute"
    const is_past = dayjs().isAfter(ro.reminder.time, 'minute')
    const is_present = dayjs().isSame(ro.reminder.time, 'minute')

    // Browser extension quirk: Browser can trigger timer one minute late
    // In that case, we need to keep track of it and adjust the timer so that there
    // are no cascading delays
    // ref: https://github.com/palerdot/remindoro/issues/36
    const milliSecondsDiff = Date.now() - new Date(ro.reminder.time).getTime()
    const isOneMinutePast = milliSecondsDiff > 0 && milliSecondsDiff < 1314
    // CASE 7: short repeat; exactly scheduled at current minute; short repeating remindoro
    // RESULT: WILL NOTIFY
    if (is_present) {
      // add to our notification list
      const toNotify = cloneDeep(ro)
      // update reminder time in remindoro
      ro.reminder.time = dayjs(ro.reminder.time)
        .add(ro.reminder.repeat.time, ro.reminder.repeat.interval)
        .valueOf()

      return {
        remindoro: cloneDeep(ro),
        toNotify,
      }
    }

    // CASE 8: reminder time is in past; short repeating remindoro
    // if the reminder time is already past when our event page scans, we will schedule
    // the next reminder from the current minute
    // RESULT: WILL NOT NOTIFY
    if (is_past) {
      // the next reminder from the current minute
      ro.reminder.time = dayjs()
        .subtract(isOneMinutePast ? 1 : 0, 'minute')
        .add(ro.reminder.repeat.time, ro.reminder.repeat.interval)
        .valueOf()
      // return remindoro
      return {
        remindoro: cloneDeep(ro),
      }
    }

    // CASE 9: remindoro is in future; short repeat remindoro
    // RESULT: WILL NOT NOTIFY
    return {
      remindoro: cloneDeep(ro),
    }
  }

  // long repeat => days, months

  // we will notify on the exact time scheduled;
  // and will not update the reminder time till the day is done
  // determines if the reminder time is in the same day exactly to the scheduled "DAY"

  if (IS_LONG_REPEAT) {
    // is_past => checks if current moment is after the reminder time
    const is_past = dayjs().isAfter(ro.reminder.time, 'day')
    const is_today = dayjs().isSame(ro.reminder.time, 'day')

    // CASE 10: scheduled today for long repeat
    if (is_today) {
      // CASE 11: Not current minute - we will exactly notify on the scheduled minute
      const is_current_minute = dayjs().isSame(ro.reminder.time, 'minute')
      if (!is_current_minute) {
        //RESULT: WILL NOT notify
        return {
          remindoro: cloneDeep(ro),
        }
      }
      // CASE 12: current minute for today
      // RESULT: WILL NOTIFY
      console.log('LONG REPEAT CURRENT MINUTE !!?? ', ro.reminder.time)
      const toNotify = cloneDeep(ro)
      // update reminder time in remindoro ?
      // NOTE: this update was missed in 0.x version
      ro.reminder.time = dayjs(ro.reminder.time)
        .add(ro.reminder.repeat.time, ro.reminder.repeat.interval)
        .valueOf()
      // return remindoro
      return {
        remindoro: cloneDeep(ro),
        toNotify,
      }
    }

    // CASE 13: scheduled time is in the past
    // we need to update the next reminder which should be in future
    if (is_past) {
      // find past diff
      const past_diff = dayjs().diff(
        dayjs(ro.reminder.time),
        ro.reminder.repeat.interval
      )
      const duration = ro.reminder.repeat.time

      // updating reminder time with future reminder time
      ro.reminder.time = dayjs(ro.reminder.time)
        .add(find_future_jump(past_diff, duration), ro.reminder.repeat.interval)
        .valueOf()

      //RESULT: WILL NOT NOTIFY
      return {
        remindoro: cloneDeep(ro),
      }
    }

    // CASE 14: not past; not present; probably future for long repeat
    console.log('LONG REPEAT FUTURE REMINDER')
    // WILL NOT NOTIFY
    return {
      remindoro: cloneDeep(ro),
    }
  }

  // CASE 15: !!!
  // CAUTION: some UNKNOWN unique use case; do not proceed;
  // RESULT: WILL NOT NOTIFY
  return {
    remindoro: cloneDeep(ro),
  }
}

/*
 * Find future jump for long repeat
 *
 * 13 (past diff), 5 (duration) => 2
 * 3 (past diff), 5 (duration) => 2
 */

export function find_future_jump(past_diff: number, duration: number): number {
  const rem = past_diff % duration

  return duration - rem
}
