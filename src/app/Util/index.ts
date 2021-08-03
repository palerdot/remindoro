import { Screens } from '@app/Routes/'

// `/remindoro/:id` => '/remindoro/<ID>'
export function getRemindoroUrl(id: string) {
  return Screens.RemindoroInfo.replace(':id', id)
}
