import React, { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { DateTimePicker } from '@material-ui/pickers'
import { InputAdornment, IconButton, createMuiTheme } from '@material-ui/core'
import { AddAlarm } from '@material-ui/icons'
import lightBlue from '@material-ui/core/colors/lightBlue'
import { ThemeProvider } from '@material-ui/styles'

import type { ThemeInterface } from '@app/Util/colors'
import type { Remindoro, Repeat } from '@app/Store/Slices/Remindoros/'

import { useTheme } from '@app/Hooks/'
import Switch from '@app/Components/Switch'
import { useLazyStoreUpdate } from '@app/Hooks/'
import { updateReminder } from '@app/Store/Slices/Remindoros/'
import {
  handleReminderChange,
  handleRepeatChange,
  handleRepeatDurationChange,
  handleRepeatIntervalChange,
} from './utils'
import RepeatConfig from './RepeatConfig'

const datePickerTheme = (theme: ThemeInterface) =>
  createMuiTheme({
    overrides: {
      MuiPickersToolbar: {
        toolbar: {
          // backgroundColor: lightBlue.A200,
          backgroundColor: theme.backgroundLight,
        },
      },
      MuiPickersCalendarHeader: {
        switchHeader: {
          // backgroundColor: lightBlue.A200,
          // color: "white",
        },
      },
      MuiPickersDay: {
        day: {
          color: lightBlue.A700,
        },
        daySelected: {
          backgroundColor: lightBlue['400'],
        },
        dayDisabled: {
          color: lightBlue['100'],
        },
        current: {
          color: lightBlue['900'],
        },
      },
      MuiPickersModal: {
        dialogAction: {
          color: lightBlue['400'],
        },
      },
    },
  })

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
  const theme = useTheme()

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
          <ThemeProvider theme={datePickerTheme(theme)}>
            <DateTimePicker
              disabled={!isScheduled}
              className={`date-picker ${!isScheduled ? 'disabled' : ''}`}
              variant="inline"
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
          </ThemeProvider>
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
