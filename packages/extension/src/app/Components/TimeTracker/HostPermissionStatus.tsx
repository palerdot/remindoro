import React, { useState, useEffect, useCallback } from 'react'
import browser from 'webextension-polyfill'
import { Chip } from '@mui/material'
import { HourglassBottom, Done, ErrorOutline } from '@mui/icons-material'
import { some } from '@lodash'

import { requestPermissions } from './host-permissions'

type Props = {
  host: string
}

type StatusCheck = 'CHECKING' | 'GRANTED' | 'NOT_GRANTED'

function HostPermissionStatus({ host }: Props) {
  const [status, setStatus] = useState<StatusCheck>('CHECKING')

  useEffect(() => {
    browser.permissions
      .getAll()
      .then(permissions => {
        const granted = some(permissions.origins, origin => {
          // origin => https://*.site.tld/*, host => site.tld
          return origin.includes(host)
        })
        setStatus(granted === true ? 'GRANTED' : 'NOT_GRANTED')
      })
      .catch(() => {
        setStatus('NOT_GRANTED')
      })
  }, [host, setStatus])

  const grantPermission = useCallback(() => {
    setStatus('CHECKING')
    requestPermissions(host)
      .then(granted => {
        setStatus(granted === true ? 'GRANTED' : 'NOT_GRANTED')
      })
      .catch(e => {
        console.log('porumai ... not granted ? ', e)
        setStatus('NOT_GRANTED')
      })
  }, [host, setStatus])

  if (status === 'GRANTED') {
    return (
      <Chip
        color="success"
        icon={<Done />}
        label={`${host} granted tab permissions. Click to refresh status.`}
        onClick={() => {
          grantPermission()
        }}
      />
    )
  }

  if (status === 'NOT_GRANTED') {
    return (
      <Chip
        color="error"
        icon={<ErrorOutline />}
        label={`${host} not granted tab permissions. Click to grant permission.`}
        onClick={() => {
          grantPermission()
        }}
      />
    )
  }

  return (
    <Chip
      color="default"
      icon={<HourglassBottom />}
      label={`Checking tab permissions for ${host}.`}
    />
  )
}

export default HostPermissionStatus
