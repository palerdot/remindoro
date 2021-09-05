import React from 'react'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Fab, Zoom } from '@mui/material/'
import { Settings as SettingsIcon } from '@mui/icons-material'

import type { ThemeInterface } from '@app/Util/colors'

import { useTheme } from '@app/Hooks/'

type Props = {
  onClick: () => void
}

const useStyles = makeStyles(theme =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(0.5),
      right: theme.spacing(0.5),

      margin: theme.spacing(1),

      background: (props: { theme: ThemeInterface }) =>
        props.theme.primaryLight,
      color: 'white',

      '&:hover': {
        background: (props: { theme: ThemeInterface }) => props.theme.highlight,
      },
    },
  })
)

function Edit({ onClick }: Props) {
  const theme = useTheme()
  const classes = useStyles({ theme })

  return (
    <Zoom
      in={true}
      timeout={314}
      style={{
        transitionDelay: `314ms`,
      }}
      unmountOnExit
    >
      <Fab
        // size="medium"
        // color="secondary"
        aria-label="edit"
        className={classes.fab}
        onClick={() => {
          onClick()
        }}
      >
        <SettingsIcon fontSize={'large'} />
      </Fab>
    </Zoom>
  )
}

export default Edit
