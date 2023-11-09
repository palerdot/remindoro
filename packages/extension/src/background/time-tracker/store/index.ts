import browser from 'webextension-polyfill'
import { createStore, createCustomPersister, Store, Persister } from 'tinybase'
import { isString, isEmpty, values, takeRight } from '@lodash'

import {
  startActiveSession,
  endActiveSession,
  endActiveSessionsForTab,
  isActiveBackgroundTab,
  prune_offline_web_sessions,
  clean_stale_active_sessions,
  update_heart_beat_for_active_session,
  clean_background_sessions,
  WebSession,
} from '@background/time-tracker/web-session'

// indexed db key for storing time tracking related key/values and tables
export const STORE_KEY = 'time_tracker_store'
// Key/Values
export const ACTIVE_TAB_URL = 'active_tab_url'
export const ACTIVE_TAB_ID = 'active_tab_id'
export const ACTIVE_WINDOW_ID = 'active_window_id'
export const BROWSER_BOOT_TIMESTAMP = 'browser_boot_timestamp'
// TABLES
export const TIME_TRACKED_SITES_TABLE = 'time_tracked_sites'
export const WEB_SESSIONS_TABLE = 'web_sessions'

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
  has_background_activity?: boolean
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

export function getPersistedStore() {
  const store = createStore()
  // const persistor = createIndexedDbPersister(store, STORE_KEY)
  const persistor = getExtensionPersistor(store, STORE_KEY)

  return { store, persistor }
}

export async function getStore() {
  const { store, persistor } = getPersistedStore()
  // loads data from indexeddb storate into store instance
  await persistor.load()

  return { store, persistor }
}

