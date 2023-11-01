import React, { useState, useEffect } from 'react'
import browser from 'webextension-polyfill'
import { Stack, Paper } from '@mui/material'
import { SdCard as SdCardIcon } from '@mui/icons-material'

import { isChrome } from '@background/utils'
import { STORAGE_KEY as REMINDORO_STORE_KEY } from '@app/Constants'
import { STORE_KEY as TIMETRACKER_STORE_KEY } from '@background/time-tracker/store'

// 5 MB
const TOTAL_SPACE = 5 * 1048576

function round(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

function SpaceUsage() {
  const [space, setSpace] = useState<number>()

  useEffect(() => {
    if (!isChrome) {
      return
    }

    // @ts-ignore
    browser.storage.local
      // @ts-ignore
      .getBytesInUse([REMINDORO_STORE_KEY, TIMETRACKER_STORE_KEY])
      .then((bytes: number) => {
        setSpace(round((bytes / TOTAL_SPACE) * 100))
      })
  }, [setSpace])

  if (!space) {
    return null
  }

  return (
    <Paper
      sx={{
        padding: '16px',
      }}
    >
      <Stack flexDirection={'row'} alignItems={'center'} spacing={1}>
        <SdCardIcon fontSize="medium" />
        <div
          style={{
            fontWeight: '600',
            margin: '0 8px',
          }}
        >
          {'Space Usage: '}
        </div>
        <div
          style={{
            margin: 0,
          }}
        >{` ${space} %`}</div>
      </Stack>
      <div
        style={{
          fontSize: '0.75rem',
          fontStyle: 'italic',
        }}
      >
        {'This is the best guess estimate based on your browser.'}
      </div>
    </Paper>
  )
}

export default SpaceUsage
