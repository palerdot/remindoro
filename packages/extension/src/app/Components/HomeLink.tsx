import { Link } from 'react-router-dom'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import MuiLink, { type LinkProps } from '@mui/material/Link'
import { Home as HomeIcon } from '@mui/icons-material/'

import { Screens } from '@app/Routes/'

// ref: https://next.material-ui.com/components/breadcrumbs/
interface LinkRouterProps extends LinkProps {
  to: string
  replace?: boolean
}

const LinkRouter = (props: LinkRouterProps) => (
  <MuiLink {...props} component={Link} />
)

function HomeLink() {
  return (
    <Breadcrumbs className={'nav-crumb'} aria-label="breadcrumb">
      <LinkRouter
        underline="hover"
        sx={props => ({
          display: 'flex',
          alignItems: 'center',
          color: props.palette.secondary.main,
        })}
        // color="inherit"
        to={Screens.Home}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        {'Home'}
      </LinkRouter>
    </Breadcrumbs>
  )
}

export default HomeLink
