import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Stack, Divider } from '@mui/material'
import { createQueries, Store } from 'tinybase'
import { useStore, useRow, useResultSortedRowIds } from 'tinybase/ui-react'
import styled from '@emotion/styled'

import {
  TrackedSite,
  TIME_TRACKED_SITES_TABLE,
  WEB_SESSIONS_TABLE,
} from '@background/time-tracker/store'
import { Screens } from '@app/Routes/'
import SiteGist from '@app/Screens/TimeTracker/SiteGist'
import WebSessionStat from './WebSession'

type Maybe<T> = T | undefined

const Holder = styled.div`
  & .section {
    padding: 8px 16px;
  }
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
      where(getCell => {
        return getCell('ended_at') !== undefined
      })
    }
  )
  const sortedRowIds = useResultSortedRowIds(
    // queryId
    QUERY_WEB_SESSIONS_FOR_SITE,
    // cell to sort
    'ended_at',
    // descending
    true,
    // offset
    0,
    // limit
    undefined,
    // queries reference
    queries
  )
  const siteInfo: TrackedSite = useRow(
    TIME_TRACKED_SITES_TABLE,
    site
  ) as TrackedSite

  return (
    <Holder>
      <div className="section">
        <SiteGist {...siteInfo} />
      </div>
      <Stack
        direction={'column'}
        spacing={4}
        divider={
          <Divider
            orientation="horizontal"
            flexItem
            sx={{
              background: theme => theme.colors.highlight,
              color: theme => theme.colors.highlight,
            }}
          />
        }
      >
        {sortedRowIds.map(rowId => (
          <div className="section" key={rowId}>
            <WebSessionStat rowId={rowId} />
          </div>
        ))}
      </Stack>
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
