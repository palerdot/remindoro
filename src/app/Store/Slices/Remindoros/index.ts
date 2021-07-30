import { v4 as uuid } from 'uuid'
import { isNil, debounce } from 'lodash'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Maybe<T> = T | undefined

interface Repeat {
  interval: string // TODO: make this an Enum
  time: number
}

interface Reminder {
  time: number // unix timestamp
  is_repeat: boolean
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
    updateTitle: (
      state,
      action: PayloadAction<{
        id: string
        title: string
      }>
    ) => {
      const { id, title } = action.payload
      // extract remindoro
      const toUpdate: Maybe<Remindoro> = state.find(ro => ro.id === id)

      // if for some reason, we cannot find remindoro to update,
      // we will return the state as is
      if (isNil(toUpdate)) {
        return state
      }

      // we will update the title
      toUpdate.title = title
    },
  },
})

// debounced version of actions to lazy update redux state
export const updateTitle = debounce(remindoroSlice.actions.updateTitle, 3140)

export const { addNewRemindoro } = remindoroSlice.actions

export default remindoroSlice.reducer
