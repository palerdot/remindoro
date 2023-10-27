import React from 'react'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import { useTable } from 'tinybase/ui-react'
import { Stack } from '@mui/material'
import { PendingActions as PendingActionsIcon } from '@mui/icons-material'
import { keys, isEmpty } from '@lodash'

import { TIME_TRACKED_SITES_TABLE } from '@background/time-tracker/store'
import CardHolder from '@app/Components/CardHolder'
import { Screens } from '@app/Util/Enums'
import { SitePill } from './SiteGist'

export const Holder = styled.div`
  & .title-holder {
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 4px;

    & .title {
      font-size: 1.25rem;
      font-weight: 500;
      margin: auto 8px;
    }

    & .beta {
      font-size: 0.75rem;
      font-style: italic;
    }
  }

  & .help-info {
    font-size: 0.89rem;
    font-style: italic;

    margin: 8px;
    padding: 8px;
    border-radius: 5px;

    border: ${props => `thin solid ${props.theme.primaryDark}`};
    background: ${props => props.theme.background};
    color: ${props => props.theme.textColor};
  }

  & .content {
    padding: 8px;
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

function Gist() {
  const history = useHistory()
  const tracked_sites = useTable(TIME_TRACKED_SITES_TABLE)

  return (
    <CardHolder
      onClick={() => {
        history.push(Screens.TimeTracker)
      }}
    >
      <Holder>
        <div className="title-holder">
          <PendingActionsIcon fontSize="medium" />
          <div className="title">{'Browsing Time Tracker'}</div>
          <div className="beta">{'BETA'}</div>
        </div>
        <div className="content">
          {isEmpty(tracked_sites) ? (
            <div>{'No sites added for time tracking'}</div>
          ) : (
            <SitesPreview sites={keys(tracked_sites)} />
          )}
        </div>
        <div className="help-info">
          {
            'Time Tracker helps you to track time spent on websites like social media. This helps you to have a healthy digital habits. More features like detailed statistics and tracking more than one site is currently in private beta.'
          }
        </div>
        <div className="subtitle">
          {'Click on the card to go to Time Tracker screen.'}
        </div>
      </Holder>
    </CardHolder>
  )
}

export default Gist

function SitesPreview({ sites }: { sites: Array<string> }) {
  return (
    <Stack direction={'column'} spacing={1}>
      <div>{`${sites.length} ${
        sites.length === 1 ? 'site' : 'sites'
      } added for time tracking.`}</div>
      <Stack direction={'row'} spacing={2}>
        {sites.map(site => (
          <SitePill key={site}>{site}</SitePill>
        ))}
      </Stack>
    </Stack>
  )
}
