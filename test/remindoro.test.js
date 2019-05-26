import { calculate_remindoro_id, Notification } from '../app/js/utils.js'
import moment from 'moment'
import _ from 'lodash'

describe('Porumai!', () => {
  test('Porumai! should be equal Porumai', () => {
    // assert.equal('Porumai', 'Porumai')
    expect('Porumai').toBe('Porumai')
  })
})

// calculating remindoro ids for empty remindoro array
describe('Checking Remindoro id counter for empty remindoro array', () => {
  test('should return 1', () => {
    const ros = []
    const ro_id = calculate_remindoro_id(ros)
    // assert.equal(ro_id, 1)
    expect(ro_id).toEqual(1)
  })
})

// calculating remindoro ids for remindoro array
describe('Checking Remindoro id counter', () => {
  test('should return 17', () => {
    const ros = [
      {
        id: 16,
      },
    ]
    const ro_id = calculate_remindoro_id(ros)
    // assert.equal(ro_id, 17)
    expect(ro_id).toEqual(17)
  })
})

// CASE 1: checking reminder time for empty ro
describe('CASE 1: No reminder set', () => {
  test('should return the same object', () => {
    const check = Notification.check

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        time: null, // if null no alarm set,
        is_repeat: false,
        repeat: {
          interval: 'months',
          time: 1,
        },
      },
    }

    // assert.equal(ro, check(ro))
    expect(ro).toEqual(check(ro))
  })
})

// CASE 3: NON REPEATABLE => if remindoro is in future should return the same ro
describe('CASE 3: NON REPEATABLE  => Reminder time is in future', () => {
  test('should return the same object', () => {
    // clear the to notify queue
    Notification.to_notify = []

    const check = Notification.check

    // reminder time is in future
    const future_reminder_time = moment().add('7', 'days')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        // reminder time is in future
        time: future_reminder_time,
        is_repeat: false,
        repeat: {
          interval: 'months',
          time: 1,
        },
      },
    }
    // assert.equal(ro, check(ro))
    expect(ro).toEqual(check(ro))
    // assert.equal(ro.reminder.time, future_reminder_time)
    expect(ro.reminder.time).toEqual(future_reminder_time)
    // assert.equal( [], Notification.to_notify );
    // ref: http://stackoverflow.com/questions/13225274/the-difference-between-assert-equal-and-assert-deepequal-in-javascript-testing-w
    // assert.deepEqual([], Notification.to_notify)
    expect(Notification.to_notify).toEqual([])
  })
})

// CASE 4: NON REPEATABLE => if remindoro is more than 15 mins old; return the ro by invalidating the reminder time
describe('CASE 4: NON REPEATABLE  => Reminder time is more than 15 mins old', () => {
  beforeEach(() => {
    // clear the to notify queue
    Notification.to_notify = []
  })

  test('should return the same object and reminder time should be false', () => {
    // reminder time more than 15 mins old
    const very_old_reminder_time = moment().subtract('1', 'days')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        // reminder time is more than 15 mins old
        time: very_old_reminder_time,
        is_repeat: false,
        repeat: {
          interval: 'months',
          time: 1,
        },
      },
    }

    // assert.equal(ro, Notification.check(ro))
    expect(ro).toEqual(Notification.check(ro))
    // assert.equal(false, Notification.check(ro).reminder.time)
    expect(Notification.check(ro).reminder.time).toEqual(false)
    //   assert.notEqual(
    //     Notification.check(ro).reminder.time,
    //     very_old_reminder_time
    //   )
    expect(Notification.check(ro).reminder.time).not.toBe(
      very_old_reminder_time
    )
    // assert.equal( ro.reminder.time, future_reminder_time );
    // assert.equal( [], Notification.to_notify );
    // ref: http://stackoverflow.com/questions/13225274/the-difference-between-assert-equal-and-assert-deepequal-in-javascript-testing-w
    // assert.deepEqual( [], Notification.to_notify );
  })

  test('notification queue should be empty', () => {
    // reminder time more than 15 mins old
    const very_old_reminder_time = moment().subtract('1', 'day')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        // reminder time is more than 15 mins old
        time: very_old_reminder_time,
        is_repeat: false,
        repeat: {
          interval: 'months',
          time: 1,
        },
      },
    }

    // assert.equal( ro, check(ro) );
    // assert.equal( ro.reminder.time, future_reminder_time );
    // assert.equal( [], Notification.to_notify );
    // ref: http://stackoverflow.com/questions/13225274/the-difference-between-assert-equal-and-assert-deepequal-in-javascript-testing-w
    // assert.deepEqual([], Notification.to_notify)
    expect(Notification.to_notify).toEqual([])
  })
})

