import browser from 'webextension-polyfill'
import { createQueries, Store } from 'tinybase'
import { v4 as uuid } from 'uuid'
import { head, last, isNumber, isArray, isString } from '@lodash'

import {
  WEB_SESSIONS_TABLE,
  ACTIVE_TAB_ID,
  ACTIVE_TAB_URL,
  ACTIVE_WINDOW_ID,
  siteIdFromHost,
  isURLbelongsToSite,
  urlTrackingStatus,
  trackedSitesFromStoreContent,
} from '@background/time-tracker/store'

const KEY_LAST_HEARTBEAT_CHECK = 'last_heartbeat_check'
const KEY_HAS_BACKGROUND_ACTIVITY = 'has_background_activity'

export type WebSession = {
  session_id: string
  site: string
  url: string
  title?: string
  started_at: number
  ended_at?: number
  has_ended: boolean
  [KEY_LAST_HEARTBEAT_CHECK]: number
  [KEY_HAS_BACKGROUND_ACTIVITY]?: boolean
  tabId?: number
  windowId?: number
  is_synced: boolean
  synced_at?: number
  focus_events: string
}

export type FocusEvent = {
  type: 'FOCUS_IN' | 'FOCUS_OUT'
  timestamp: number
}

type SessionPayload = {
  url: string
  title?: string
  tabId?: number
  windowId?: number
  [KEY_HAS_BACKGROUND_ACTIVITY]?: boolean
}

// START: Web session related events
export function startActiveSession(store: Store, payload: SessionPayload) {
  const session_id = uuid()
  const current_timestamp = new Date().getTime()
  const { host } = new URL(payload.url)
  const site = siteIdFromHost(host)

  // initing focus in event for the window/tab/session
  const focus_events: Array<FocusEvent> = [
    {
      type: 'FOCUS_IN',
      timestamp: current_timestamp,
    },
  ]

  const session: WebSession = {
    session_id,
    site,

    url: payload.url,
    title: payload.title,
    tabId: payload.tabId,
    windowId: payload.windowId,
    has_background_activity: payload[KEY_HAS_BACKGROUND_ACTIVITY],

    started_at: current_timestamp,
    [KEY_LAST_HEARTBEAT_CHECK]: current_timestamp,
    has_ended: false,
    // tinybase call has limitation of storing only primitive values (string, number, boolean)
    focus_events: JSON.stringify(focus_events),

    // sync related properties
    is_synced: false,
  }

  store.setRow(WEB_SESSIONS_TABLE, session_id, session)
}

// ends active session for given url (and tab id if present)
export function endActiveSession(store: Store, url: string, tabId?: number) {
  // find the active session for previous active url - has_ended not set, ended_at time not set, url has to match previous active url
  // if multiple sessions are present, pick the first one and mark as ended
  const ACTIVE_SESSIONS_QUERY = 'active_sessions_for_url'
  const queries = createQueries(store)

  // grab all the active sessions for a given url
  queries.setQueryDefinition(
    ACTIVE_SESSIONS_QUERY,
    WEB_SESSIONS_TABLE,
    ({ select, where }) => {
      select('session_id')
      where(getCell => {
        // note: we are not matching url because for background sites url will change. for e.g. youtube.com/watch => youtube.com
        // if tab id is given, it fetches session for given url AND tab id; if not it fetches session for given url
        const site = getCell('site')
        const isSiteMatch = isURLbelongsToSite({
          url,
          site: isString(site) ? site : '',
        })
        if (tabId) {
          return isSiteMatch && getCell('tabId') === tabId
        }

        return isSiteMatch
      })
      where('has_ended', false)
      where(getCell => {
        return getCell('ended_at') === undefined
      })
    }
  )

  // get active sessions
  const all_active_sessions = queries.getResultRowIds(ACTIVE_SESSIONS_QUERY)
  // if there are active session, grab the first active session and mark as complete
  const active_session = head(all_active_sessions)

  if (active_session) {
    // just update ended at metadata
    store.setPartialRow(WEB_SESSIONS_TABLE, active_session, {
      has_ended: true,
      ended_at: new Date().getTime(),
    })
  }
}

