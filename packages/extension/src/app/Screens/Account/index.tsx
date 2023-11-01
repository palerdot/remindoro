import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Stack, TextField, Button, Paper } from '@mui/material'
import { Badge as BadgeIcon } from '@mui/icons-material'

import packageInfo from '@package-info'
const { version } = packageInfo

const VersionInfo = styled.div`
  font-style: italic;
  font-size: 0.75rem;

  position: absolute;
  bottom: 1px;
  right: 1px;
  margin: 4px;

  color: ${props => props.theme.highlight};
`

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

function Account() {
  const [error, setError] = useState('')
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
      }}
    >
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
              label={error.length > 0 ? error : 'Registered extension key'}
              defaultValue={''}
              helperText={
                error.length > 0
                  ? error
                  : 'e.g. your-private-beta-extension-key'
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
          <div className="help-info">
            {`Features like detailed statistics, tracking more than one site are in private beta. Please reach out arun@remindoro.app or sign up in the time tracker screen if you would like to part of private beta.`}
          </div>
        </Holder>
      </Paper>
      <VersionInfo>{`v${version} (beta)`}</VersionInfo>
    </div>
  )
}

export default Account
