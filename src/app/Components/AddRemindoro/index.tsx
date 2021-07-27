import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Fab, Zoom } from '@material-ui/core/'
import { PlaylistAdd, PostAdd } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(0.5),
      right: theme.spacing(0.5),

      margin: theme.spacing(1),
    },
  })
)

function AddRemindoro() {
  const classes = useStyles()

  return (
    <Zoom
      in={true}
      timeout={314}
      style={{
        transitionDelay: `314ms`,
      }}
    >
      <Fab
        // size="medium"
        color="secondary"
        aria-label="add"
        className={classes.fab}
      >
        <PlaylistAdd fontSize={'large'} />
      </Fab>
    </Zoom>
  )
}

export default AddRemindoro
