import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { Stack, TextField, Button, Paper } from '@mui/material'
import { SupervisorAccount } from '@mui/icons-material'

import { isValidEmail } from '@app/Util/'
import { postData } from '@app/Util/config'

const Holder = styled.div`
  text-align: center;

  padding: 4px 16px;
  background: ${props => props.theme.border};

  & .help-info {
    font-size: 0.89rem;
    font-style: italic;

    margin: 8px auto;
    padding: 8px;
    border-radius: 5px;

    border: ${props => `thin solid ${props.theme.primaryDark}`};
    background: ${props => props.theme.background};
    color: ${props => props.theme.textColor};

    text-align: left;
  }

  & button {
    width: fit-content;
    margin: auto;
  }
`

type Props = {
  onSuccess: (email: string) => void
  onError: (message: string) => void
}

function Email({ onSuccess, onError }: Props) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const saveEmail = useCallback(() => {
    const isValid = isValidEmail(email)

    if (!isValid) {
      setError('Please enter a valid email.')
      // abort
      return
    }

    const payload = {
      feedback: `${email}: PRIVATE BETA TIME TRACKER`,
      source: 'PRIVATE_BETA',
    }

    setSaving(true)
    postData(`/public_api/send_feedback`, payload)
      .then(res => {
        // decide if request is success
        if (res.ok) {
          setEmail('')
          onSuccess(email)
          // do not proceed
          return
        }
        // we have to deal with some error
        if (res.status === 429) {
          onError('Please try again after some time')
          return
        }

        // some error
        onError('Problem with server. Please try again.')
      })
      .catch(_err => {
        // network error mostly
        onError('Please check your network connection and try again')
      })
      .finally(() => {
        // enable button
        setSaving(false)
      })
  }, [email, setEmail, setError, setSaving, onSuccess, onError])

  return (
    <Paper elevation={2}>
      <Holder>
        <Stack
          direction={'column'}
          spacing={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontWeight: '600',
            }}
          >
            {'Private Beta'}
          </div>
          <TextField
            sx={{
              width: '100%',
            }}
            disabled={saving}
            error={error.length > 0}
            id="private-beta-email"
            label={error.length > 0 ? error : 'Your email address'}
            value={email}
            helperText={error.length > 0 ? error : 'e.g. hello@gmail.com'}
            onChange={e => {
              setEmail(e.target.value)
              setError('')
            }}
          />
          <Button
            variant="contained"
            startIcon={<SupervisorAccount fontSize="medium" />}
            onClick={() => {
              saveEmail()
            }}
          >
            {"I'm interested."}
          </Button>
        </Stack>
        <div className="help-info">
          {`Features like detailed statistics, historical comparison, family controls on multiple extensions and tracking more than one site is currently available for select people as private beta. Sign up if you are interested. You can also reach out via 'arun@remindoro.app' if you have specific feature requests or want to get ahead of the private beta queue.`}
        </div>
      </Holder>
    </Paper>
  )
}

export default Email