// ends all active sessions for given tab id. When a tab is closed, we get only tab id and we cannot query for tab info
// we will just close all active session for tab id
export function endActiveSessionsForTab(store: Store, tabId: number) {
  // find the active session for previous active url - has_ended not set, ended_at time not set, url has to match previous active url
  // if multiple sessions are present, pick the first one and mark as ended
  const ACTIVE_SESSIONS_FOR_TAB_QUERY = 'active_sessions_for_tab'
  const queries = createQueries(store)

  // grab all the active sessions for a given url
  queries.setQueryDefinition(
    ACTIVE_SESSIONS_FOR_TAB_QUERY,
    WEB_SESSIONS_TABLE,
    ({ select, where }) => {
      select('session_id')
      where('tabId', tabId)
      where('has_ended', false)
      where(getCell => {
        return getCell('ended_at') === undefined
      })
    }
  )

  queries.forEachResultRow(ACTIVE_SESSIONS_FOR_TAB_QUERY, rowId => {
    store.setPartialRow(WEB_SESSIONS_TABLE, rowId, {
      has_ended: true,
      ended_at: new Date().getTime(),
    })
  })
}

// checks the websession if there is an active session for the tab with background activity
export function isActiveBackgroundTab(store: Store, tabId: number): boolean {
  const IS_ACTIVE_BACKGROUND_TAB_QUERY = 'is_active_background_tab_query'
  const queries = createQueries(store)
  queries.setQueryDefinition(
    IS_ACTIVE_BACKGROUND_TAB_QUERY,
    WEB_SESSIONS_TABLE,
    ({ select, where }) => {
      select('session_id')
      where(getCell => {
        // we should have an exact tab id
        if (tabId === undefined) {
          return false
        }

        return getCell('tabId') === tabId
      })
      where(KEY_HAS_BACKGROUND_ACTIVITY, true)
      where('has_ended', false)
      where(getCell => {
        return getCell('ended_at') === undefined
      })
    }
  )

  // we should have a match for background tab query
  return queries.getResultRowCount(IS_ACTIVE_BACKGROUND_TAB_QUERY) > 0
}

// END: Web session related events
// ----------------------------------------------------------------

// START: Alarm handlers

export function prune_offline_web_sessions(store: Store) {
  // For offline web sessions: we are deleting web sessions that are older than 5 hours
  // extension events are considreed offline if there are no connected account
  const is_offline_account = true

  if (!is_offline_account) {
    // abort if an account is connected in the extension
    return
  }

  const SECONDS = 1 * 1000 // millisecond
  const MINUTES = 60 * SECONDS
  const HOURS = 60 * MINUTES
  // 5 hours is the threshold
  const THRESHOLD = 5 * HOURS

  const OLD_OFFLINE_SESSIONS_QUERY = 'old_offline_sessions_query'
  const queries = createQueries(store)

  queries.setQueryDefinition(
    OLD_OFFLINE_SESSIONS_QUERY,
    WEB_SESSIONS_TABLE,
    ({ select, where }) => {
      select('session_id')
      // only ended sessions
      where('has_ended', true)
      where(getCell => {
        const current_ts = new Date().getTime()
        const ended_at = getCell('ended_at')

        if (!isNumber(ended_at)) {
          return false
        }

        return ended_at !== undefined && current_ts - ended_at > THRESHOLD
      })
    }
  )

  queries.forEachResultRow(OLD_OFFLINE_SESSIONS_QUERY, rowId => {
    store.delRow(WEB_SESSIONS_TABLE, rowId)
  })
}

export function clean_stale_active_sessions(store: Store) {
  // stale active sessions may result when the user quits the browser or computer crashes
  // new tabs result in new sessions; open active tabs have heartbeat updated.
  // for web sessions with heart beat older than threshold (e.g. 3.14 minutes) mark it as ended with threshold time

  const SECONDS = 1 * 1000 // millisecond
  const MINUTES = 60 * SECONDS
  const THRESHOLD = 3.14 * MINUTES

  const STALE_ACTIVE_SESSIONS_QUERY = 'stale_active_sessions_query'
  const queries = createQueries(store)

  queries.setQueryDefinition(
    STALE_ACTIVE_SESSIONS_QUERY,
    WEB_SESSIONS_TABLE,
    ({ select, where }) => {
      select('session_id')
      // active sessions
      where('has_ended', false)
      where(getCell => {
        const current_ts = new Date().getTime()
        const last_heartbeat_check = getCell(KEY_LAST_HEARTBEAT_CHECK)

        if (!isNumber(last_heartbeat_check)) {
          return false
        }

        return (
          last_heartbeat_check !== undefined &&
          current_ts - last_heartbeat_check > THRESHOLD
        )
      })
    }
  )

  queries.forEachResultRow(STALE_ACTIVE_SESSIONS_QUERY, rowId => {
    const info = store.getRow(WEB_SESSIONS_TABLE, rowId)
    // update row with last_heartbeat_check as ended_at and mark it as ended
    const ended_at = info[KEY_LAST_HEARTBEAT_CHECK]
    store.setPartialRow(WEB_SESSIONS_TABLE, rowId, {
      has_ended: true,
      ended_at,
    })
  })
}

