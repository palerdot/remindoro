import { styled } from '@mui/material/styles'

const classes = {
  fab: `fab`,
}

export const FabHolder = styled('div')(({ theme }) => ({
  [`& .${classes.fab}`]: {
    position: 'absolute',
    bottom: theme.spacing(0.5),
    right: theme.spacing(0.5),

    margin: theme.spacing(1),
    background: theme.colors.primaryLight,
    color: 'white',

    '&:hover': {
      background: theme.colors.highlight,
    },
  },
}))
