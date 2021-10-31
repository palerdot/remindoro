import React from 'react'
import { Paper } from '@mui/material'
import { yellow, blueGrey, deepOrange } from '@mui/material/colors'

function Feedback() {
  return (
    <Paper
      sx={{
        background: yellow[100],
        color: blueGrey[900],
        padding: theme => theme.spacing(2),

        '& .highlight': {
          color: deepOrange[800],
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
