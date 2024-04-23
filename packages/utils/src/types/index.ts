export type Maybe<T> = T | undefined

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

  // NOTE: we have to see the usage of this property
  type: RemindoroType.Note
  // marking note as todo
  isTodo?: boolean

  // unix timestamp
  created: number
  updated: number

  reminder?: Reminder
}
