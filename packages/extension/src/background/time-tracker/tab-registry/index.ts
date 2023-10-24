import { omitBy } from '@lodash'

import {
  TableData,
  getStore,
  saveAndExit,
  TAB_REGISTRY_TABLE,
} from '@background/time-tracker/store'

export type TabInfo = {
  tabId: number
  url: string
  title?: string
  isClosed: boolean
  windowId?: number
}

// helper function to reset tab registry when the extensions first loads up (when the browser starts up)
export async function reset_tab_registry() {
  const { store, persistor } = await getStore()
  store.delTable(TAB_REGISTRY_TABLE)
  await saveAndExit(persistor)
}

// helper function to remove tabs from registry that are closed
// can be used with a timer/alarm to clean the registry at regular 1 minute intervals
export function cleanClosedTabs(
  current_registry_info: TableData<TabInfo>
): TableData<TabInfo> {
  // no registry present
  if (!current_registry_info) {
    return {}
  }

  return omitBy(current_registry_info, registry => {
    // if no registry value filter it
    if (!registry) {
      return true
    }

    // filter/omit closed tabs
    return registry.isClosed === true
  })
}
