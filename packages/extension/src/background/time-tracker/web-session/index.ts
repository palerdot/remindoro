import { createQueries, Store } from 'tinybase'
import { v4 as uuid } from 'uuid'
import { head } from '@lodash'

import { WEB_SESSIONS_TABLE } from '@background/time-tracker/store'

export type WebSession = {
  session_id: string
  site: string
  url: string
  title?: string
  started_at: number
  ended_at?: number
  has_ended: boolean
  last_health_check: number
}

type SessionPayload = {
  url: string
  title?: string
}

export function startActiveSession(store: Store, payload: SessionPayload) {
  const session_id = uuid()
  const current_timestamp = new Date().getTime()
  const { host: site } = new URL(payload.url)

  const session: WebSession = {
    session_id,
    site,
    url: payload.url,
    title: payload.title,
    started_at: current_timestamp,
    last_health_check: current_timestamp,
    has_ended: false,
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
