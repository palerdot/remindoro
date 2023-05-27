import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import MuiLink, { LinkProps } from '@mui/material/Link'
import { Home as HomeIcon } from '@mui/icons-material/'

import { Screens } from '@app/Routes/'
import { useTheme } from '@app/Hooks/'

// ref: https://next.material-ui.com/components/breadcrumbs/
interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}

const LinkRouter = (props: LinkRouterProps) => (
  <MuiLink {...props} component={Link as any} />
)

function HomeLink() {
  const theme = useTheme()

  return (
    <Breadcrumbs className={'nav-crumb'} aria-label="breadcrumb">
      <LinkRouter
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        // color="inherit"
        color={theme.highlight}
        to={Screens.Home}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {'Home'}
      </LinkRouter>
    </Breadcrumbs>
  )
}

export default HomeLink
