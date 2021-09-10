import React from 'react'
import styled from 'styled-components'
import { Switch as SwitchInput, Grid, Typography } from '@mui/material'

const SwitchHolder = styled.div`
  & .switch-base {
    color: ${props => props.theme.primaryDark};
  }

  & .track {
    background: ${props => props.theme.background};
  }

  & .checked {
    color: ${props => props.theme.highlight} !important;

    & + .track {
      background: ${props => props.theme.primaryDark} !important;
    }
  }
`

type Props = {
  onText: string
  offText: string
  ariaLabel: string

  checked: boolean
  setChecked: (status: boolean) => void
}

const defaultProps = {
  onText: 'On',
  offText: 'Off',
  ariaLabel: 'Switch',
}

function Switch({ checked, setChecked, onText, offText, ariaLabel }: Props) {
  return (
    <Typography component="div">
      <Grid
        component="label"
        container
        alignItems="center"
        spacing={1}
        style={{
          cursor: 'pointer',
        }}
      >
        <Grid item>{offText}</Grid>
        <Grid item>
          <SwitchHolder>
            <SwitchInput
              classes={{
                root: 'root',
                switchBase: 'switch-base',
                thumb: 'thumb',
                track: 'track',
                checked: 'checked',
              }}
              checked={checked}
              onChange={e => {
                console.log('porumai ... switch changing ', e.target.checked)
                setChecked(e.target.checked)
              }}
              name="repeat"
              inputProps={{ 'aria-label': ariaLabel }}
            />
          </SwitchHolder>
        </Grid>
        <Grid item>{onText}</Grid>
      </Grid>
    </Typography>
  )
}

Switch.defaultProps = defaultProps

export default Switch
