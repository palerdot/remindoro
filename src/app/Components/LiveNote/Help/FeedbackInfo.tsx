import React from 'react'
import { Paper } from '@mui/material'

function Feedback() {
  return (
    <Paper
      sx={{
        background: theme => theme.colors.primaryLight,
        color: theme => theme.colors.textColor,
        padding: theme => theme.spacing(2),

        '& .highlight': {
          color: theme => theme.colors.textColor,
          fontWeight: '700',
        },
      }}
    >
      {'If you face any problems using '}
      <span className={'highlight'}>{'Rich Text Editor (beta)'}</span>{' '}
      {', please let me know via '}
      <strong className={'highlight'}>{'palerdot@gmail.com'}</strong>
    </Paper>
  )
}

export default Feedback
