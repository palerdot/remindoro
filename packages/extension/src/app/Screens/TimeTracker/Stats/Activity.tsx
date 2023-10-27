import React, { useMemo } from 'react'
import { Stack, Divider } from '@mui/material'
import { createQueries, Store } from 'tinybase'
import { useStore, useRow, useResultSortedRowIds } from 'tinybase/ui-react'
import styled from '@emotion/styled'

import {
  TrackedSite,
  TIME_TRACKED_SITES_TABLE,
  WEB_SESSIONS_TABLE,
} from '@background/time-tracker/store'
import SiteGist from '@app/Screens/TimeTracker/SiteGist'
import WebSessionStat from './WebSession'

const QUERY_WEB_SESSIONS_FOR_SITE = 'query-web-sessions-for-site'

type Props = {
  site: string
}

const Holder = styled.div`
  & .section {
    padding: 8px 16px;
  }

  & .subtitle {
    font-size: 0.75rem;
    font-style: italic;

    padding-bottom: 16px;
    margin-bottom: 8px;

    display: flex;
    justify-content: center;
  }
`

// IMPORTANT: We are extracting tinybase store hooks related logic into a separate component to prevent rerender issues
function Activity({ site }: Props) {
  const store: Store = useStore() as Store
  const queries = useMemo(() => {
    return createQueries(store).setQueryDefinition(
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
  }, [store])
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
  return (
    <Holder>
      <div className="section">
        <SiteInfo site={site} />
        <div>{'Recent Activity'}</div>
        <div className="subtitle">
          {
            'Activity shown for last 5 hours (or less depending on the browser).'
          }
        </div>
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
          <div
            key={rowId}
            style={{
              padding: 'auto 16px',
            }}
          >
            <WebSessionStat rowId={rowId} />
          </div>
        ))}
      </Stack>
    </Holder>
  )
}

export default Activity

function SiteInfo({ site }: { site: string }) {
  const siteInfo: TrackedSite = useRow(
    TIME_TRACKED_SITES_TABLE,
    site
  ) as TrackedSite

  return <SiteGist {...siteInfo} />
}
