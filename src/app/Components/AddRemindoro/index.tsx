import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { v4 as uuid } from 'uuid'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { Fab, Zoom } from '@mui/material/'
import { PlaylistAdd } from '@mui/icons-material'

import type { ThemeInterface } from '@app/Util/colors'

import { useTheme } from '@app/Hooks/'
import { getRemindoroUrl } from '@app/Util/'
import { addNewRemindoro } from '@app/Store/Slices/Remindoros/'

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

function AddRemindoro() {
  const theme = useTheme()
  const classes = useStyles({ theme })
  const dispatch = useDispatch()
  const history = useHistory()

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
        aria-label="add"
        className={classes.fab}
        onClick={() => {
          const id = uuid()
          const url = getRemindoroUrl(id)
          // first redirect to info page
          history.push(url)
          // now add to our store
          dispatch(addNewRemindoro(id))
        }}
      >
        <PlaylistAdd fontSize={'large'} />
      </Fab>
    </Zoom>
  )
}

export default AddRemindoro
