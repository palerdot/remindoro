import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { isEmpty } from '@lodash'
import { Stack, TextField, Button } from '@mui/material'
import { Badge as BadgeIcon } from '@mui/icons-material'

import type { RootState } from '@app/Store/'

import { STUB_EID, generateExtensionId } from '@app/Store/Slices/Account'

function Login() {
  const [error, setError] = useState('')

  return (
    <Stack
      direction={'column'}
      spacing={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
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
        <div
          style={{
            fontWeight: '500',
          }}
        >
          {'- Not registered for private beta.'}
        </div>
      </Stack>
      <TextField
        sx={{
          width: '100%',
        }}
        error={error.length > 0}
        id="private-beta-email"
        label={
          error.length > 0 ? 'Email not registered' : 'Your private beta email'
        }
        defaultValue={''}
        helperText={
          error.length > 0
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
        error={error.length > 0}
        id="private-beta-eid"
        label={error.length > 0 ? error : 'Registered extension key'}
        defaultValue={''}
        helperText={
          error.length > 0 ? error : 'e.g. your-private-beta-extension-key'
        }
        onChange={_e => {
          setError('')
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

  if (isEmpty(extension_id) || extension_id === STUB_EID) {
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

  return <Login />
}

export default Wrapper
