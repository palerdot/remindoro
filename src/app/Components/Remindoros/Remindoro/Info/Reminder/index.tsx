import React, { useState } from 'react'
import styled from 'styled-components'
import { DateTimePicker } from '@material-ui/pickers'
import { Switch, Grid, Typography } from '@material-ui/core'

import type { Remindoro } from '@app/Store/Slices/Remindoros/'

const SwitchHolder = styled.div`
  & .switch-base {
    // color: ${props => props.theme.primary};
    color: lightblue;
  }

  & .track {
    background: pink;
  }
`

type Reminder = Remindoro['reminder']

type Props = {
  reminder: Reminder
}

const Holder = styled.div`
  padding: 16px;
`

function Reminder({ reminder }: Props) {
  return (
    <Holder>
      <div>
        <Typography component="div">
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Off</Grid>
            <Grid item>
              <SwitchHolder>
                <Switch
                  classes={{
                    root: 'root',
                    switchBase: 'switch-base',
                    thumb: 'thumb',
                    track: 'track',
                    checked: 'checked',
                  }}
                  checked={!!reminder}
                  onChange={() => {}}
                  name="repeat"
                  inputProps={{ 'aria-label': 'Repeat Reminder' }}
                />
              </SwitchHolder>
            </Grid>
            <Grid item>On</Grid>
          </Grid>
        </Typography>
      </div>
    </Holder>
  )
}

export default Reminder
