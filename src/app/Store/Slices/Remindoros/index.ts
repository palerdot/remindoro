import { isNil, isEqual, cloneDeep } from '@lodash'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'

import { clean_v0_data } from '@app/Util/cleaners'
import { isOldRemindoro } from '@app/Components/ChromeError/WithChromeError'

type Maybe<T> = T | undefined

export type RepeatDuration = 'minutes' | 'hours' | 'days' | 'months'

export interface Repeat {
  interval: RepeatDuration
  time: number
}

export interface Reminder {
  time: number // unix timestamp
  // we are removing 'is_repeat' in favour of typescript repeat? assertion
  repeat?: Repeat
}

export enum RemindoroType {
  Note = 'note',
}

export interface Remindoro {
  id: string
  title: string
  note: string

  // NOTE: we have to see the usage of this properties
  type: RemindoroType.Note

  // unix timestamp
  created: number
  updated: number

  reminder?: Reminder
}

type StorePayload<T> = PayloadAction<{
  id: string
  value: T
}>

// TODO: maybe init here with default remindoro 'Take a walk'
const initialState: Array<Remindoro> = []

export const remindoroSlice = createSlice({
  name: 'remindoros',
  initialState,
  reducers: {
    // default remindoro ('Take a walk')
    // created as soon as all remindoros are deleted
    // will be used by 'NoRemindoros' component
    addDefaultRemindoro: state => {
      const newRemindoro: Remindoro = {
        id: uuid(),
        title: 'Take a Walk',
        note: `
Taking a walk for every **45 minutes** is good for your health. Avoid continous sitting for long hours. Remember, \`Sitting is the new Smoking\`.  

> NOTE: This is a default sample note shown if no notes are saved. 

You can edit, save, delete and do whatever you want with this note. Enjoy!

Have a nice day!
`,
        type: RemindoroType.Note,
        reminder: {
          time: dayjs().add(45, 'minutes').valueOf(),
          repeat: {
            time: 45,
            interval: 'minutes',
          },
        },
        created: Date.now(),
        updated: Date.now(),
      }

      // update existing state with new remindoro
      state.push(newRemindoro)
    },

    addNewRemindoro: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const newRemindoro = {
        id,
        title: '',
        note: '',
        type: RemindoroType.Note,
        created: Date.now(),
        updated: Date.now(),
      }

      // update existing state with new remindoro
      state.push(newRemindoro)
    },

    // update title
    updateTitle: (state, action: StorePayload<string>) => {
      const { id, value } = action.payload
      // extract remindoro
      const toUpdate: Maybe<Remindoro> = state.find(ro => ro.id === id)

      // if for some reason, we cannot find remindoro to update,
      // we will return the state as is
      if (isNil(toUpdate)) {
        return state
      }

      // compare value before update
      if (isEqual(toUpdate.title, value)) {
        // return current state
        return state
      }

      // we will update the title
      toUpdate.title = value
      // update 'updated' time
      toUpdate.updated = Date.now()
    },

    // update note
    updateNote: (state, action: StorePayload<string>) => {
      const { id, value } = action.payload
      // extract remindoro
      const toUpdate: Maybe<Remindoro> = state.find(ro => ro.id === id)

      // if for some reason, we cannot find remindoro to update,
      // we will return the state as is
      if (isNil(toUpdate)) {
        return state
      }

      // compare value before update
      if (isEqual(toUpdate.note, value)) {
        // return current state
        return state
      }

      // we will update the title
      toUpdate.note = value
      // update 'updated' time
      toUpdate.updated = Date.now()
    },

    // update schedule
    updateReminder: (state, action: StorePayload<Maybe<Reminder>>) => {
      const { id, value } = action.payload

      // extract remindoro
      const toUpdate: Maybe<Remindoro> = state.find(ro => ro.id === id)

      // if for some reason, we cannot find remindoro to update,
      // we will return the state as is
      if (isNil(toUpdate)) {
        return state
      }

      // compare value before update
      if (isEqual(toUpdate.reminder, value)) {
        // return current state
        return state
      }

      // we will update the reminder
      toUpdate.reminder = value
      // update 'updated' time
      toUpdate.updated = Date.now()
    },

    deleteRemindoro: (state, action: PayloadAction<string>) => {
      const toDelete = action.payload
      return state.filter(remindoro => remindoro.id !== toDelete)
    },

    // IMPORTANT: helper action that migrates v0.x to v1.0x data
    // This is mainly because of Chrome weird behaviour that failed to apply migration for 1.x
    migrateV1Remindoros: state => {
      const toMigrate = cloneDeep(state)

      return toMigrate.map(remindoro => {
        // if we have an old remindoro we will do the cleaning
        if (isOldRemindoro(remindoro)) {
          return clean_v0_data(remindoro)
        }

        return remindoro
      })
    },
  },
})

export const {
  addDefaultRemindoro,
  addNewRemindoro,
  updateTitle,
  updateNote,
  updateReminder,
  deleteRemindoro,
  migrateV1Remindoros,
} = remindoroSlice.actions

export default remindoroSlice.reducer
