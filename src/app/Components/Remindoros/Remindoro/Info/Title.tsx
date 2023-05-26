import React from 'react'
import { isEqual } from '@lodash'
import { TextField, TextFieldProps } from '@mui/material'
import { styled } from '@mui/material/styles'

import { updateTitle } from '@app/Store/Slices/Remindoros'
import { useLazyStoreUpdate } from '@app/Hooks/'

type Props = {
  id: string
  title: string
}

const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiFilledInput-root': {
    '&:hover:not(.Mui-disabled)::before': {
      borderBottom: `thin solid ${theme.palette.primary.main}`,
    },
    background: `${theme.palette.background.paper}`,
  },
}))

function Title({ id, title }: Props) {
  const { value, setValue } = useLazyStoreUpdate<string>({
    id,
    payload: title,
    updater: updateTitle,
  })

  return (
    <StyledTextField
      variant={'filled'}
      // focused
      color={'primary'}
      fullWidth
      type="text"
      placeholder={'Add Title'}
      value={value}
      onChange={e => {
        setValue(currentTitle => {
          const updatedTitle = e.target.value
          return isEqual(currentTitle, updatedTitle)
            ? currentTitle
            : updatedTitle
        })
      }}
    />
  )
}

export default Title
