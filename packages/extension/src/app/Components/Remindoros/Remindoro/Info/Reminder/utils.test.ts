import { handleReminderChange } from './utils'

describe('handleReminderChange => schedule on/off is working fine', () => {
  test('Schedule turned off', () => {
    const currentSchedule = {
      time: 12932329329832,
    }

    const EXPECTED = handleReminderChange(false, currentSchedule)
    expect(EXPECTED).toBeUndefined()
  })
})
