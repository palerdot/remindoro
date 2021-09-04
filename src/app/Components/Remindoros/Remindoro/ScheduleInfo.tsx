import React from 'react'
import styled from 'styled-components'
import { Repeat as RepeatIcon, Alarm as AlarmIcon } from '@material-ui/icons'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Timeago from '@app/Components/Timeago'

const Holder = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  width: 175px;

  border: ${props => `thin solid ${props.theme.highlight}`};
  background: ${props => props.theme.background};

  & .time-holder {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 4px;

    & .time-info {
      display: flex;
      align-items: center;

      & svg {
        fill: ${props => props.theme.highlight};
      }

      & .time-ago {
        margin-left: 6px;
        font-size: 15px;
        font-style: italic;
      }
    }

    & svg {
      font-size: 1.314rem;
    }

    & .icon-holder {
      display: flex;
      margin-left: auto;

      & svg {
        fill: ${props => props.theme.success};
      }
    }
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
    <Holder className={'schedule-info'}>
      <div className={'time-holder'}>
        <div className={'time-info'}>
          <AlarmIcon />
          <Timeago timestamp={reminder.time} />
        </div>

        {reminder.repeat && (
          <div className={'icon-holder'}>
            <RepeatIcon />
          </div>
        )}
      </div>
    </Holder>
  )
}

export default ScheduleInfo
