import React from 'react'
import DateTimePicker, {
  MobileDateTimePickerProps,
} from '@mui/lab/MobileDateTimePicker'
import { InputAdornment, IconButton, TextField } from '@mui/material'
import { AddAlarm } from '@mui/icons-material'
import { Dayjs } from 'dayjs'

import { classNames } from '@app/Constants'

type PickerProps = MobileDateTimePickerProps<Dayjs>

interface Props {
  disabled: PickerProps['disabled']
  onChange: PickerProps['onChange']
  className: string
  label: string
  value: PickerProps['value']
}

function DatePicker(props: Props) {
  return (
    <DateTimePicker
      {...props}
      renderInput={params => (
        <TextField
          {...params}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={event => {
                    if (params.inputProps?.onClick) {
                      params.inputProps?.onClick(
                        event as React.MouseEvent<HTMLInputElement>
                      )
                    }
                  }}
                >
                  <AddAlarm />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          className={`${classNames.datepickerInput}`}
        />
      )}
      ampm={true}
      ampmInClock={true}
      showToolbar={true}
    />
  )
}

export default DatePicker