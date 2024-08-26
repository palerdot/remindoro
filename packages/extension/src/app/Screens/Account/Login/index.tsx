import React, { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isNil, isEmpty } from '@lodash'
import { Stack, TextField, Button } from '@mui/material'
import { Badge as BadgeIcon } from '@mui/icons-material'
import { useSnackbar } from 'notistack'

import type { RootState } from '@app/Store/'
import { loginUser } from './helpers'
import {
  STUB_EID,
  generateExtensionId,
  setAccountInfo,
} from '@app/Store/Slices/Account'

type Props = {
  extensionId: string
}

function Login({ extensionId }: Props) {
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail] = useState('')
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const showErrorMessage = useCallback(
    (message: string) => {
      enqueueSnackbar(message || 'Please try again', {
        variant: 'error',
      })
      setError(message)
    },
    [enqueueSnackbar]
  )

  // login the user, update last_server_sync_time, and if success set 'account.info', if not reset 'account.info'
  const performLogin = useCallback(async () => {
    if (isEmpty(email)) {
      setError('Email cannot be empty')

      return
    }

    if (isEmpty(key)) {
      setError('Extension key cannot be empty')

      return
    }

    setSubmitting(true)
    const { success, error, data } = await loginUser({
      email,
      extension_id: extensionId,
      extension_key: key,
    })
    setSubmitting(false)

    // TODO: if rate limited show appropriate messages
    // if error, show error message
    if (success === false || !data) {
      showErrorMessage(error || 'Error logging you. Please contact admin.')
      return
    }

    // set account info from server
    dispatch(
      setAccountInfo({
        info: data,
      })
    )
    // TODO: show success message
  }, [email, key, extensionId, showErrorMessage, dispatch])

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
        onChange={e => {
          setEmail(e.target.value)
          setError(undefined)
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
        onChange={e => {
          setKey(e.target.value)
          setError(undefined)
        }}
      />
      <Button
        variant="contained"
        startIcon={<BadgeIcon fontSize="medium" />}
        onClick={() => {
          performLogin()
        }}
        disabled={submitting}
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
