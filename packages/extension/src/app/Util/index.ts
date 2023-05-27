import { Screens } from '@app/Util/Enums'

// `/remindoro/:id` => '/remindoro/<ID>'
export function getRemindoroUrl(id: string) {
  return Screens.RemindoroInfo.replace(':id', id)
}
