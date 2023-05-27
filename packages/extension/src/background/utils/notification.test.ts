import dayjs from 'dayjs'

import { RemindoroType, RepeatDuration } from '@app/Store/Slices/Remindoros'
import { Notification, find_future_jump } from './notification'

// ref: https://jestjs.io/docs/expect#expectextendmatchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeWithinRange(a: number, b: number): R
    }
  }
}

expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})

/*
 * Notification tests
 *
 * for clarity, we will use one remindoro per each case
 * so that is easy to assert stuffs
 */

describe('Notification modules are working fine', () => {
  // CASE 1: no reminder scheduled
  // RESULT: WILL NOT NOTIFY; returning REMINDORO
  test('CASE 1: No reminder Scheduled - NO NOTIFICATION', () => {
    const sample_remindoro = {
      id: 'porumai',
      title: 'porumai',
      note: 'wait and hope ... ',
      type: RemindoroType.Note,
      created: Date.now(),
      updated: Date.now(),
    }
    const notification = new Notification([sample_remindoro], false)
    const updated_ros = notification.scan()

    // we have our updated ro back
    expect(updated_ros).toHaveLength(1)
    const ro = updated_ros[0]
    // we should get same remindoro back
    expect(ro).toMatchObject(sample_remindoro)
    // we should not have a reminder key
    expect(ro).not.toHaveProperty('reminder')
    // no notification
    expect(notification.toNotify).toHaveLength(0)
  })

  // CASE 2: NO REPEAT
  describe('CASE 2: NO REPEAT', () => {
    // CASE 3: remindoro is in future
    // RESULT: WILL NOT NOTIFY; returning REMINDORO
    test('CASE 3: Remindoro is in future - NO NOTIFICATION', () => {
      const sample_remindoro = {
        id: 'porumai',
        title: 'porumai',
        note: 'wait and hope ... ',
        type: RemindoroType.Note,
        created: Date.now(),
        updated: Date.now(),
        reminder: {
          // future time
          time: Date.now() + 13 * 60 * 1000,
        },
      }
      const notification = new Notification([sample_remindoro], false)
      const updated_ros = notification.scan()

      // we have our updated ro back
      expect(updated_ros).toHaveLength(1)
      const ro = updated_ros[0]
      // we should get same remindoro back
      expect(ro).toMatchObject(sample_remindoro)
      // this will be notified
      expect(notification.toNotify).toHaveLength(0)
    })

    // CASE 4: remindoro is older than 15 mins (buffer time). NOT FRESH;
    // very past event STILL ALIVE (maybe browser was not opened for quite some time)
    // RESULT: WILL NOT NOTIFY; returning REMINDORO by CLEARING remindoro time
    test('CASE 4: remindoro is older than 15 mins (buffer time) - NO NOTIFICATION', () => {
      const sample_remindoro = {
        id: 'porumai',
        title: 'porumai',
        note: 'wait and hope ... ',
        type: RemindoroType.Note,
        created: Date.now(),
        updated: Date.now(),
        reminder: {
          // older than 15 mins buffer time
          time: Date.now() - 16 * 60 * 1000,
        },
      }
      const notification = new Notification([sample_remindoro], false)
      const updated_ros = notification.scan()

      // we have our updated ro back
      expect(updated_ros).toHaveLength(1)
      const ro = updated_ros[0]
      expect(ro.id).toEqual(sample_remindoro.id)
      // we should not have a reminder key (since it is stale and past buffer time)
      expect(ro).not.toHaveProperty('reminder')
      // this will be notified
      expect(notification.toNotify).toHaveLength(0)
    })

    // CASE 5: remindoro is atmost 15 mins (buffer time) old; (not older than 15 mins)
    // RESULT: WILL NOTIFY
    // we will add our 'toNotify'
    test('CASE 5: Notification not older than Buffer time (< 15 mins old) - NOTIFICATION', () => {
      const sample_remindoro = {
        id: 'porumai',
        title: 'porumai',
        note: 'wait and hope ... ',
        type: RemindoroType.Note,
        created: Date.now(),
        updated: Date.now(),
        reminder: {
          time: Date.now() - 13 * 60 * 1000,
        },
      }
      const notification = new Notification([sample_remindoro], false)
      const updated_ros = notification.scan()

      // we have our updated ro back
      expect(updated_ros).toHaveLength(1)
      const ro = updated_ros[0]
      expect(ro.id).toEqual(sample_remindoro.id)
      // we should not have a reminder key (since it is not repeat)
      expect(ro).not.toHaveProperty('reminder')
      // this will be notified
      expect(notification.toNotify).toHaveLength(1)
    })
  })

  // CASE 6: Repeat reminders
  describe('CASE 6: REPEAT REMINDERS', () => {
    // CASE 7: short repeat; exactly scheduled at current minute; short repeating remindoro
    // RESULT: WILL NOTIFY
    test('CASE 7: Short Repeat @Current Minute - NOTIFICATION', () => {
      const sample_remindoro = {
        id: 'porumai',
        title: 'porumai',
        note: 'wait and hope ... ',
        type: RemindoroType.Note,
        created: Date.now(),
        updated: Date.now(),
        reminder: {
          // should be shown now
          time: Date.now(),
          repeat: {
            time: 45,
            interval: 'minutes' as RepeatDuration,
          },
        },
      }

      const notification = new Notification([sample_remindoro], false)
      const updated_ros = notification.scan()

      // we have our updated ro back
      expect(updated_ros).toHaveLength(1)
      const ro = updated_ros[0]
      expect(ro.id).toEqual(sample_remindoro.id)
      // our reminder time should be updated
      // expect(ro).toMatchObject(expected_remindoro)
      const expected_time = dayjs().add(45, 'minutes').valueOf()
      expect(ro.reminder?.time).toBeWithinRange(
        expected_time - 314,
        expected_time
      )
      // this will be notified
      expect(notification.toNotify).toHaveLength(1)
    })

    // CASE 8: reminder time is in past; short repeating remindoro
    // if the reminder time is already past when our event page scans, we will schedule
    // the next reminder from the current minute
    // RESULT: WILL NOT NOTIFY
    test('CASE 8: Past short repeating remindoro - NO NOTIFICATION', () => {
      const sample_remindoro = {
        id: 'porumai',
        title: 'porumai',
        note: 'wait and hope ... ',
        type: RemindoroType.Note,
        created: Date.now(),
        updated: Date.now(),
        reminder: {
          // past reminder  (past atleast a minute)
          time: Date.now() - 72 * 1000,
          repeat: {
            time: 45,
            interval: 'minutes' as RepeatDuration,
          },
        },
      }

      const notification = new Notification([sample_remindoro], false)
      const updated_ros = notification.scan()

      // we have our updated ro back
      expect(updated_ros).toHaveLength(1)
      const ro = updated_ros[0]
      expect(ro.id).toEqual(sample_remindoro.id)
      // our reminder time should be updated
      // we will assert if it is within an acceptable range (1s)
      const expected_time = dayjs().add(45, 'minutes').valueOf()
      expect(ro.reminder?.time).toBeWithinRange(
        expected_time - 314,
        expected_time
      )
      // this will NOT be notified
      expect(notification.toNotify).toHaveLength(0)
    })

    // CASE 9: Future short repeat remindoro
    test('CASE 9: Future short repeating remindoro - NO NOTIFICATION', () => {
      const sample_remindoro = {
        id: 'porumai',
        title: 'porumai',
        note: 'wait and hope ... ',
        type: RemindoroType.Note,
        created: Date.now(),
        updated: Date.now(),
        reminder: {
          // past reminder  (in future atleast a minute)
          time: Date.now() + 72 * 1000,
          repeat: {
            time: 45,
            interval: 'minutes' as RepeatDuration,
          },
        },
      }

      const notification = new Notification([sample_remindoro], false)
      const updated_ros = notification.scan()

      // we have our updated ro back
      expect(updated_ros).toHaveLength(1)
      const ro = updated_ros[0]
      expect(ro.id).toEqual(sample_remindoro.id)
      // we should get our remindoro back
      expect(ro).toMatchObject(sample_remindoro)
      // this will NOT be notified
      expect(notification.toNotify).toHaveLength(0)
    })

    describe('CASE 10: LONG REPEAT', () => {
      test('CASE 11: scheduled today, but NOT in current minute - NO NOTIFICATION', () => {
        const sample_remindoro = {
          id: 'porumai',
          title: 'porumai',
          note: 'wait and hope ... ',
          type: RemindoroType.Note,
          created: Date.now(),
          updated: Date.now(),
          reminder: {
            // past reminder  (in future atleast a minute)
            time: Date.now() + 172 * 1000,
            repeat: {
              time: 5,
              interval: 'days' as RepeatDuration,
            },
          },
        }

        const notification = new Notification([sample_remindoro], false)
        const updated_ros = notification.scan()

        // we have our updated ro back
        expect(updated_ros).toHaveLength(1)
        const ro = updated_ros[0]
        expect(ro.id).toEqual(sample_remindoro.id)
        // we should get our remindoro back
        expect(ro).toMatchObject(sample_remindoro)
        // this will NOT be notified
        expect(notification.toNotify).toHaveLength(0)
      })

      test('CASE 12: scheduled TODAY/NOW - NOTIFICATION', () => {
        const sample_remindoro = {
          id: 'porumai',
          title: 'porumai',
          note: 'wait and hope ... ',
          type: RemindoroType.Note,
          created: Date.now(),
          updated: Date.now(),
          reminder: {
            // scheduled now
            time: Date.now(),
            repeat: {
              time: 5,
              interval: 'days' as RepeatDuration,
            },
          },
        }

        const expected_remindoro = {
          ...sample_remindoro,
          reminder: {
            ...sample_remindoro.reminder,
            // 45 minutes from now
            time: dayjs(sample_remindoro.reminder.time)
              .add(5, 'days')
              .valueOf(),
          },
        }

        const notification = new Notification([sample_remindoro], false)
        const updated_ros = notification.scan()

        // we have our updated ro back
        expect(updated_ros).toHaveLength(1)
        const ro = updated_ros[0]
        expect(ro.id).toEqual(sample_remindoro.id)
        // we should get our remindoro back
        expect(ro).toMatchObject(expected_remindoro)
        // this will NOT be notified
        expect(notification.toNotify).toHaveLength(1)
      })

      test('CASE 13: scheduled PAST long repeat - NO NOTIFICATION', () => {
        const sample_remindoro = {
          id: 'porumai',
          title: 'porumai',
          note: 'wait and hope ... ',
          type: RemindoroType.Note,
          created: Date.now(),
          updated: Date.now(),
          reminder: {
            // scheduled 3 days in past
            time: dayjs().subtract(3, 'days').valueOf(),
            repeat: {
              time: 5,
              interval: 'days' as RepeatDuration,
            },
          },
        }

        const expected_remindoro = {
          ...sample_remindoro,
          reminder: {
            ...sample_remindoro.reminder,
            // 2 days from now (3 days in past + 5 days)
            time: dayjs(sample_remindoro.reminder.time)
              .add(2, 'days')
              .valueOf(),
          },
        }

        const notification = new Notification([sample_remindoro], false)
        const updated_ros = notification.scan()

        // we have our updated ro back
        expect(updated_ros).toHaveLength(1)
        const ro = updated_ros[0]
        expect(ro.id).toEqual(sample_remindoro.id)

        expect(ro).toMatchObject(expected_remindoro)
        // this will NOT be notified
        expect(notification.toNotify).toHaveLength(0)
      })

      test('CASE 14: Future long repeat - NO NOTIFICATION', () => {
        const sample_remindoro = {
          id: 'porumai',
          title: 'porumai',
          note: 'wait and hope ... ',
          type: RemindoroType.Note,
          created: Date.now(),
          updated: Date.now(),
          reminder: {
            // scheduled in future
            time: Date.now() + 172 * 60 * 1000,
            repeat: {
              time: 5,
              interval: 'days' as RepeatDuration,
            },
          },
        }

        const notification = new Notification([sample_remindoro], false)
        const updated_ros = notification.scan()

        // we have our updated ro back
        expect(updated_ros).toHaveLength(1)
        const ro = updated_ros[0]
        expect(ro.id).toEqual(sample_remindoro.id)
        // we should get our remindoro back
        expect(ro).toMatchObject(sample_remindoro)
        // this will NOT be notified
        expect(notification.toNotify).toHaveLength(0)
      })
    })
  })

  test('CASE 15: unknown case', () => {
    // we don't know about this unknown case
    expect('porumai').toBe('porumai')
  })
})

describe('future long jump', () => {
  test('3 days in past, 5 days repeat => +2', () => {
    expect(find_future_jump(3, 5)).toEqual(2)
  })

  test('13 days in past, 5 days repeat => +2', () => {
    expect(find_future_jump(13, 5)).toEqual(2)
  })

  test('10 days in past, 3 days repeat => +2', () => {
    expect(find_future_jump(10, 3)).toEqual(2)
  })

  test('3 days in past, 3 days repeat => +2', () => {
    expect(find_future_jump(3, 3)).toEqual(3)
  })
})
