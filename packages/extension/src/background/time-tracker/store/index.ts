import { createStore } from 'tinybase'
import {
  createIndexedDbPersister,
  IndexedDbPersister,
} from 'tinybase/persisters/persister-indexed-db'
import { isString, isEmpty, some } from '@lodash'

import { TabInfo } from '@background/time-tracker/tab-registry'
import {
  startActiveSession,
  endActiveSession,
  WebSession,
} from '@background/time-tracker/web-session'

// indexed db key for storing time tracking related key/values and tables
const STORE_KEY = 'time_tracker_store'
// Key/Values
export const ACTIVE_TAB_URL = 'active_tab_url'
// TABLES
export const TAB_REGISTRY_TABLE = 'tab_registry'
export const WEB_SESSIONS_TABLE = 'web_sessions'

type TrackedSite = {
  site: string
  initiator: 'EXTENSION' | 'WEBAPP'
  initiated_time?: string
}

export type TableData<T> = {
  [key: string]: T
}

type TablesData = {
  [TAB_REGISTRY_TABLE]?: TableData<TabInfo>
  [WEB_SESSIONS_TABLE]?: TableData<WebSession>
}
type ValuesData = {
  [ACTIVE_TAB_URL]?: string
}

type StoreContent = [TablesData, ValuesData]

export async function getStore() {
  const store = createStore()
  const persistor = createIndexedDbPersister(store, STORE_KEY)

  // loads data from indexeddb storate into store instance
  await persistor.load()

  return { store, persistor }
}

// helper function to persist store data to storage(indexeddb) and free up the object
export async function saveAndExit(persistor: IndexedDbPersister) {
  await persistor.save()
  // destroy instance for garbage collection
  persistor.destroy()
}

// get tabInfo from store content
function tabInfoFromStoreContent(
  content: StoreContent,
  tabId: number
): TabInfo | undefined {
  const [tablesData] = content
  const tabRegistryData = tablesData[TAB_REGISTRY_TABLE]

  if (!tabRegistryData) {
    return undefined
  }

  const tabInfo = tabRegistryData[String(tabId)]

  return tabInfo
}

// checks if the url is part of tracked sites
export function isURLTracked({
  url,
  sites,
}: {
  url: string
  sites: Array<TrackedSite>
}) {
  return some(sites, ({ site }: TrackedSite) => {
    const { host } = new URL(url)

    return host.includes(site)
  })
}

// -------------------------------------------------------------------

// handle activated tab
// when a tab is activated, we get only the tab id
// check registry for the tab id and grab the tab info and 'updateWebSession' with the activated tab info
export async function handleActivatedTab(tabId: number) {
  // get a handle for store
  const { store, persistor } = await getStore()
  const storeContent = store.getContent()
  const tab_info = await tabInfoFromStoreContent(storeContent, tabId)
  // clean up the exit
  await saveAndExit(persistor)

  // updateWebSession gets a new handle for store and cleans up after updating web session
  if (tab_info && !isEmpty(tab_info.url)) {
    await updateWebSession(tab_info)
  }
}

// handle closed tab
// when a tab is closed, we get only the tab id
// check registry for the tab id and grab the tab info and 'endWebSession' with the removed tab info
export async function handleClosedTab(tabId: number) {
  // get a handle for store
  const { store, persistor } = await getStore()
  const storeContent = store.getContent()
  const tab_info = await tabInfoFromStoreContent(storeContent, tabId)

  // mark tab as closed
  store.setRow(TAB_REGISTRY_TABLE, String(tabId), {
    isClosed: true,
  })

  if (tab_info && !isEmpty(tab_info.url)) {
    // TODO: hardcoding site for now
    const sites: Array<TrackedSite> = [
      {
        site: 'youtube.com',
        initiator: 'EXTENSION',
      },
    ]

    if (isURLTracked({ sites, url: tab_info.url })) {
      endActiveSession(store, tab_info.url)
    }
  }

  // clean up the exit
  await saveAndExit(persistor)
}

// START: WEB SESSION
// Main function that tracks web session - start session/end session
export async function updateWebSession(tab_info: TabInfo) {
  const current_active_url = tab_info.url
  // get store data
  const { store, persistor } = await getStore()
  // get active tab url from store
  const previous_active_tab_url = store.getValue(ACTIVE_TAB_URL)
  // check if current active url is same is existing active tab url. if same do not do anything
  if (previous_active_tab_url === current_active_url) {
    return
  }

  // CASE 0: update active tab url
  store.setValue(ACTIVE_TAB_URL, current_active_url)
  // update registry info
  store.setRow(TAB_REGISTRY_TABLE, String(tab_info.tabId), tab_info)

  // TODO: IMPORTANT: hardcoding site for now
  const sites: Array<TrackedSite> = [
    {
      site: 'youtube.com',
      initiator: 'EXTENSION',
    },
  ]

  // CASE 1: If current active url has to be tracked, create a new web session entry with last_heartbeat_check set to now
  if (isURLTracked({ sites, url: current_active_url })) {
    startActiveSession(store, {
      url: current_active_url,
      title: tab_info.title,
    })
  }
  // CASE 2 - If previous active url has to be tracked, we have to end the session
  if (
    isString(previous_active_tab_url) &&
    isURLTracked({ sites, url: previous_active_tab_url })
  ) {
    endActiveSession(store, previous_active_tab_url)
  }

  await saveAndExit(persistor)
}

// END: WEB SESSION
