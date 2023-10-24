import browser from 'webextension-polyfill'
import { createQueries, Store } from 'tinybase'
import { v4 as uuid } from 'uuid'
import { head, isNumber, isArray, last } from '@lodash'

import {
  WEB_SESSIONS_TABLE,
  ACTIVE_TAB_ID,
  ACTIVE_TAB_URL,
  ACTIVE_WINDOW_ID,
} from '@background/time-tracker/store'

export type WebSession = {
  session_id: string
  site: string
  url: string
  title?: string
  started_at: number
  ended_at?: number
  has_ended: boolean
  last_heartbeat_at: number
  tabId?: number
  windowId?: number
  is_synced: boolean
  synced_at?: number
  focus_events: string
}

type FocusEvent = {
  type: 'FOCUS_IN' | 'FOCUS_OUT'
  timestamp: number
}

type SessionPayload = {
  url: string
  title?: string
  tabId?: number
  windowId?: number
}

// START: Web session related events
export function startActiveSession(store: Store, payload: SessionPayload) {
  const session_id = uuid()
  const current_timestamp = new Date().getTime()
  const { host: site } = new URL(payload.url)

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

    started_at: current_timestamp,
    last_heartbeat_at: current_timestamp,
    has_ended: false,
    // tinybase call has limitation of storing only primitive values (string, number, boolean)
    focus_events: JSON.stringify(focus_events),

    // sync related properties
    is_synced: false,
  }

  store.setRow(WEB_SESSIONS_TABLE, session_id, session)
}

export function endActiveSession(store: Store, url: string) {
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
      where('url', url)
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
// END: Web session related events
// ----------------------------------------------------------------

// START: Alarm handlers

export function prune_old_web_sessions(_store: Store) {
  // For offline web sessions: we are deleting web sessions that are older than 5 hours
  // For server acknowledged sessions: we will be deleting sessions that are older than an hour
}

export function clean_stale_active_sessions(_store: Store) {
  // stale active sessions may result when the user quits the browser or computer crashes
  // for web sessions with heart beat older than threshold (e.g. 3 minutes) mark it as ended
}

// for active session - current active tab + window + url
// 1 - update heart beat
// 2 - update focus events for active session
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

  // we should have window details by now
  if (windowInfo === undefined) {
    return
  }

  // check if the active window has active tab with our active url
  const all_fine = windowInfo.tabs?.find(
    t => t.id === active_tab_id && t.url === active_tab_url
  )

  // our active tab/window/url details does not line up
  if (!all_fine) {
    // abort
    return
  }

  // all fine!
  const CURRENT_ACTIVE_SESSION_QUERY = 'current_active_session_query'
  const queries = createQueries(store)
  const is_window_focused = windowInfo.focused

  // get active session based on - active tab url + tab id + window id
  queries.setQueryDefinition(
    CURRENT_ACTIVE_SESSION_QUERY,
    WEB_SESSIONS_TABLE,
    ({ select, where }) => {
      select('session_id')
      // should be an active session that has no ended
      where('has_ended', false)
      where(getCell => {
        return (
          getCell('url') === active_tab_url &&
          getCell('tabId') === active_tab_id &&
          getCell('windowId') === active_window_id
        )
      })
    }
  )

  // get first active session (sorted by latest 'last_heartbeat_at' timestamp)
  const [active_session_id] = queries.getResultSortedRowIds(
    // query name
    CURRENT_ACTIVE_SESSION_QUERY,
    // cell id for sorting
    'last_heartbeat_at',
    // descending
    true,
    // offset
    0,
    // limit
    1
  )

  // abort if there is no active session
  if (!active_session_id) {
    return
  }

  // get session details from store for updating
  const session_details = store.getRow(WEB_SESSIONS_TABLE, active_session_id)
  const latest_focus_events = update_focus_events(
    session_details['focus_events'] as string,
    is_window_focused
  )

  const session_payload: Partial<WebSession> = {
    focus_events: latest_focus_events,
    last_heartbeat_at: new Date().getTime(),
  }

  // update session with latest heartbeat and focus events
  store.setPartialRow(WEB_SESSIONS_TABLE, active_session_id, session_payload)
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
