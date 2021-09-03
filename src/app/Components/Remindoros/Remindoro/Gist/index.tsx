import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import { getRemindoroUrl } from '@app/Util/'
import ScheduleInfo from '@app/Components/Remindoros/Remindoro/ScheduleInfo'
import LiveNote from '@app/Components/LiveNote/'

const Holder = styled.div`
  margin: 16px;

  cursor: pointer;
  border: ${props => `thin solid ${props.theme.primaryDark}`};
  background: ${props => props.theme.backgroundLight};

  &:hover {
    border: ${props => `thin solid ${props.theme.highlight}`};
  }

  & .title-holder {
    padding: 4px;
    background: ${props => props.theme.backgroundLight};
    border-bottom: ${props => `thin solid ${props.theme.primaryDark}`};
  }

  & .note-holder {
    padding: 4px;
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
    <Holder
      onClick={() => {
        history.push(url)
      }}
    >
      <ScheduleInfo reminder={reminder} />
      {title && <div className={'title-holder'}>{title}</div>}
      <div className={'note-holder'}>
        <LiveNote id={id} note={note} readOnly={true} />
      </div>
    </Holder>
  )
}

export default Card
