import React from 'react'
import { useDispatch } from 'react-redux'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import { Fab, Zoom } from '@material-ui/core/'
import { PlaylistAdd } from '@material-ui/icons'

import { addNewRemindoro } from '@app/Store/Slices/Remindoros/'

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
  const dispatch = useDispatch()

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
        color="secondary"
        aria-label="add"
        className={classes.fab}
        onClick={() => {
          dispatch(addNewRemindoro())
        }}
      >
        <PlaylistAdd fontSize={'large'} />
      </Fab>
    </Zoom>
  )
}

export default AddRemindoro
