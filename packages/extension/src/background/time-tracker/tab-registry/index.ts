import { omitBy } from '@lodash'

export type TabInfo = {
  tabId: number
  url: string
  isClosed: boolean
}

export type RegistryInfo =
  | {
      [key: number | string]: TabInfo | undefined
    }
  | undefined

export function updateRegistry(
  current_registry_info: RegistryInfo,
  tab_info: TabInfo
) {
  // if registry is empty, fill with incoming tab info
  if (!current_registry_info) {
    return {
      [tab_info.tabId]: tab_info,
    }
  }

  const existing_tab = current_registry_info[tab_info.tabId]

  if (existing_tab) {
    // update incoming values
    current_registry_info[tab_info.tabId] = {
      ...existing_tab,
      // merge incoming details
      ...tab_info,
    }
  } else {
    current_registry_info[tab_info.tabId] = tab_info
  }

  // return back the registry
  return current_registry_info
}

// helper function to remove tabs from registry that are closed
// can be used with a timer/alarm to clean the registry at regular 1 minute intervals
export function cleanClosedTabs(
  current_registry_info: RegistryInfo
): RegistryInfo {
  // no registry present
  if (!current_registry_info) {
    return undefined
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
