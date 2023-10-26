import React, { useState, useCallback } from 'react'
import { Stack, TextField } from '@mui/material'

import { AddSiteButton } from '@app/Components/TimeTracker/AddSite/AddSiteFab'
import { requestPermissions } from '@app/Components/TimeTracker/host-permissions'
import HostPermissionStatus from '@app/Components/TimeTracker/HostPermissionStatus'

type Props = {
  onSuccess: () => void
}

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
      host: parsed.host,
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

function AddSite({}: Props) {
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
      console.log('porumai ... we have permission granted for host ', host)
      // save the url
      setSaving(true)
    } catch (e) {
    } finally {
      setHost(host)
    }
  }, [url, setError, setSaving])

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
      </Stack>
    </div>
  )
}

export default AddSite