// for active session - current active tab + window + url
// 1 - update heart beat
// 2 - update focus events for active session

// for foreground update heart beat; for background check if tab is valid and update heartbeat
export async function update_heart_beat_for_active_session(store: Store) {
  // preliminary check: Get the window details for current active window id along with all the tabs
  // and check if active tab id is present with active tab url
  const active_tab_url = store.getValue(ACTIVE_TAB_URL)
  const active_tab_id = store.getValue(ACTIVE_TAB_ID)
  const active_window_id = store.getValue(ACTIVE_WINDOW_ID)

  let windowInfo = undefined

  if (isNumber(active_window_id)) {
    windowInfo = await browser.windows.get(active_window_id, {
      populate: true,
    })
  }

  // all fine!
  const CURRENT_ACTIVE_SESSION_QUERY = 'current_active_session_query'
  const queries = createQueries(store)
  const is_window_focused = windowInfo?.focused

  // get active session based on - active tab url + tab id + window id
  queries.setQueryDefinition(
    CURRENT_ACTIVE_SESSION_QUERY,
    WEB_SESSIONS_TABLE,
    ({ select, where }) => {
      select('session_id')
      // should be an active session that has not ended
      where('has_ended', false)
      where(getCell => {
        // return foreground session or background session
        const isForegroundSession =
          getCell('url') === active_tab_url &&
          getCell('tabId') === active_tab_id &&
          getCell('windowId') === active_window_id
        const isBackgroundSession =
          getCell(KEY_HAS_BACKGROUND_ACTIVITY) === true

        return isForegroundSession || isBackgroundSession
      })
    }
  )

  const active_session_row_ids = queries.getResultRowIds(
    CURRENT_ACTIVE_SESSION_QUERY
  )

  // update heartbeat for ALL sessions matching the condition (background sessions, foreground sessions etc)
  for await (const rowId of active_session_row_ids) {
    // get session details from store for updating
    const session_details = store.getRow(
      WEB_SESSIONS_TABLE,
      rowId
    ) as WebSession
    const latest_focus_events = update_focus_events(
      session_details['focus_events'] as string,
      !!is_window_focused
    )

    const session_payload: Partial<WebSession> = {
      focus_events: latest_focus_events,
      [KEY_LAST_HEARTBEAT_CHECK]: new Date().getTime(),
    }

    const isBackgroundSession =
      session_details[KEY_HAS_BACKGROUND_ACTIVITY] === true
    if (!isBackgroundSession) {
      // update session with latest heartbeat and focus events
      store.setPartialRow(WEB_SESSIONS_TABLE, rowId, session_payload)
    } else {
      // for background session we will fetch the tab details and see if url has background activity
      // this makes sure even if browser rebooted meanwhile, we are updating heartbeat only for valid background tabs
      if (!session_details.tabId) {
        return
      }

      try {
        const tab = await browser.tabs.get(session_details.tabId)
        const url = tab.url
        if (!url) {
          return
        }

        const storeContent = store.getContent()
        const sites = trackedSitesFromStoreContent(storeContent)
        const { has_background_activity } = urlTrackingStatus({ url, sites })

        if (has_background_activity === true) {
          // we have a valid active background session
          store.setPartialRow(WEB_SESSIONS_TABLE, rowId, session_payload)
        }
      } catch (e) {}
    }
  }
}

// END: Alarm handlers
// ----------------------------------------------------------------

// helper function to update focus events
// input: JSON stringified focus events, current window focus status
// output: JSON stringified focus events with updated event
function update_focus_events(
  events: string,
  is_window_focused: boolean
): string {
  try {
    const parsed = JSON.parse(events)
    if (!isArray(parsed)) {
      return events
    }
    // hopefully we have a valid JSON of focus events
    const recent: FocusEvent = last(parsed)
    // we will add a new focus event entry only if the last event type is different from current one
    const isFocusIn = recent.type === 'FOCUS_IN' && is_window_focused === true
    const isFocusOut =
      recent.type === 'FOCUS_OUT' && is_window_focused === false
    const noChange = isFocusIn || isFocusOut
    if (noChange) {
      return events
    }

    const latest: FocusEvent = {
      type: is_window_focused ? 'FOCUS_IN' : 'FOCUS_OUT',
      timestamp: new Date().getTime(),
    }

    parsed.push(latest)

    return JSON.stringify(parsed)
  } catch (e) {
    // probably the json is malformed; return back the incoming string
    return events
  }
}
