import { Remindoro } from './types/index.js'
import { notification_check } from './notifications/index.js'

export type Message = {
  person: string
}

export function greet(message: string) {
  return `porumai ... ${message}`
}

export type { Remindoro }

export { notification_check }
