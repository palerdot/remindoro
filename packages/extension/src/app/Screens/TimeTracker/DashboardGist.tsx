import React from 'react'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import { PendingActions as PendingActionsIcon } from '@mui/icons-material'

import CardHolder from '@app/Components/CardHolder'
import { Screens } from '@app/Util/Enums'

export const Holder = styled.div`
  & .title-holder {
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 4px;

    & .title {
      font-size: 1.25rem;
      font-weight: 500;
      margin: auto 8px;
    }

    & .beta {
      font-size: 0.75rem;
      font-style: italic;
    }
  }

  & .help-info {
    font-size: 0.89rem;
    font-style: italic;

    margin: 8px;
    padding: 8px;
    border-radius: 5px;

    border: ${props => `thin solid ${props.theme.primaryDark}`};
    background: ${props => props.theme.background};
    color: ${props => props.theme.textColor};
  }

  & .content {
    padding: 8px;
  }

  & .subtitle {
    font-size: 0.75rem;
    font-style: italic;

    padding-bottom: 16px;
    margin-bottom: 8px;

    display: flex;
    justify-content: center;
  }
`

function Gist() {
  const history = useHistory()

  return (
    <CardHolder
      onClick={() => {
        history.push(Screens.TimeTracker)
      }}
    >
      <Holder>
        <div className="title-holder">
          <PendingActionsIcon fontSize="medium" />
          <div className="title">{'Browsing Time Tracker'}</div>
          <div className="beta">{'BETA'}</div>
        </div>
        <div className="content">{'porumai ... time tracker'}</div>
        <div className="help-info">
          {
            'Time Tracker helps you to track time spent on websites like social media. This helps you to have a healthy digital habits. More features like detailed statistics and tracking more than one site is currently in private beta.'
          }
        </div>
        <div className="subtitle">
          {'Click on the card to go to Time Tracker screen.'}
        </div>
      </Holder>
    </CardHolder>
  )
}

export default Gist
