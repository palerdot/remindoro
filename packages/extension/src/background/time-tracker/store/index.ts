import browser from 'webextension-polyfill'
import { createStore } from 'tinybase'
import {
  createIndexedDbPersister,
  IndexedDbPersister,
} from 'tinybase/persisters/persister-indexed-db'
import { isString, some, values, takeRight } from '@lodash'

import {
  startActiveSession,
  endActiveSession,
  prune_offline_web_sessions,
  clean_stale_active_sessions,
  update_heart_beat_for_active_session,
  WebSession,
} from '@background/time-tracker/web-session'

// indexed db key for storing time tracking related key/values and tables
export const STORE_KEY = 'time_tracker_store'
// Key/Values
export const ACTIVE_TAB_URL = 'active_tab_url'
export const ACTIVE_TAB_ID = 'active_tab_id'
export const ACTIVE_WINDOW_ID = 'active_window_id'
// TABLES
export const TIME_TRACKED_SITES_TABLE = 'time_tracked_sites'
export const WEB_SESSIONS_TABLE = 'web_sessions'
export const CONNECTED_ACCOUNT_TABLE = 'connected_account'

export type TabInfo = {
  tabId: number
  url: string
  title?: string
  isClosed: boolean
  windowId?: number
}

export type TrackedSite = {
  site: string
  initiator: 'EXTENSION' | 'WEBAPP'
  initiated_time?: number
}

export type TableData<T> = {
  [key: string]: T
}

type TablesData = {
  [TIME_TRACKED_SITES_TABLE]?: TableData<TrackedSite>
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

// get time tracked sites from store content
function trackedSitesFromStoreContent(
  content: StoreContent
): Array<TrackedSite> {
  const [tablesData] = content
  const trackedSitesData = tablesData[TIME_TRACKED_SITES_TABLE]

  if (!trackedSitesData) {
    return []
  }

  return values(trackedSitesData)
}

// pulls site id from host name
// www.youtube.com => youtube.com
// youtube.com => youtube.com
export function siteIdFromHost(host: string): string {
  return takeRight(host.split('.'), 2).join('.')
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
    // url may or may not be a valid url
    try {
      const { host } = new URL(url)

      return host.includes(site)
    } catch (_e) {
      return false
    }
  })
}

// -------------------------------------------------------------------
// START: Tab events

// handle activated tab
// when a tab is activated, we get only the tab id
// check registry for the tab id and grab the tab info and 'updateWebSession' with the activated tab info
export async function handleActivatedTab({
  tabId,
}: {
  tabId: number
  windowId?: number
}) {
  try {
    const tab_data = await browser.tabs.get(tabId)
    // updateWebSession gets a new handle for store and cleans up after updating web session
    if (tab_data) {
      const tab_info: TabInfo = {
        tabId,
        url: tab_data.url ? tab_data.url : '',
        windowId: tab_data.windowId,
        isClosed: false,
      }
      // NOTE: we may not have an url if the switched tab is not tracked; this is ok
      // we will just update active tab url to empty and just end the session for previous tracked url (if applicable)
      await updateWebSession(tab_info)
    }
  } catch (e) {
    console.error(e)
  }
}

// handle closed tab
// when a tab is closed, we get only the tab id
// check registry for the tab id and grab the tab info and 'endWebSession' with the removed tab info
export async function handleClosedTab({
  tabId,
}: {
  tabId: number
  windowId?: number
}) {
  try {
    // get a handle for store
    const { store, persistor } = await getStore()
    const storeContent = store.getContent()
    const tab_info = await browser.tabs.get(tabId)

    if (tab_info && tab_info.url) {
      const sites = trackedSitesFromStoreContent(storeContent)

      if (isURLTracked({ sites, url: tab_info.url })) {
        endActiveSession(store, tab_info.url)
      }
    }

    // clean up the exit
    await saveAndExit(persistor)
  } catch (e) {
    console.error(e)
  }
}

// END: Tab events
// ------------------------------------------------------------------------------

// START: WEB SESSION
// Main function that tracks web session - start session/end session
export async function updateWebSession(tab_info: TabInfo) {
  const current_active_url = tab_info.url
  // get store data
  const { store, persistor } = await getStore()
  // get active tab url from store
  const previous_active_tab_url = store.getValue(ACTIVE_TAB_URL)

  // CASE 0: update active tab url, active tab id, active window id
  store.setValue(ACTIVE_TAB_URL, current_active_url)
  store.setValue(ACTIVE_TAB_ID, tab_info.tabId)
  if (tab_info.windowId) {
    store.setValue(ACTIVE_WINDOW_ID, tab_info.windowId)
  }

  const storeContent = store.getContent()
  const sites = trackedSitesFromStoreContent(storeContent)

  // CASE 1 - If previous active url has to be tracked, we have to end the session
  if (
    isString(previous_active_tab_url) &&
    isURLTracked({ sites, url: previous_active_tab_url })
  ) {
    endActiveSession(store, previous_active_tab_url)
  }

  // CASE 2: If current active url has to be tracked, create a new web session entry with last_heartbeat_check set to now
  if (isURLTracked({ sites, url: current_active_url })) {
    startActiveSession(store, {
      url: current_active_url,
      title: tab_info.title,
      tabId: tab_info.tabId,
      windowId: tab_info.windowId,
    })
  }
  await saveAndExit(persistor)
}

// END: WEB SESSION
// ------------------------------------------------------------------------------

// START: Alarm handler

export async function timeTrackerSyncHandler() {}

// offline events handling
export async function timeTrackerAlarmHandler() {
  const { store, persistor } = await getStore()

  try {
    prune_offline_web_sessions(store)
    clean_stale_active_sessions(store)
    await update_heart_beat_for_active_session(store)
  } catch (e) {
    // nothing much we can do
  }

  // clean up references
  await saveAndExit(persistor)
}

// END: Alarm handler
// ------------------------------------------------------------------------------
