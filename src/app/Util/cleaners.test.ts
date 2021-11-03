/**
 * @jest-environment jsdom
 */

import { clean_v0_data, migrate_v0_data, clean_html } from './cleaners'

// migration related test cases
// case 1
const OLD_EMPTY_REMINDORO = {
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
// expected new empty reminder
const EXPECTED_NEW_EMPTY_REMINDORO = {
  id: '2',
  title: '',
  type: 'note',
  note: '',
  created: 1627482379252,
  updated: 1627482379252,
}

// case 2
const OLD_EMPTY_REPEAT_REMINDORO = {
  id: 2,
  title: '',
  type: 'note',
  note: '',
  list: [],
  created: 1627482379252,
  updated: 1627482379252,
  reminder: {
    // time: 165431234512345,
    time: '2021-11-03T15:06:11+05:30',
    is_repeat: false,
    repeat: {
      interval: false,
      time: false,
    },
  },
}
const EXPECTED_NEW_EMPTY_REPEAT_REMINDORO = {
  id: '2',
  title: '',
  type: 'note',
  note: '',
  created: 1627482379252,
  updated: 1627482379252,
  reminder: {
    time: 1635932171000,
  },
}

// case 3
const OLD_NORMAL_REMINDORO = {
  id: 1,
  title: 'Take a Walk',
  type: 'note',
  note: "Taking a walk for every 45 minutes is good for your health. Avoid continous sitting for long hours. Remember, 'Sitting is the new Smoking'. &nbsp;<div><br></div><div>NOTE: This is a default sample remindoro shown if no entries are saved. You can edit, save, delete and do whatever you want with this note. Enjoy!</div>",
  list: [],
  created: 1627482377767,
  updated: 1627482377767,
  reminder: {
    // time: 1627485077767,
    time: '2021-11-03T15:06:11+05:30',
    is_repeat: true,
    repeat: {
      interval: 'minutes',
      time: '45',
    },
  },
}
const EXPECTED_NORMAL_REMINDORO = {
  id: '1', // id should be converted to string
  title: 'Take a Walk',
  type: 'note',
  // html should be cleaned
  note: clean_html(
    "Taking a walk for every 45 minutes is good for your health. Avoid continous sitting for long hours. Remember, 'Sitting is the new Smoking'. &nbsp;<div><br></div><div>NOTE: This is a default sample remindoro shown if no entries are saved. You can edit, save, delete and do whatever you want with this note. Enjoy!</div>"
  ),
  created: 1627482377767,
  updated: 1627482377767,
  reminder: {
    // time: 1627485077767,
    time: 1635932171000,
    repeat: {
      interval: 'minutes',
      time: 45, // should be converted to number
    },
  },
}

describe('V0.x => v1.x data cleaning is correct', () => {
  test(`'reminder' key is removed for empty reminder`, () => {
    expect(clean_v0_data(OLD_EMPTY_REMINDORO)).toMatchObject(
      EXPECTED_NEW_EMPTY_REMINDORO
    )
  })

  test("'repeat/is_repeat' key inside reminder is removed if not a repeat reminder", () => {
    expect(clean_v0_data(OLD_EMPTY_REPEAT_REMINDORO)).toMatchObject(
      EXPECTED_NEW_EMPTY_REPEAT_REMINDORO
    )
  })

  test("Normal reminder (with reminder and repeat), has 'list' and 'is_repeat' key removed", () => {
    expect(clean_v0_data(OLD_NORMAL_REMINDORO)).toMatchObject(
      EXPECTED_NORMAL_REMINDORO
    )
  })
})

describe('Migration v0.x => v1.x data is working fine', () => {
  const OLD_STORE_DATA = {
    current_tab: 'home',
    current_selected_remindoro: false,
    remindoros: [
      OLD_EMPTY_REMINDORO,
      OLD_EMPTY_REPEAT_REMINDORO,
      OLD_NORMAL_REMINDORO,
    ],
  }

  const NEW_STORE_DATA = {
    current_tab: 'home',
    current_selected_remindoro: false,
    remindoros: OLD_STORE_DATA.remindoros.map(clean_v0_data),
  }

  expect(migrate_v0_data(OLD_STORE_DATA)).toMatchObject(NEW_STORE_DATA)
})

describe('strip html tags', () => {
  test('stripping html is working fine ', () => {
    const input = '<div>porumai<br>wait and hope<br/>patience</div>'
    const expected = `porumai
wait and hope
patience`
    expect(clean_html(input)).toEqual(expected)
  })
})
