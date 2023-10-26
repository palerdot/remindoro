import React from 'react'
import styled from '@emotion/styled'
import { Stack } from '@mui/material'

import { TrackedSite } from '@background/time-tracker/store'
import Timeago from '@app/Components/Timeago'

const SitePill = styled.div`
  font-size: 0.89rem;
  font-style: italic;

  width: fit-content;
  padding: 4px 8px;
  border-radius: 5px;

  border: ${props => `thin solid ${props.theme.borderDark}`};
  background: ${props => props.theme.highlight};
  color: ${props => props.theme.contrastTextColor};
`

interface Props extends TrackedSite {}

function SiteGist({ site, initiated_time }: Props) {
  return (
    <Stack direction={'column'} spacing={1}>
      <SitePill>{site}</SitePill>
      {initiated_time && (
        <Stack direction={'row'} spacing={1}>
          <div>{'Initiated: '}</div>
          <Timeago timestamp={initiated_time} />
        </Stack>
      )}
    </Stack>
  )
}

export default SiteGist
