import React from 'react'
import styled, { css } from 'styled-components'
import { DateTimePicker } from '@material-ui/pickers'
import { InputAdornment, IconButton } from '@material-ui/core'
import { AddAlarm } from '@material-ui/icons'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

import Switch from '@app/Components/Switch'
import { useLazyStoreUpdate } from '@app/Hooks/'
import { updateReminder } from '@app/Store/Slices/Remindoros/'
import { handleReminderChange, handleRepeatChange } from './utils'

const colStyles = css`
  display: flex;
  flex: 1;

  align-self: flex-end;
`

type Reminder = Remindoro['reminder']

type Props = {
  id: string
  reminder: Reminder
}

const Holder = styled.div`
  padding: 16px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & .first-col {
    display: flex;
    flex: 1;
  }

  & .second-col {
    display: flex;
    flex: 3;

    & .date-picker {
      ${colStyles};
      cursor: pointer;

      & input {
        cursor: pointer;
      }

      &.disabled {
        cursor: text;

        & input,
        button {
          cursor: text;
        }
      }
    }
  }
`

function Reminder({ id, reminder }: Props) {
  const { value, setValue } = useLazyStoreUpdate({
    id,
    payload: reminder,
    updater: updateReminder,
  })

  // inferred state
  const isScheduled = !!value
  const isRepeat = !!value?.repeat

  return (
    <Holder>
      <Row>
        {/* Turn on/off reminder */}
        <div className={'first-col'}>
          <Switch
            checked={isScheduled}
            setChecked={scheduleOn => {
              // schedule turned on/off
              setValue(currentSchedule => {
                const newSchedule = handleReminderChange(
                  scheduleOn,
                  currentSchedule
                )

                return newSchedule
              })
            }}
            ariaLabel={'Set Reminder'}
          />
        </div>
        {/* Reminder time */}
        <div className={'second-col'}>
          <DateTimePicker
            disabled={!isScheduled}
            className={`date-picker ${!isScheduled ? 'disabled' : ''}`}
            variant="inline"
            label="Reminder time"
            value={value?.time ? new Date(value.time) : new Date()}
            onChange={date => {
              console.log('porumai ... date changed ...', date)
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <AddAlarm />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Row>
      <Row>
        {/* Turn on/off Repat */}
        <div className={'first-col'}>
          <Switch
            checked={isRepeat}
            setChecked={repeatOn => {
              // repeat turned on/off
              setValue(currentSchedule => {
                const newSchedule = handleRepeatChange(
                  repeatOn,
                  currentSchedule
                )

                return newSchedule
              })
            }}
            ariaLabel={'Set Repeat'}
          />
        </div>
        {/* Repeat parameters */}
        <div className={'second-col'}></div>
      </Row>
    </Holder>
  )
}

export default Reminder
