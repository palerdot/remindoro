import { isEqual, omit, flow } from '@lodash'
import dayjs from 'dayjs'

import type { RootState } from '@app/Store/'
import {
  Remindoro,
  RemindoroType,
  Reminder as ReminderType,
} from '@app/Store/Slices/Remindoros/'

/*
 * Data cleaning modules
 *
 * Hopefully, not to be worried too much,
 * since TS is just compile time check, and will just work fine
 * with the final emitted JS (the actual extension)
 * (which should be atleast more safe than original loose, untyped JS)
 */

/*  
 * Cleans V0.x data
 *
 * 1) removes 'reminder' key instead of stubbing false for all fields
 * 
 *      "reminder": {
          "time": false,
          "is_repeat": false,
          "repeat": {
            "interval": false,
            "time": false
          }
        } => 'reminder?' (reminder key will be removed)

  *
  *
  * 2) removes 'repeat/is_repeat' key inside reminder if not a repeat reminder
  * 
  *     "reminder": {
          "time": 165412345634567,
          "is_repeat": false,
          "repeat": {
            "interval": false,
            "time": false
          }
        } => "reminder": {
          "time": 165412345634567,
          // repeat key will be removed
        }

   *
   *
   * 3) 'list' key will be removed
   * 
   * 4) convert repeat time to number
 */

// defining old Remindoro type
export interface OldRemindoro {
  id: number | string
  title: string
  type: string
  note: string
  list?: Array<string>
  created: number
  updated: number
  reminder?: {
    time: boolean | string
    is_repeat?: boolean
    repeat?: {
      interval: boolean | number | string
      time: boolean | number | string
    }
  }
}

export function clean_v0_data(remindoro: OldRemindoro): Remindoro {
  // case 1: remove empty reminder
  const EMPTY_REMINDER = {
    time: false,
    is_repeat: false,
    repeat: {
      interval: false,
      time: false,
    },
  }
  const isEmptyReminder = isEqual(remindoro.reminder, EMPTY_REMINDER)
  if (isEmptyReminder) {
    // removing 'reminder' key
    // This is more inline with new TS type 'reminder?'
    remindoro = omit(remindoro, 'reminder')
  }
  // case 2: empty repeat
  const EMPTY_REPEAT = {
    interval: false,
    time: false,
  }

  const isEmptyRepeat =
    !isEmptyReminder &&
    isEqual(remindoro.reminder?.repeat, EMPTY_REPEAT) &&
    remindoro.reminder?.is_repeat === false

  if (isEmptyRepeat) {
    // remove 'repeat key'
    const newReminder = omit(remindoro.reminder, ['is_repeat', 'repeat'])
    remindoro.reminder = newReminder
  } else {
    // convert repeat time to number
    if (remindoro.reminder?.repeat) {
      remindoro.reminder.repeat.time = Number(remindoro.reminder?.repeat?.time)
    }
  }

  // if not empty reminder, or empty repeat, we need to remove 'is_repeat' key
  remindoro.reminder = omit(remindoro.reminder, ['is_repeat'])

  // we will create new remindoro from old remindoro
  // NOTE: compiler error is going away only with 'Object.assign'
  const cleanedRemindoro: Remindoro = Object.assign(
    {
      id: String(remindoro.id),
      title: clean_html(remindoro.title), // strip html
      note: clean_html(remindoro.note), // strip html
      type: RemindoroType.Note,
      created: remindoro.created,
      updated: remindoro.updated,
    },
    !isEmptyReminder
      ? {
          reminder: {
            time: dayjs(remindoro.reminder.time as string).valueOf(),
            repeat: remindoro.reminder.repeat,
          } as ReminderType,
        }
      : {}
  )

  return cleanedRemindoro
}

/*
 * NOTE: helper function to migrate v0.x => v1.x data
 *
 * This will be run on oninstall event
 * this should be a harmless migration, since generated JS from TS compiler
 * should be good enough even if something happens and migration is not run
 */
export interface OldStoreData {
  remindoros: Array<OldRemindoro>
  current_tab: string
  current_selected_remindoro: boolean | number | string
}

// new store keys except 'remindoros' (which is mandatory)
type NewStoreKeys = Omit<RootState, 'remindoros'>
type OptionalNewStoreKeys = {
  // adding 'optional' key to new store keys
  [Property in keyof NewStoreKeys]+?: NewStoreKeys[Property]
}

interface NewStoreData extends OptionalNewStoreKeys {
  remindoros: Array<Remindoro>
  current_tab?: string
  current_selected_remindoro?: boolean | number | string
}

// input can be oldstoredata or migrated data
// so return type should be flexible enough to accomodate both
export function migrate_v0_data(
  // oldStoreData: OldStoreData | RootState
  oldStoreData: OldStoreData
): NewStoreData {
  return {
    ...oldStoreData,
    remindoros: oldStoreData.remindoros.map(clean_v0_data),
  }
}

/*
 * helper function to strip html from input
 * old v0 has html sprayed over the content
 * we will strip the html (while transforming <br> => \n)
 */
function strip_html(html: string) {
  let doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

function br2nl(str: string) {
  return str.replace(/<br\s*\/?>/gm, '\n')
}

export function clean_html(html: string) {
  const cleaner = flow([br2nl, strip_html])

  return cleaner(html)
}
