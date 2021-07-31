import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Fab, Zoom } from '@material-ui/core/'
import { Settings as SettingsIcon } from '@material-ui/icons'

type Props = {
  onClick: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(0.5),
      right: theme.spacing(0.5),

      margin: theme.spacing(1),

      background: 'yellow',

      '&:hover': {
        background: 'gold',
      },
    },
  })
)

function Edit({ onClick }: Props) {
  const classes = useStyles()

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