// CASE 5: NON REPEATABLE => if remindoro is atmost 15 mins old; will notify remindoro
describe('CASE 5: NON REPEATABLE  => Reminder time atmost 15 mins old', () => {
  beforeEach(() => {
    // clear the to notify queue
    Notification.to_notify = []
  })

  test('should NOTIFY; queue should have one value', () => {
    // reminder time more than 15 mins old
    const very_recent_reminder_time = moment().subtract('1', 'minutes')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        // reminder time is more than 15 mins old
        time: very_recent_reminder_time,
        is_repeat: false,
        repeat: {
          interval: 'months',
          time: 1,
        },
      },
    }

    // assert.equal(ro, Notification.check(ro))
    expect(ro).toEqual(Notification.check(ro))
    // will notify
    // assert.equal(Notification.to_notify.length, 1)
    expect(Notification.to_notify).toHaveLength(1)
    // and clearing the reminder time
    // assert.equal(false, Notification.check(ro).reminder.time)
    expect(Notification.check(ro).reminder.time).toBeFalsy()
  })
})

// CASE 7, 8, 9: REPEATABLE => SHORT REPEAT
describe('REPEATABLE => SHORT REPEAT', () => {
  beforeEach(() => {
    // clear the to notify queue
    Notification.to_notify = []
  })

  test('CASE 7: EXACT MINUTE => should NOTIFY => queue should have one value; updating reminder time for next iteration', () => {
    const current_minute_time = moment()

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        // reminder time is more than 15 mins old
        time: current_minute_time,
        is_repeat: true,
        repeat: {
          interval: 'minutes',
          time: 45,
        },
      },
    }

    const next_reminder_time = moment(new Date(ro.reminder.time))
      .add(ro.reminder.repeat.time, ro.reminder.repeat.interval)
      .format()

    const checked_ro = Notification.check(ro)

    // assert.equal(ro, checked_ro)
    expect(ro).toEqual(checked_ro)
    // will notify
    // assert.equal(Notification.to_notify.length, 1)\
    expect(Notification.to_notify).toHaveLength(1)
    // and updating next reminder time
    // assert.equal(next_reminder_time, checked_ro.reminder.time)
    expect(next_reminder_time).toEqual(checked_ro.reminder.time)
  })

  test('CASE 8: PAST => should NOT NOTIFY => queue should empty; updating to next iteratin', () => {
    const past_time = moment().subtract('30', 'minutes')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        time: past_time,
        is_repeat: true,
        repeat: {
          interval: 'minutes',
          time: 45,
        },
      },
    }

    const next_reminder_time = moment()
      .add(ro.reminder.repeat.time, ro.reminder.repeat.interval)
      .format()

    const checked_ro = Notification.check(ro)

    // assert.equal(ro, checked_ro)
    expect(ro).toEqual(checked_ro)
    // will not notify
    // assert.equal(Notification.to_notify.length, 0)
    expect(Notification.to_notify).toHaveLength(0)
    // and updating next reminder time
    // assert.equal(next_reminder_time, checked_ro.reminder.time)
    expect(next_reminder_time).toEqual(checked_ro.reminder.time)
  })

  test('CASE 9: FUTURE => should NOT NOTIFY => queue should be empty', () => {
    const future_time = moment().add('30', 'minutes')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        time: future_time,
        is_repeat: true,
        repeat: {
          interval: 'minutes',
          time: 45,
        },
      },
    }

    const checked_ro = Notification.check(ro)

    // assert.equal(ro, checked_ro)
    expect(ro).toEqual(checked_ro)
    // will not notify
    // assert.equal(Notification.to_notify.length, 0)
    expect(Notification.to_notify).toHaveLength(0)
    // and reminder time should stay same
    // assert.equal(ro.reminder.time, checked_ro.reminder.time)
    expect(ro.reminder.time).toEqual(checked_ro.reminder.time)
  })
})

