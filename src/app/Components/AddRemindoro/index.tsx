import React from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { v4 as uuid } from 'uuid'
import { Fab, Zoom } from '@mui/material/'
import { PlaylistAdd } from '@mui/icons-material'

import { getRemindoroUrl } from '@app/Util/'
import { addNewRemindoro } from '@app/Store/Slices/Remindoros/'
import { FabHolder } from '@app/Styles'

function AddRemindoro() {
  const addRemindoro = useAddRemindoro()

  return (
    <FabHolder>
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
          className={'fab'}
          onClick={() => {
            addRemindoro()
          }}
        >
          <PlaylistAdd fontSize={'large'} />
        </Fab>
      </Zoom>
    </FabHolder>
  )
}

export default AddRemindoro

// helper hook to add new remindoro
export function useAddRemindoro() {
  const dispatch = useDispatch()
  const history = useHistory()

  const addRemindoro = () => {
    const id = uuid()
    const url = getRemindoroUrl(id)
    // first redirect to info page
    history.push(url)
    // now add to our store
    dispatch(addNewRemindoro(id))
  }

  return addRemindoro
}
