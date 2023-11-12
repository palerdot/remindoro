import React from 'react'
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { Paper } from '@mui/material'

import type { RootState } from '@app/Store/'

import Login from './Login'
import packageInfo from '@package-info'
const { version } = packageInfo

const BottomHolder = styled.div`
  margin-top: auto;
  padding: 4px;

  display: flex;
  justify-content: space-between;

  font-style: italic;
  font-size: 0.75rem;

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
  const extension_id = useSelector(
    (state: RootState) => state.account.extension_id
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Paper elevation={2}>
        <Holder className="my-2">
          <Login />
          <div className="help-info">
            {`Features like detailed statistics, tracking more than one site are in private beta. Please reach out arun@remindoro.app or sign up in the time tracker screen if you would like to part of private beta.`}
          </div>
        </Holder>
      </Paper>
      <BottomHolder>
        <div>{extension_id}</div>
        <div>{`v${version} (beta)`}</div>
      </BottomHolder>
    </div>
  )
}

export default Account
