import { isEqual, omit } from 'lodash'
import { Remindoro, RemindoroType } from '@app/Store/Slices/Remindoros/'

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
interface OldRemindoro {
  id: number | string
  title: string
  type: string
  note: string
  list: Array<string>
  created: number
  updated: number
  reminder?: {
    time: boolean | number
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
  const cleanedRemindoro: Remindoro = Object.assign({
    id: String(remindoro.id),
    title: remindoro.title,
    note: remindoro.note,
    type: RemindoroType.Note,
    created: remindoro.created,
    updated: remindoro.updated,
    reminder: remindoro.reminder,
  })

  return cleanedRemindoro
}

/*
 * NOTE: helper function to migrate v0.x => v1.x data
 *
 * This will be run on oninstall event
 * this should be a harmless migration, since generated JS from TS compiler
 * should be good enough even if something happens and migration is not run
 */
interface OldStoreData {
  remindoros: Array<OldRemindoro>
  current_tab: string
  current_selected_remindoro: boolean | number | string
}

interface NewStoreData {
  remindoros: Array<Remindoro>
  current_tab: string
  current_selected_remindoro: boolean | number | string
}

export function migrate_v0_data(oldStoreData: OldStoreData): NewStoreData {
  return {
    ...oldStoreData,
    remindoros: oldStoreData.remindoros.map(clean_v0_data),
  }
}