// helper function to persist store data to storage(indexeddb) and free up the object
export async function saveAndExit(persistor: Persister) {
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

// helper function to decide if url belongs to site
export function isURLbelongsToSite({
  url,
  site,
}: {
  url: string
  site: string
}): boolean {
  try {
    const { host } = new URL(url)
    const siteId = siteIdFromHost(host)

    return siteId === site
  } catch (e) {
    return false
  }
}

// pulls site id from host name
// www.youtube.com => youtube.com
// youtube.com => youtube.com
export function siteIdFromHost(host: string): string {
  return takeRight(host.split('.'), 2).join('.')
}

function siteFromURL(url: string): string {
  try {
    const { host } = new URL(url)
    return siteIdFromHost(host)
  } catch (e) {
    return ''
  }
}

export function urlTrackingStatus({
  url,
  sites,
}: {
  url: string
  sites: Array<TrackedSite>
}): {
  isURLTracked: boolean
  has_background_activity?: boolean
} {
  // we should have a valid url
  try {
    // extract host from the url
    const { host } = new URL(url)

    // from sites, extract site where host matches our site id
    const siteInfo = sites.find(({ site }) => host.includes(site))

    if (siteInfo) {
      return {
        isURLTracked: true,
        // manually return true for youtue
        has_background_activity: siteInfo.has_background_activity,
      }
    } else {
      return {
        isURLTracked: false,
        has_background_activity: false,
      }
    }
  } catch (e) {
    return {
      isURLTracked: false,
      has_background_activity: false,
    }
  }
}

// -------------------------------------------------------------------
// START: Tab events

// handle activated tab
// when a tab is activated, we get only the tab id
// check registry for the tab id and grab the tab info and 'updateWebSession' with the activated tab info
export async function handleActivatedTab({
  tabId,
  previousTabId,
}: {
  tabId: number
  windowId?: number
  previousTabId?: number
}) {
  try {
    const tab_data = await browser.tabs.get(tabId)

    // consider tab activation only if tab is completed
    if (tab_data.status !== 'complete') {
      return
    }

    if (tab_data) {
      const tab_info: TabInfo = {
        tabId,
        url: tab_data.url ? tab_data.url : '',
        windowId: tab_data.windowId,
        isClosed: false,
      }
      // NOTE: we may not have an url if the switched tab is not tracked; this is ok
      // we will just update active tab url to empty and just end the session for previous tracked url (if applicable)
      // we are passing previous tab id to see if it has background activity
      await updateWebSession(tab_info, { previousTabId })
    }
  } catch (e) {
    console.error(e)
  }
}

// when a tab is closed, we get only the tab id and we cannot query for tab info; just end all sessions for tab id
export async function handleClosedTab({
  tabId,
}: {
  tabId: number
  windowId?: number
}) {
  const { store, persistor } = await getStore()
  endActiveSessionsForTab(store, tabId)
  // clean up the exit
  await saveAndExit(persistor)
}

// END: Tab events
// ------------------------------------------------------------------------------

// START: WEB SESSION

type UpdateOptions = {
  previousTabId?: number
}

// Main function that tracks web session - start session/end session
export async function updateWebSession(
  tab_info: TabInfo,
  { previousTabId }: UpdateOptions
) {
  const current_active_url = tab_info.url
  // get store data
  const { store, persistor } = await getStore()
  // get current active stuufs
  const previous_active_tab_url = store.getValue(ACTIVE_TAB_URL)
  const previous_active_tab_id = store.getValue(ACTIVE_TAB_ID)
  const previous_active_window_id = store.getValue(ACTIVE_WINDOW_ID)

  // IMPORTANT: we are comparing existing active data with incoming tab data, and stop unnecessary updates
  // onUpdated event streams info like title change. checking and preventing unnecessary updates
  if (
    current_active_url === previous_active_tab_id &&
    tab_info.tabId === Number(previous_active_tab_id) &&
    tab_info.windowId === previous_active_window_id
  ) {
    // abort
    return
  }

  // CASE 0: update active tab url, active tab id, active window id
  store.setValue(ACTIVE_TAB_URL, current_active_url)
  store.setValue(ACTIVE_TAB_ID, tab_info.tabId)
  if (tab_info.windowId) {
    store.setValue(ACTIVE_WINDOW_ID, tab_info.windowId)
  }

  const storeContent = store.getContent()
  const sites = trackedSitesFromStoreContent(storeContent)

  // CASE 1 - If previous active url has to be tracked, we have to end the session
  if (isString(previous_active_tab_url)) {
    const { isURLTracked, has_background_activity } = urlTrackingStatus({
      sites,
      url: previous_active_tab_url,
    })

    if (isURLTracked) {
      // CASE 1A - if previous tab id present, check if it has background activity. This case is coming from tab activated which passes previous tab
      const backgroundTabId = previousTabId
      const isBackgroundSession =
        has_background_activity &&
        backgroundTabId &&
        isActiveBackgroundTab(store, backgroundTabId)

      // CASE 1B: changeInfo.url event will not have previous tab id, but it might come from same site with background tracking
      // youtube.com => youtube.com/watch. Check if previous and current url belongs to same site and don't end active session if that is the case
      const previous_tab_site = siteFromURL(previous_active_tab_url)
      const current_tab_site = siteFromURL(current_active_url)
      const isSameBackgroundSiteTab =
        // this implies there is no previous tab id and the update event is coming from changeInfo.url event
        !previousTabId &&
        // checking if change url event belongs to the same site
        previous_tab_site !== '' &&
        current_tab_site != '' &&
        previous_tab_site === current_tab_site

      // end the session only if it not a background session and if the url change is not from same background site
      // for foreground/normal session background condition will fail and session will be ended as expected
      if (!isBackgroundSession && !isSameBackgroundSiteTab) {
        endActiveSession(store, previous_active_tab_url)
      }
    }
  }

  // CASE 2: If current active url has to be tracked, create a new web session entry with last_heartbeat_check set to now
  {
    const { isURLTracked, has_background_activity } = urlTrackingStatus({
      sites,
      url: current_active_url,
    })
    if (isURLTracked) {
      // check if the activated tab already has background activity
      const backgroundTabId = tab_info.tabId
      const isBackgroundSession =
        has_background_activity &&
        backgroundTabId &&
        isActiveBackgroundTab(store, backgroundTabId)

      // start a new session only if this tab is not already has background activity
      if (!isBackgroundSession) {
        startActiveSession(store, {
          url: current_active_url,
          title: tab_info.title,
          tabId: tab_info.tabId,
          windowId: tab_info.windowId,
          // track if the site has background activity configured like youtube.com
          has_background_activity,
        })
      }
    }
  }

  await saveAndExit(persistor)
}

// END: WEB SESSION
// ------------------------------------------------------------------------------

// START: Alarm handler

// when the browser starts for the first time init the time tracker store with the following
// 1 - set BROWSER_BOOT_TIMESTAMP
// 2 - clean stale background sessions and mark them as completed
export async function initTimeTrackerStore() {
  const { store, persistor } = await getStore()
  // set browser boot timestamp
  const browser_boot_timestamp = new Date().getTime()
  store.setValue(BROWSER_BOOT_TIMESTAMP, browser_boot_timestamp)

  try {
    clean_background_sessions(store)
  } catch (e) {
    console.log('error booting time tracker store ', e)
  }

  // clean up references
  await saveAndExit(persistor)
}

export async function timeTrackerSyncHandler() {}

// offline events handling
export async function timeTrackerAlarmHandler() {
  const { store, persistor } = await getStore()

  try {
    prune_offline_web_sessions(store)
    // IMPORTANT: order matters here. First clean stale active sessions
    clean_stale_active_sessions(store)
    // and then update heart beat for remaining active sessions
    await update_heart_beat_for_active_session(store)
  } catch (e) {
    // nothing much we can do
  }

  // clean up references
  await saveAndExit(persistor)
}

// END: Alarm handler
// ------------------------------------------------------------------------------

// START: custom persister
// ref: https://tinybase.org/api/persisters/functions/creation/createcustompersister/

function getExtensionPersistor(store: Store, key: string) {
  return createCustomPersister(
    // store
    store,
    // getPersisted
    async () => {
      return browser.storage.local.get(key).then(data => {
        // content if present will be [tables_obj, values_obj]
        const content = data[key]

        if (isEmpty(content)) {
          return undefined
        }

        return content
      })
    },
    // setPersisted
    async getContent => {
      const content = getContent()

      return browser.storage.local.set({
        [key]: content,
      })
    },
    // add persister listener
    _listener => undefined,
    // del persister listener
    _id => undefined,
    // on ignored error
    (error: any) => {
      console.log(
        'porumai ... tinybase custom extension persistor error ',
        error
      )
    }
  )
}

// END: custom persister
