import { v4 as uuid } from 'uuid'
import { isNil } from 'lodash'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Maybe<T> = T | undefined

interface Repeat {
  interval: 'minutes' | 'hours' | 'days' | 'months'
  time: number
}

interface Reminder {
  time: number // unix timestamp
  // we are removing 'is_repeat' in favour of typescript repeat? assertion
  repeat?: Repeat
}

enum RemindoroType {
  Note = 'note',
}

export interface Remindoro {
  id: string
  title: string
  note: string

  // NOTE: we have to see the usage of this properties
  type: string // TODO: harden this to specific types ('note'/ ???)
  list: Array<string> // TODO: have to see if we can reuse this property

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
    addNewRemindoro: state => {
      const newRemindoro = {
        id: uuid(),
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
    },

    // update schedule
    updateReminder: (state, action: StorePayload<Maybe<Reminder>>) => {
      console.log('porumai ... updating reminder ', action.payload)

      return state
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