// LONG REPEAT
describe('REPEATABLE => LONG REPEAT', () => {
  beforeEach(() => {
    // clear the to notify queue
    Notification.to_notify = []
  })

  test('CASE 11: TODAY => not current minute (past) => WILL NOT NOTIFY', () => {
    const today_past_current_minute = moment().subtract('30', 'minutes')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        time: today_past_current_minute,
        is_repeat: true,
        repeat: {
          interval: 'minutes',
          time: 45,
        },
      },
    }

    const checked_ro = Notification.check(ro)

    // assert.equal(ro, checked_ro)
    expect(ro).toEqual(checked_ro)
    // will not notify
    // assert.equal(Notification.to_notify.length, 0)
    expect(Notification.to_notify).toHaveLength(0)
    // and reminder time should stay same
    // assert.equal(ro.reminder.time, checked_ro.reminder.time)
    expect(ro.reminder.time).toEqual(checked_ro.reminder.time)
  })

  test('CASE 12: TODAY => current minute => WILL NOTIFY => update next iteration', () => {
    const current_minute = moment()

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        time: current_minute,
        is_repeat: true,
        repeat: {
          interval: 'minutes',
          time: 45,
        },
      },
    }

    const checked_ro = Notification.check(ro)

    // assert.equal(ro, checked_ro)
    expect(ro).toEqual(checked_ro)
    // will not notify
    // assert.equal(Notification.to_notify.length, 1)
    expect(Notification.to_notify).toHaveLength(1)
    // and reminder time should stay same (we will update after today is past)
    // assert.equal(ro.reminder.time, checked_ro.reminder.time)
    expect(ro.reminder.time).toEqual(checked_ro.reminder.time)
  })

  test('CASE 13: PAST OF TODAY => WILL NOT NOTIFY', () => {
    const yesterday = moment().subtract('3', 'days')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        time: yesterday,
        is_repeat: true,
        repeat: {
          interval: 'days',
          time: 2,
        },
      },
    }

    const checked_ro = Notification.check(ro)

    // assert.equal(ro, checked_ro)
    expect(ro).toEqual(checked_ro)
    // will not notify
    // assert.equal(Notification.to_notify.length, 0)
    expect(Notification.to_notify).toHaveLength(0)
  })

  test('CASE 13: PAST OF TODAY => next iteration 1 days from now', () => {
    const yesterday = moment().subtract('3', 'days')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        time: yesterday,
        is_repeat: true,
        repeat: {
          interval: 'days',
          time: 2,
        },
      },
    }

    const checked_ro = Notification.check(ro)

    const next_reminder = moment(moment().startOf('day')).add('1', 'days')

    // assert.equal(ro, checked_ro)
    expect(ro).toEqual(checked_ro)
    // will not notify
    //   assert.equal(
    //     next_reminder.format(),
    //     moment(checked_ro.reminder.time)
    //       .startOf('day')
    //       .format()
    //   )
    expect(next_reminder.format()).toEqual(
      moment(checked_ro.reminder.time)
        .startOf('day')
        .format()
    )
  })

  test('CASE 14: FUTURE OF TODAY => WILL NOT NOTIFY', () => {
    const future = moment().add('3', 'days')

    const ro = {
      id: 17,
      type: 'list/note',
      note: '', // if note contains the string here
      list: [], // if list contains the list details
      created: '',
      updated: '',
      reminder: {
        time: future,
        is_repeat: true,
        repeat: {
          interval: 'days',
          time: 2,
        },
      },
    }

    const checked_ro = Notification.check(ro)

    // assert.equal(ro, checked_ro)
    expect(ro).toEqual(checked_ro)
    // will not notify
    // assert.equal(Notification.to_notify.length, 0)
    expect(Notification.to_notify).toHaveLength(0)
  })
})
