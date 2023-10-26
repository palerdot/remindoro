import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { createQueries, Store } from 'tinybase'
import { useStore, useRow, ResultTableView } from 'tinybase/ui-react'
import styled from '@emotion/styled'

import {
  TrackedSite,
  TIME_TRACKED_SITES_TABLE,
  WEB_SESSIONS_TABLE,
} from '@background/time-tracker/store'
import { Screens } from '@app/Routes/'
import SiteGist from '@app/Screens/TimeTracker/SiteGist'

type Maybe<T> = T | undefined

const Holder = styled.div`
  padding: 8px 16px;
`

const QUERY_WEB_SESSIONS_FOR_SITE = 'query-web-sessions-for-site'

function Stats({ site }: { site: string }) {
  const store: Store = useStore() as Store
  const queries = createQueries(store).setQueryDefinition(
    QUERY_WEB_SESSIONS_FOR_SITE,
    WEB_SESSIONS_TABLE,
    ({ select, where }) => {
      select('session_id')
      where('has_ended', true)
      where('site', site)
    }
  )
  const siteInfo: TrackedSite = useRow(
    TIME_TRACKED_SITES_TABLE,
    site
  ) as TrackedSite

  return (
    <Holder>
      <SiteGist {...siteInfo} />
      <ResultTableView
        queryId={QUERY_WEB_SESSIONS_FOR_SITE}
        queries={queries}
        separator={'/'}
      />
    </Holder>
  )
}

function Checker() {
  const pathInfo = useParams<
    Maybe<{
      site: string
    }>
  >()

  if (!pathInfo?.site) {
    // IMPORTANT: This edge case should never happen
    return (
      <div>
        {
          'Cannot find information ... Please give feedback if you encounter this issue'
        }
        <Link to={Screens.Home}>{'Go to Home'}</Link>
      </div>
    )
  }

  const { site } = pathInfo

  return <Stats site={site} />
}

export default Checker
