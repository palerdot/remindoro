import React, { useMemo } from 'react'
import { Stack, Divider } from '@mui/material'
import { createQueries, Store } from 'tinybase'
import { useStore, useRow } from 'tinybase/ui-react'
import styled from '@emotion/styled'

import {
  TrackedSite,
  TIME_TRACKED_SITES_TABLE,
  WEB_SESSIONS_TABLE,
} from '@background/time-tracker/store'
import SiteGist from '@app/Screens/TimeTracker/SiteGist'
import WebSessionStat from './WebSession'
import Faq from '@app/Components/TimeTracker/Faq'
import { WebSession as WebSessionType } from '@background/time-tracker/web-session'

const QUERY_WEB_SESSIONS_FOR_SITE = 'query-web-sessions-for-site'

type Props = {
  site: string
}

const Holder = styled.div`
  padding-bottom: 34px;

  & .section {
    padding: 16px;
  }

  & .subtitle {
    font-size: 0.75rem;
    font-style: italic;
  }
`

// IMPORTANT: We are extracting tinybase store hooks related logic into a separate component to prevent rerender issues
function Activity({ site }: Props) {
  const store: Store = useStore() as Store
  // directly get web session stats
  const stats = useMemo(() => {
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

    const rowIds = queries.getResultSortedRowIds(
      // queryId
      QUERY_WEB_SESSIONS_FOR_SITE,
      // cell to sort
      // 'ended_at',
      'started_at',
      // descending
      false,
      // offset
      0,
      // limit
      undefined
    )

    const rows = rowIds.map(rowId => {
      return store.getRow(WEB_SESSIONS_TABLE, rowId)
    }) as Array<WebSessionType>

    // sort the row with ended at descending order
    return rows.sort((a: WebSessionType, b: WebSessionType) => {
      return (b.ended_at || 0) - (a.ended_at || 0)
    })
  }, [store, site])

  return (
    <Holder>
      <SiteInfo site={site} />
      <div className="section">
        <div>{'Recent Activity'}</div>
        <div className="subtitle">
          {
            'Activity shown for last 5 hours (or less depending on the browser).'
          }
        </div>
      </div>
      <Stack
        direction={'column'}
        spacing={3}
        divider={
          <Divider
            orientation="horizontal"
            flexItem
            sx={{
              background: theme => theme.colors.primary,
              // color: theme => theme.colors.primary,
            }}
          />
        }
      >
        {stats.map(stat => (
          <div
            key={stat.session_id}
            style={{
              padding: 'auto 16px',
            }}
          >
            <WebSessionStat {...stat} />
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

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 16px',
      }}
    >
      <SiteGist {...siteInfo} />
      <Faq showIcon={true} text={'FAQ'} />
    </div>
  )
}
