// import dayjs from 'dayjs'

import { RemindoroType } from '@app/Store/Slices/Remindoros'
import { Notification } from './notification'

/*
 * Notification tests
 *
 * for clarity, we will use one remindoro per each case
 * so that is easy to assert stuffs
 */

describe('Notification modules are working fine', () => {
  test('CASE 5: NO REPEAT - Notification not older than Buffer time (< 15 mins old) will be notified', () => {
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
