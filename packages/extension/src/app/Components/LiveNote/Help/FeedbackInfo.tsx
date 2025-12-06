import React from 'react'
import { Paper } from '@mui/material'

function Feedback() {
  return (
    <Paper
      sx={{
        background: theme => theme.palette.primary.main,
        color: theme => theme.palette.text.primary,
        padding: theme => theme.spacing(2),

        '& .highlight': {
          color: theme => theme.palette.secondary.main,
          fontWeight: '700',
        },
      }}
    >
      {'If you face any problems using '}
      <span className={'highlight'}>{'Rich Text Editor (beta)'}</span>{' '}
      {', please let me know via '}
      <strong className={'highlight'}>{'arun@remindoro.app'}</strong>
    </Paper>
  )
}

export default Feedback
