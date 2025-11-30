import styled from '@emotion/styled'
import { Switch as SwitchInput, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'

const SwitchHolder = styled.div`
  & .switch-base {
    color: ${props => props.theme.palette.divider};
  }

  & .track {
    background: ${props => props.theme.palette.divider};
  }

  & .checked {
    color: ${props => props.theme.palette.secondary.main} !important;

    & + .track {
      background: ${props => props.theme.palette.primary.main} !important;
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

function Switch({
  checked,
  setChecked,
  onText = 'On',
  offText = 'Off',
  ariaLabel,
}: Props) {
  return (
    <Typography component="div">
      <Grid
        component="label"
        container
        spacing={1}
        style={{
          cursor: 'pointer',
        }}
        sx={{
          alignItems: 'center',
        }}
      >
        <Grid size="grow">{offText}</Grid>
        <Grid>
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
                setChecked(e.target.checked)
              }}
              name="repeat"
              inputProps={{ 'aria-label': ariaLabel }}
            />
          </SwitchHolder>
        </Grid>
        <Grid size="grow">{onText}</Grid>
      </Grid>
    </Typography>
  )
}

export default Switch
