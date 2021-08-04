import { getRemindoroUrl } from './'
import { clean_v0_data } from './cleaners'

describe('Remindoro url is constructed correctly', () => {
  const id = 'porumai'
  expect(getRemindoroUrl(id)).toEqual(`/remindoro-info/${id}`)
})

describe('V0.x => v1.x data cleaning is correct', () => {
  test(`'reminder' key is removed for empty reminder`, () => {
    const old_empty_reminder = {
      id: 2,
      title: '',
      type: 'note',
      note: '',
      list: [],
      created: 1627482379252,
      updated: 1627482379252,
      reminder: {
        time: false,
        is_repeat: false,
        repeat: {
          interval: false,
          time: false,
        },
      },
    }

    const expected_new_remindoro = {
      id: '2',
      title: '',
      type: 'note',
      note: '',
      created: 1627482379252,
      updated: 1627482379252,
    }

    expect(clean_v0_data(old_empty_reminder)).toMatchObject(
      expected_new_remindoro
    )
  })

  test("'repeat/is_repeat' key inside reminder is removed if not a repeat reminder", () => {
    const old_empty_repeat_reminder = {
      id: 2,
      title: '',
      type: 'note',
      note: '',
      list: [],
      created: 1627482379252,
      updated: 1627482379252,
      reminder: {
        time: 165431234512345,
        is_repeat: false,
        repeat: {
          interval: false,
          time: false,
        },
      },
    }

    const expected_new_remindoro = {
      id: '2',
      title: '',
      type: 'note',
      note: '',
      created: 1627482379252,
      updated: 1627482379252,
      reminder: {
        time: 165431234512345,
      },
    }

    expect(clean_v0_data(old_empty_repeat_reminder)).toMatchObject(
      expected_new_remindoro
    )
  })

  test("Normal reminder (with reminder and repeat), has 'list' and 'is_repeat' key removed", () => {
    const old_normal_reminder = {
      id: 1,
      title: 'Take a Walk',
      type: 'note',
      note:
        "Taking a walk for every 45 minutes is good for your health. Avoid continous sitting for long hours. Remember, 'Sitting is the new Smoking'. &nbsp;<div><br></div><div>NOTE: This is a default sample remindoro shown if no entries are saved. You can edit, save, delete and do whatever you want with this note. Enjoy!</div>",
      list: [],
      created: 1627482377767,
      updated: 1627482377767,
      reminder: {
        time: 1627485077767,
        is_repeat: true,
        repeat: {
          interval: 'minutes',
          time: '45',
        },
      },
    }

    const expected_new_remindoro = {
      id: '1', // id should be converted to string
      title: 'Take a Walk',
      type: 'note',
      note:
        "Taking a walk for every 45 minutes is good for your health. Avoid continous sitting for long hours. Remember, 'Sitting is the new Smoking'. &nbsp;<div><br></div><div>NOTE: This is a default sample remindoro shown if no entries are saved. You can edit, save, delete and do whatever you want with this note. Enjoy!</div>",
      created: 1627482377767,
      updated: 1627482377767,
      reminder: {
        time: 1627485077767,
        repeat: {
          interval: 'minutes',
          time: 45, // should be converted to number
        },
      },
    }

    expect(clean_v0_data(old_normal_reminder)).toMatchObject(
      expected_new_remindoro
    )
  })
})
