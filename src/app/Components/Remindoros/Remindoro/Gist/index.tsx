import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Card as MCard } from '@mui/material'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { getRemindoroUrl } from '@app/Util/'
import ScheduleInfo from '@app/Components/Remindoros/Remindoro/ScheduleInfo'
import LiveNote from '@app/Components/LiveNote/'

const Holder = styled.div`
  margin: 16px;

  cursor: pointer;
  border: ${props => `thin solid ${props.theme.borderDark}`};
  box-shadow: ${props =>
    `0 1px 3px ${props.theme.border}, 0 1px 2px 0 ${props.theme.borderDark}`};
  // background: ${props => props.theme.backgroundLight};
  background: ${props => props.theme.borderDark};

  &:hover {
    border: ${props => `thin solid ${props.theme.primaryLight}`};
  }

  & .title-holder {
    padding: 8px;
    font-size: 18px;

    border-bottom: ${props => `thin solid ${props.theme.borderDark}`};
  }

  & .note-holder {
    padding: 8px;
    max-height: 123px;
    pointer-events: none;
    overflow-y: auto;
  }
`

function Card(remindoro: Remindoro) {
  const history = useHistory()

  const { id, title, note, reminder } = remindoro
  const url = getRemindoroUrl(id)

  return (
    <MCard
      onClick={() => {
        history.push(url)
      }}
      raised={true}
      sx={{
        background: theme => theme.colors.background,
      }}
    >
      <Holder>
        <ScheduleInfo reminder={reminder} />
        {title && <div className={'title-holder'}>{title}</div>}
        <div className={'note-holder'}>
          <LiveNote id={id} note={note} readOnly={true} />
        </div>
      </Holder>
    </MCard>
  )
}

export default Card
