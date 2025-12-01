import type React from 'react'
import { forwardRef } from 'react'
import {
  MobileDateTimePicker as DateTimePicker,
  type MobileDateTimePickerProps,
} from '@mui/x-date-pickers/MobileDateTimePicker'
import { InputAdornment, IconButton } from '@mui/material'
import {
  PickersTextField,
  type PickersTextFieldProps,
} from '@mui/x-date-pickers/PickersTextField'
import { AddAlarm } from '@mui/icons-material'
import dayjs, { type Dayjs } from 'dayjs'
import { usePickerContext } from '@mui/x-date-pickers/hooks'

import { classNames } from '@app/Constants'
import { TimeClock } from '@mui/x-date-pickers/TimeClock'

type PickerProps = MobileDateTimePickerProps<Dayjs>

interface Props {
  disabled: PickerProps['disabled']
  onChange: PickerProps['onChange']
  className: string
  label: string
  value: PickerProps['value']
}

// ref: https://mui.com/x/react-date-pickers/custom-field/#using-a-custom-input
const MyPickersTextField = forwardRef(
  (params: PickersTextFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const pickerContext = usePickerContext()

    return (
      // <PickersTextField {...props} ref={ref} size="small" />
      <PickersTextField
        ref={ref}
        {...params}
        onClick={() => pickerContext.setOpen(prev => !prev)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {!params.disabled && (
                <IconButton
                  onClick={() => pickerContext.setOpen(prev => !prev)}
                >
                  <AddAlarm />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        fullWidth
        className={`${classNames.datepickerInput}`}
      />
    )
  }
)

function DatePicker(props: Props) {
  return (
    <DateTimePicker
      {...props}
      viewRenderers={{
        hours: params => <TimeClock {...params} />,
        minutes: params => <TimeClock {...params} />,
      }}
      slots={{
        textField: MyPickersTextField,

        // textField: params => (
        //   <TextField
        //     {...params}
        //     InputProps={{
        //       endAdornment: (
        //         <InputAdornment position="end">
        //           {!props.disabled && (
        //             <IconButton
        //               onClick={event => {
        //                 if (params.inputProps?.onClick) {
        //                   params.inputProps?.onClick(
        //                     event as React.MouseEvent<HTMLInputElement>
        //                   )
        //                 }
        //               }}
        //             >
        //               <AddAlarm />
        //             </IconButton>
        //           )}
        //         </InputAdornment>
        //       ),
        //     }}
        //     fullWidth
        //     className={`${classNames.datepickerInput}`}
        //   />
        // ),
      }}
      ampm={true}
      ampmInClock={true}
      // showToolbar={true}
      minDateTime={dayjs()}
    />
  )
}

export default DatePicker
