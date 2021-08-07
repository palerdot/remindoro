import { browser } from 'webextension-polyfill-ts'
import { omit, isEmpty } from 'lodash'
import dayjs from 'dayjs'

import type { Remindoro } from '@app/Store/Slices/Remindoros'

import { syncToStorage, loadFromStorage } from '@app/Util/BrowserStorage'

// helper function to decide if we are dealing with firefox
// firefox does not allow adding action buttons like 'Close'
// export const isFirefox = window.navigator.userAgent.indexOf('Firefox') > -1

// helper function to deal with time
const SECONDS = 1000 // in milliseconds
const MINUTES = 60 * SECONDS
// buffer time to decide how fresh a reminder is
const NOTIFICATION_BUFFER_TIME = 15 * MINUTES

type Notify = {
  id: string
  title?: string
  note?: string
}

export function notify({ id, title, note }: Notify) {
  browser.notifications
    .create(id, {
      type: 'basic',
      iconUrl: '/images/icon-38.png',
      title: title || '',
      message: note || '',
    })
    .then(() => {
      // notification success callback
    })
    .catch(() => {
      // error showing notification
    })
}

/*
 * Notification class/helper
 *
 * abstracts away the logic of
 * - updating remindoros with next notification time
 * - notify remindoros
 * - saves updated remindoros to browser storages
 */

type Remindoros = Array<Remindoro>

export class Notification {
  toNotify: Remindoros = []

  // parameter properties
  // ref: https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties
  constructor(
    private remindoros: Remindoros,
    private showNotification: boolean
  ) {}

  /*
   * Scan (remindoros)
   *
   * - updates remindoro with new time
   * - adds remindoros 'toNotify' (if it has to be notified)
   */
  scan = () => {
    if (this.showNotification) {
    }
    return this.remindoros.map(this.check)
  }

  /*
   * Check (remindoro)
   *
   * MAIN module which decides whether to update the remindoro alarm time and display it using notification
   * takes a single remindoro data and updates it if needed;
   * also it internally updates an array of remindoros to be updated in "Notification" object so that
   * it can be used for showing notifications
   *
   * we will make sure we get only remindoro that has a reminder
   */
  check = (ro: Remindoro): Remindoro => {
    // CASE 1: no reminder scheduled
    // RESULT: WILL NOT NOTIFY; returning REMINDORO
    if (!ro.reminder) {
      // return the remindoro as it is
      return ro
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
        return ro
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
        return omit(ro, 'reminder')
      }

      // CASE 5: remindoro is atmost 15 mins (buffer time) old; (not older than 15 mins)
      // RESULT: WILL NOTIFY
      // we will add our 'toNotify'
      this.toNotify.push(ro)
      // we are going to clear the reminder (since it is not repeat)
      return omit(ro, 'reminder')
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

      // CASE 7: short repeat; exactly scheduled at current minute; short repeating remindoro
      // RESULT: WILL NOTIFY
      if (is_present) {
        // add to our notification list
        this.toNotify.push(ro)
        // update reminder time in remindoro
        ro.reminder.time = dayjs(ro.reminder.time)
          .add(ro.reminder.repeat.time, ro.reminder.repeat.interval)
          .valueOf()
        // return remindoro
        return ro
      }

      // CASE 8: reminder time is in past; short repeating remindoro
      // if the reminder time is already past when our event page scans, we will schedule
      // the next reminder from the current minute
      // RESULT: WILL NOT NOTIFY
      if (is_past) {
        // the next reminder from the current minute
        ro.reminder.time = dayjs()
          .add(ro.reminder.repeat.time, ro.reminder.repeat.interval)
          .valueOf()
        // return remindoro
        return ro
      }

      // CASE 9: remindoro is in future; short repeat remindoro
      // RESULT: WILL NOT NOTIFY
      return ro
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
          return ro
        }
        // CASE 12: current minute for today
        // RESULT: WILL NOTIFY
        console.log('LONG REPEAT CURRENT MINUTE !!?? ', ro.reminder.time)
        this.toNotify.push(ro)
        // update reminder time in remindoro ?
        // NOTE: this update was missed in 0.x version
        ro.reminder.time = dayjs(ro.reminder.time)
          .add(ro.reminder.repeat.time, ro.reminder.repeat.interval)
          .valueOf()
        // return remindoro
        return ro
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
          .add(
            find_future_jump(past_diff, duration),
            ro.reminder.repeat.interval
          )
          .valueOf()

        //RESULT: WILL NOT NOTIFY
        return ro
      }

      // CASE 14: not past; not present; probably future for long repeat
      console.log('LONG REPEAT FUTURE REMINDER')
      // WILL NOT NOTIFY
      return ro
    }

    // CASE 15: !!!
    // CAUTION: some UNKNOWN unique use case; do not proceed;
    // RESULT: WILL NOT NOTIFY
    return ro
  }

  /*
   * Notify
   */
  notify = () => {
    if (!this.showNotification) {
      // do not proceed
      console.log('porumai ... notifications paused ')
      return
    }

    if (isEmpty(this.toNotify)) {
      return
    }

    // show notification
    this.toNotify.forEach(ro => notify(ro))
  }

  /*
   * Save updated remindoros to store
   */
  updateStore = (remindoros: Remindoros) => {
    // first let us load existing data from storage
    loadFromStorage({
      onSuccess: currentData => {
        const updatedData = {
          ...currentData,
          remindoros,
        }
        // sync updated data to store
        syncToStorage({
          currentState: updatedData,
          onSuccess: () => {
            console.log('porumai ... ALARM => updated remindoros to store')
          },
          onError: () => {
            // error syncing to store
          },
        })
      },
      onError: () => {
        // error fetching updated data
        // should let go of this use case
      },
    })
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
