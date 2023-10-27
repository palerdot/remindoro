import React from 'react'
import { useRow } from 'tinybase/ui-react'
import { Box, Stack } from '@mui/material'

import { WEB_SESSIONS_TABLE } from '@background/time-tracker/store'
import { WebSession } from '@background/time-tracker/web-session'
import { formattedWebSessionDuration } from '@app/Util/'

type Props = {
  rowId: string
}

function WebSessionStat({ rowId }: Props) {
  const stat = useRow(WEB_SESSIONS_TABLE, rowId) as WebSession

  return (
    <Box>
      <Stack direction={'column'} spacing={1}>
        <div>{stat.url}</div>
        <div>{`Duration: ${formattedWebSessionDuration(
          stat.started_at,
          stat.ended_at
        )}`}</div>
        <div>{`Started: ${stat.started_at}`}</div>
        <div>{`Ended: ${stat.ended_at}`}</div>
        <div>{stat.focus_events}</div>
      </Stack>
    </Box>
  )
}

export default WebSessionStat
