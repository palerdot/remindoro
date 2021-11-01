import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'

import type { Remindoro, Repeat } from '@app/Store/Slices/Remindoros/'

import Switch from '@app/Components/Switch'
import { useLazyStoreUpdate } from '@app/Hooks/'
import { updateReminder } from '@app/Store/Slices/Remindoros/'
import {
  handleReminderChange,
  handleRepeatChange,
  handleRepeatDurationChange,
  handleRepeatIntervalChange,
} from './utils'
import DateTimePicker from './DatePicker'
import RepeatConfig from './RepeatConfig'

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
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: 16px;
`

const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;

  & .first-col {
    display: flex;
    flex: 1;
  }

  & .second-col {
    display: flex;
    flex: 3;
    margin: 0 32px;

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

    & .duration-slider {
      display: flex;
      flex: 2;
      flex-direction: column;
    }

    & .interval-select {
      display: flex;
      flex: 1;
      align-items: center;

      & .select-form {
        margin-left: auto;
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

  const onRepeatDurationChange = useCallback(
    (duration: Repeat['time']) => {
      setValue(currentReminder => {
        return handleRepeatDurationChange(duration, currentReminder)
      })
    },
    [setValue]
  )

  const onRepeatIntervalChange = useCallback(
    (interval: Repeat['interval']) => {
      setValue(currentReminder => {
        return handleRepeatIntervalChange(interval, currentReminder)
      })
    },
    [setValue]
  )

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
            className={`reminder-datepicker ${!isScheduled ? 'disabled' : ''}`}
            label="Reminder time"
            value={value?.time ? new Date(value.time) : new Date()}
            onChange={date => {
              const reminderTime = date?.valueOf() as number

              setValue(currentReminder => {
                return {
                  ...currentReminder,
                  time: reminderTime,
                }
              })
            }}
          />
        </div>
      </Row>
      <Row>
        {/* Turn on/off Repeat */}
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
        <RepeatConfig
          disabled={!isRepeat}
          duration={value?.repeat?.time}
          interval={value?.repeat?.interval}
          onRepeatDurationChange={onRepeatDurationChange}
          onRepeatIntervalChange={onRepeatIntervalChange}
        />
      </Row>
    </Holder>
  )
}

export default Reminder
