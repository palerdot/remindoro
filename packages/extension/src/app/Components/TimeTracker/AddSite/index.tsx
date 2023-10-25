import React, { useState, useCallback } from 'react'
import { TextField } from '@mui/material'

import { AddSiteButton } from '@app/Components/TimeTracker/AddSite/AddSiteFab'

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
  const [isError, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  const validateURL = useCallback(() => {
    const { isValid, host } = isValidURL(url)

    if (!isValid) {
      setError(true)
      // abort
      return
    }

    // save the url
    setSaving(true)
    console.log('porumai ... site url ', host)
  }, [url, setError, setSaving])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <TextField
        error={isError}
        id="site-url-for-tracking"
        label={isError ? 'Error' : 'Enter Site URL'}
        defaultValue={url}
        helperText={
          isError
            ? 'Please enter valid site URL'
            : 'e.g. https://www.youtube.com'
        }
        onChange={e => {
          setUrl(e.target.value)
          setError(false)
        }}
      />
      <div
        style={{
          margin: '8px auto',
        }}
      >
        <AddSiteButton
          onClick={() => {
            validateURL()
          }}
          disabled={saving}
        />
      </div>
    </div>
  )
}

export default AddSite
