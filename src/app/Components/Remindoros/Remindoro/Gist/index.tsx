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
  border: thin solid grey;

  &:hover {
    border: thin solid blue;
  }

  & .note-holder {
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
      <div>{title}</div>
      <div className={'note-holder'}>
        <LiveNote id={id} note={note} readOnly={true} />
      </div>
    </Holder>
  )
}

export default Card
