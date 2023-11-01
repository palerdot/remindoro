import React from 'react'
import { styled } from '@mui/material/styles'
import { Fab, Zoom, Button } from '@mui/material/'
import { MoreTime } from '@mui/icons-material'

import { FabHolder } from '@app/Styles'

type Props = {
  onClick: () => void
  disabled?: boolean
}

const StyledButton = styled(Button)({
  fontWeight: '600',
  '&:disabled': {
    color: '#777777',
  },
})

function AddSiteFab({ onClick }: Props) {
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
          onClick={onClick}
        >
          <MoreTime fontSize={'large'} />
        </Fab>
      </Zoom>
    </FabHolder>
  )
}

export default AddSiteFab

export function AddSiteButton({ onClick, disabled }: Props) {
  return (
    <StyledButton
      variant="contained"
      size="large"
      startIcon={<MoreTime />}
      onClick={onClick}
      disabled={disabled}
    >
      {'Add site for time tracking'}
    </StyledButton>
  )
}
