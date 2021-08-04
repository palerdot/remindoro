import { isNil } from 'lodash'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Maybe<T> = T | undefined

export interface Repeat {
  interval: 'minutes' | 'hours' | 'days' | 'months'
  time: number
}

interface Reminder {
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
    addNewRemindoro: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const newRemindoro = {
        id,
        title: '',
        note: '',
        type: RemindoroType.Note,
        list: [],
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

      console.log('porumai ... store title update ', value)
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

      console.log('porumai ... store note update ', value)
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

      console.log('porumai ... store reminder update ', value)

      // we will update the reminder
      toUpdate.reminder = value
      // update 'updated' time
      toUpdate.updated = Date.now()
    },
  },
})

export const {
  addNewRemindoro,
  updateTitle,
  updateNote,
  updateReminder,
} = remindoroSlice.actions

export default remindoroSlice.reducer
