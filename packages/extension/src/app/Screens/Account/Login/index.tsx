import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isNil } from '@lodash'
import { Stack, TextField, Button } from '@mui/material'
import { Badge as BadgeIcon } from '@mui/icons-material'

import type { RootState } from '@app/Store/'
import { loginUser } from './helpers'
import { STUB_EID, generateExtensionId } from '@app/Store/Slices/Account'

type Props = {
  extensionId: string
}

function Login({ extensionId }: Props) {
  const [email, setEmail] = useState('')
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | undefined>()

  // login the user, update last_server_sync_time, and if success set 'account.info', if not reset 'account.info'
  const performLogin = useCallback(async () => {}, [email, key, extensionId])

  return (
    <Stack
      direction={'column'}
      spacing={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: props => props.palette.background.paper,
      }}
    >
      <Stack
        direction={'row'}
        spacing={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '8px',
        }}
      >
        <div
          style={{
            fontWeight: '600',
          }}
        >
          {'Account'}
        </div>
      </Stack>
      <TextField
        sx={{
          width: '100%',
        }}
        error={!!error}
        id="private-beta-email"
        label={error ? 'Email not registered' : 'Your private beta email'}
        defaultValue={''}
        helperText={
          error
            ? 'Email not registered for private beta'
            : 'Your registered private beta email'
        }
        onChange={_e => {
          setError('')
        }}
      />
      <TextField
        sx={{
          width: '100%',
        }}
        error={!!error}
        id="private-beta-eid"
        label={error || 'Registered extension key'}
        defaultValue={''}
        helperText={error || 'e.g. your-private-beta-extension-key'}
        onChange={_e => {
          setError(undefined)
        }}
      />
      <Button
        variant="contained"
        startIcon={<BadgeIcon fontSize="medium" />}
        onClick={() => {
          setError('Invalid extension key.')
        }}
      >
        {'Login'}
      </Button>
    </Stack>
  )
}

// NOTE: we have stub extension id generated for few firefox extensions; generating actual extension id in such cases
function Wrapper() {
  const dispatch = useDispatch()
  const extension_id = useSelector(
    (state: RootState) => state.account.extension_id
  )

  if (isNil(extension_id) || extension_id === STUB_EID) {
    return (
      <Button
        variant="contained"
        startIcon={<BadgeIcon fontSize="medium" />}
        onClick={() => {
          dispatch(generateExtensionId())
        }}
      >
        {'Click to login and pair extension'}
      </Button>
    )
  }

  return <Login extensionId={extension_id} />
}

export default Wrapper
