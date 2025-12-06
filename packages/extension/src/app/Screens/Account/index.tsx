import { useSelector, useDispatch } from 'react-redux'
import styled from '@emotion/styled'
import { Paper, Button } from '@mui/material'

import type { RootState } from '@app/Store/'
import Login from './Login'
import packageInfo from '@package-info'
import { logoutUser } from '@app/Store/Slices/Account'
const { version } = packageInfo

const BottomHolder = styled.div`
  margin-top: auto;
  padding: 4px;

  display: flex;
  justify-content: space-between;

  font-style: italic;
  font-size: 0.75rem;

  color: ${props => props.theme.palette.secondary.main};
`

const Holder = styled.div`
  text-align: center;

  padding: 4px 16px;
  background: ${props => props.theme.palette.background.paper};

  & .help-info {
    font-size: 0.89rem;
    font-style: italic;

    margin: 8px auto;
    padding: 8px;
    border-radius: 5px;

    border: ${props => `thin solid ${props.theme.palette.divider}`};
    background: ${props => props.theme.palette.background.paper};
    color: ${props => props.theme.palette.text.primary};

    text-align: left;
  }

  & button {
    width: fit-content;
    margin: auto;
  }
`

function Account() {
  const dispatch = useDispatch()
  const account = useSelector((state: RootState) => state.account)
  const { extension_id, info } = account

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
          {info ? (
            <div>
              <div>
                {`porumai ... will show user info - ${info.user.email}, ${info.extension.pairing.extension_key} ${info.extension.pairing.extension_id}`}
              </div>
              <Button
                variant="outlined"
                onClick={() => {
                  dispatch(logoutUser())
                }}
              >
                {'Logout'}
              </Button>
            </div>
          ) : (
            <Login />
          )}
          <div className="help-info">
            {
              'Features like email reminders, folder syncing, tracking more than one site are in private beta. Please reach out arun@remindoro.app or sign up in the time tracker screen if you would like to part of private beta.'
            }
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
