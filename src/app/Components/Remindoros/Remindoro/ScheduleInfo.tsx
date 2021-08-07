import React from 'react'
import styled from 'styled-components'
import { Repeat as RepeatIcon } from '@material-ui/icons'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Timeago from '@app/Components/Timeago'

const Holder = styled.div`
  display: flex;
  align-items: center;
  height: 30px;

  border: thin solid yellow;

  & .time-holder {
    display: flex;
  }
`

type Reminder = Remindoro['reminder']

type Props = {
  reminder: Reminder
}

function ScheduleInfo({ reminder }: Props) {
  if (!reminder) {
    return null
  }

  return (
    <Holder>
      <div className={'time-holder'}>
        <Timeago timestamp={reminder.time} />
        {reminder.repeat && <RepeatIcon />}
      </div>
    </Holder>
  )
}

export default ScheduleInfo
