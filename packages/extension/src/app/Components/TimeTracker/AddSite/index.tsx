import React, { useState, useCallback } from 'react'
import { Stack, TextField } from '@mui/material'
import styled from '@emotion/styled'
import { useStore } from 'tinybase/ui-react'

import {
  TIME_TRACKED_SITES_TABLE,
  TrackedSite,
  siteIdFromHost,
} from '@background/time-tracker/store'
import { AddSiteButton } from '@app/Components/TimeTracker/AddSite/AddSiteFab'
import { requestPermissions } from '@app/Components/TimeTracker/host-permissions'
import HostPermissionStatus from '@app/Components/TimeTracker/HostPermissionStatus'
import { isChrome, isFirefox } from '@background/utils'

type Props = {
  onSuccess: (host: string) => void
}

const HelpInfo = styled.div`
  font-size: 0.75rem;
  font-style: italic;

  margin: 8px;
  padding: 8px;
  border-radius: 5px;

  border: ${props => `thin solid ${props.theme.primaryDark}`};
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
`

function isValidHost(host: string): boolean {
  // youtube.com, instagram.com
  return host.split('.').length === 2
}

function isValidURL(
  url: string
): {
  isValid: boolean
  host: string
} {
  try {
    const parsed = new URL(url)
    return {
      isValid: true,
      host: siteIdFromHost(parsed.host),
    }
  } catch (e) {
    // check if they directly entered the hostname
    if (isValidHost(url)) {
      return {
        isValid: true,
        host: url,
      }
    } else {
      return {
        isValid: false,
        host: '',
      }
    }
  }
}

function AddSite({ onSuccess }: Props) {
  const store = useStore()

  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [host, setHost] = useState('')

  const addSiteTracking = useCallback(async () => {
    const { isValid, host } = isValidURL(url)

    if (!isValid) {
      setError('Please enter a valid site URL.')
      // abort
      return
    }

    try {
      const granted = await requestPermissions(host)
      if (!granted) {
        setError(`${host} not granted tab permissions.`)
        return
      }
      // save the url
      setHost(host)
      setSaving(true)
      // save to store
      const row: TrackedSite = {
        site: host,
        initiator: 'EXTENSION',
        initiated_time: new Date().getTime(),
      }
      store?.setRow(TIME_TRACKED_SITES_TABLE, host, row)
      // call on success callback
      onSuccess(host)
    } catch (e) {
      setHost(host)
    }
  }, [store, url, setError, setSaving, onSuccess])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Stack direction={'column'} spacing={2}>
        <TextField
          disabled={saving}
          error={error.length > 0}
          id="site-url-for-tracking"
          label={error.length > 0 ? error : 'Enter Site URL'}
          defaultValue={url}
          helperText={error.length > 0 ? error : 'e.g. https://www.youtube.com'}
          onChange={e => {
            setUrl(e.target.value)
            setError('')
            setHost('')
          }}
        />
        {isValidHost(host) && <HostPermissionStatus host={host} />}
        <AddSiteButton
          onClick={() => {
            addSiteTracking()
          }}
          disabled={saving}
        />
        <HelpInfo>
          {`You will be asked to grant permissions for the site (if not already granted). Any open tabs prior to granting permission will not be time tracked. ${
            isChrome
              ? 'In chrome, if you see the popup window closing after you grant permission, please try again. Please note this is currently a bug in chrome as it automatically closes extension popup window when lost focus.'
              : ''
          }${
            isFirefox
              ? 'In firefox, the permission popup is shown in the top left corner, which might be sometimes hidden below the extensions popup window. When you close the popup, you might see the permission popup and clicking on it will grant you permission for tracking site activity.'
              : ''
          }`}
        </HelpInfo>
      </Stack>
    </div>
  )
}

export default AddSite
