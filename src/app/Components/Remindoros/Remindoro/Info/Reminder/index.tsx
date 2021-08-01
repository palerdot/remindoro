import React from 'react'
import styled, { css } from 'styled-components'
import { DateTimePicker } from '@material-ui/pickers'
import {
  InputAdornment,
  IconButton,
  Slider,
  Typography,
  Select,
  FormControl,
  MenuItem,
} from '@material-ui/core'
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
        <div className={'second-col'}>
          <div className={'duration-slider'}>
            <Typography id="duration-slider" gutterBottom>
              {'Repeat every'}
            </Typography>
            <Slider
              defaultValue={45}
              aria-labelledby="duration-slider"
              step={1}
              min={1}
              max={60}
              valueLabelDisplay="on"
              onChangeCommitted={(_, value) => {
                console.log(
                  'porumai ... slider value changed ... amaidhi !!!',
                  value
                )
              }}
            />
          </div>
          <div className={'interval-select'}>
            <FormControl className={'select-form'}>
              <Select
                displayEmpty
                id="repeat-interval"
                value={'minutes'}
                onChange={event => {
                  const value = event.target.value
                  console.log('porumai ... duration changed ', value)
                }}
              >
                <MenuItem value={'minutes'}>{'Minutes'}</MenuItem>
                <MenuItem value={'hours'}>{'Hours'}</MenuItem>
                <MenuItem value={'days'}>{'Days'}</MenuItem>
                <MenuItem value={'months'}>{'Months'}</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </Row>
    </Holder>
  )
}

export default Reminder
