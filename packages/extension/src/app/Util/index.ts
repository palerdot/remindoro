import { Screens } from '@app/Util/Enums'

// `/remindoro/:id` => '/remindoro/<ID>'
export function getRemindoroUrl(id: string) {
  return Screens.RemindoroInfo.replace(':id', id)
}

export function formattedWebSessionDuration(
  started_at: number,
  ended_at?: number
): string {
  if (!ended_at) {
    return ''
  }

  if (ended_at < started_at) {
    return ''
  }

  const duration = ended_at - started_at // in millis
  const in_seconds = Math.round(duration / 1000)

  if (in_seconds < 60) {
    return `${in_seconds} ${in_seconds === 1 ? 'second' : 'seconds'}`
  }

  // we show in minutes
  const in_minutes = Math.round(in_seconds / 60)

  return `${in_minutes} ${in_minutes === 1 ? 'minute' : 'minutes'}`
}

export function isValidEmail(email: string): boolean {
  const regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  return regex.test(email)
}
