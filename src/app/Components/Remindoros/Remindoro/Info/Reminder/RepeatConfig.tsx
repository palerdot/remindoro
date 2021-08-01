import React, { useState } from 'react'
import {
  Typography,
  Slider,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core'

import type { Repeat } from '@app/Store/Slices/Remindoros/'

type Props = {
  disabled: boolean
  duration: Repeat['time'] | undefined
  interval: Repeat['interval'] | undefined

  onRepeatDurationChange: (duration: Repeat['time']) => void
  onRepeatIntervalChange: (interval: Repeat['interval']) => void
}

function RepeatConfig({
  disabled,
  duration,
  interval,

  onRepeatDurationChange,
  onRepeatIntervalChange,
}: Props) {
  // we are tracking a local state to show better interval text - minute, minutes
  const [localSliderValue, setLocalSliderValue] = useState<number>(
    duration || 45
  )

  return (
    <div className={'second-col'}>
      <div className={'duration-slider'}>
        <Typography id="duration-slider" gutterBottom>
          {'Repeat every'}
        </Typography>
        <Slider
          disabled={disabled}
          defaultValue={localSliderValue}
          aria-labelledby="duration-slider"
          step={1}
          min={1}
          max={60}
          valueLabelDisplay={disabled ? 'off' : 'on'}
          onChange={(_, value) => {
            setLocalSliderValue(value as number)
          }}
          onChangeCommitted={(_, value) => {
            console.log(
              'porumai ... slider value changed ... amaidhi !!!',
              value
            )
            onRepeatDurationChange(value as number)
          }}
        />
      </div>
      <div className={'interval-select'}>
        <FormControl className={'select-form'}>
          <Select
            displayEmpty
            disabled={disabled}
            id="repeat-interval"
            value={interval || 'minutes'}
            onChange={event => {
              const value: Repeat['interval'] = event.target
                .value as Repeat['interval']
              console.log('porumai ... duration changed ', value)
              onRepeatIntervalChange(value)
            }}
          >
            <MenuItem value={'minutes'}>
              {localSliderValue === 1 ? 'Minute' : 'Minutes'}
            </MenuItem>
            <MenuItem value={'hours'}>
              {localSliderValue === 1 ? 'Hour' : 'Hours'}
            </MenuItem>
            <MenuItem value={'days'}>
              {localSliderValue === 1 ? 'Day' : 'Days'}
            </MenuItem>
            <MenuItem value={'months'}>
              {localSliderValue === 1 ? 'Month' : 'Months'}
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  )
}

export default RepeatConfig
