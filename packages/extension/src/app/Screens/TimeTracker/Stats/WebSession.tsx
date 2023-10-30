import React from 'react'
import styled from '@emotion/styled'
import { useRow } from 'tinybase/ui-react'
import { Box, Stack } from '@mui/material'
import { HourglassTop } from '@mui/icons-material'

import { WEB_SESSIONS_TABLE } from '@background/time-tracker/store'
import { WebSession } from '@background/time-tracker/web-session'
import { formattedWebSessionDuration } from '@app/Util/'
import FocusEvents from '@app/Components/TimeTracker/FocusEvents'

type Props = {
  rowId: string
}

const Ahref = styled.a`
  color: ${props => props.theme.highlight};

  &:hover {
    opacity: 0.89;
  }
`

const Label = styled.div`
  color: ${props => props.theme.primaryLight};
  font-size: 0.89;
  font-style: italic;
`

function WebSessionStat({ rowId }: Props) {
  const stat = useRow(WEB_SESSIONS_TABLE, rowId) as WebSession

  return (
    <Box
      sx={{
        paddingX: '16px',
        fontSize: '0.89rem',
      }}
    >
      <Stack direction={'column'} spacing={0.5}>
        <Box
          sx={{
            color: theme => theme.colors.textColor,
          }}
        >
          <Ahref href={stat.url} target="_blank">
            {stat.url}
          </Ahref>
        </Box>
        <Stack direction={'row'} spacing={1}>
          <div>
            <HourglassTop fontSize="small" />
          </div>
          <div>
            {formattedWebSessionDuration(stat.started_at, stat.ended_at)}
          </div>
        </Stack>
        <Stack direction={'row'} spacing={1}>
          <Label>{'Started:'}</Label>
          <div>{new Date(stat.started_at).toString()}</div>
        </Stack>
        {stat.ended_at && (
          <Stack direction={'row'} spacing={1}>
            <Label>{'Ended :'}</Label>
            <div>{new Date(stat.ended_at).toString()}</div>
          </Stack>
        )}
        <FocusEvents stringified={stat.focus_events} />
      </Stack>
    </Box>
  )
}

export default WebSessionStat
