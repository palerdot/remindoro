import React from 'react'
import { Fab, Zoom } from '@mui/material/'
import { Settings as SettingsIcon } from '@mui/icons-material'

import { FabHolder } from '@app/Styles'

type Props = {
  onClick: () => void
}

function Edit({ onClick }: Props) {
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
          // color="secondary"
          aria-label="edit"
          className={'fab'}
          onClick={() => {
            onClick()
          }}
        >
          <SettingsIcon fontSize={'large'} />
        </Fab>
      </Zoom>
    </FabHolder>
  )
}

export default Edit
