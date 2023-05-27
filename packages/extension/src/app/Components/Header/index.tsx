import React, { useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { Link, useLocation } from 'react-router-dom'
import { IconButton } from '@mui/material'
import {
  Close as CloseIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  IndeterminateCheckBox as TodoIcon,
  // Event as EventIcon,
} from '@mui/icons-material/'

import { Screens } from '@app/Routes/'
import Sidebar from './Sidebar'

const normalFlex = css`
  display: flex;
`

const PREFIX = 'Header'

const classes = {
  actionHolder: `${PREFIX}-actionHolder`,
}

const Holder = styled.div`
  ${normalFlex};
  flex-direction: column;

  padding: 8px;

  & .nav-crumb {
    padding: 0 8px;
    font-size: 15px;
  }

  & .${classes.actionHolder} {
    display: flex;
    margin-left: auto;
  }
`

const NavHolder = styled.div`
  ${normalFlex};
`

const IconButtonHolder = styled(IconButton)`
  padding: 4px !important;
  margin: 0 2px !important;

  color: ${props => props.theme.textColor};

  &.highlight,
  &.highlight:hover,
  &.hightlight:focus {
    background: ${props => props.theme.primaryLight};
    color: ${props => props.theme.highlightTextColor};
    opacity: 1;
  }

  &:hover {
    opacity: 0.8;
  }
`

function Header() {
  const location = useLocation()

  const [isMenuOpen, setMenuStatus] = useState(false)

  // const isHomePage = location.pathname === Screens.Home

  return (
    <Holder>
      <NavHolder>
        <div>
          <IconButtonHolder onClick={() => setMenuStatus(true)}>
            <MenuIcon fontSize={'large'} />
          </IconButtonHolder>
          <Sidebar isMenuOpen={isMenuOpen} setMenuStatus={setMenuStatus} />
        </div>
        <div className={classes.actionHolder}>
          {/* Home Screen */}
          <Link to={Screens.Home}>
            <IconButtonHolder
              className={
                location.pathname === Screens.Home ? 'highlight' : 'nohighlight'
              }
            >
              <HomeIcon fontSize={'large'} />
            </IconButtonHolder>
          </Link>

          {/* Todo Screen */}
          <Link to={Screens.Todo}>
            <IconButtonHolder
              className={
                location.pathname === Screens.Todo ? 'highlight' : 'nohighlight'
              }
            >
              <TodoIcon fontSize={'large'} />
            </IconButtonHolder>
          </Link>

          {/* <Link to={Screens.Scheduled}>
            <IconButtonHolder
              className={
                location.pathname === Screens.Scheduled
                  ? 'highlight'
                  : 'nohighlight'
              }
            >
              <EventIcon fontSize={'large'} />
            </IconButtonHolder>
          </Link> */}

          <IconButtonHolder onClick={() => window.close()}>
            <CloseIcon fontSize={'large'} />
          </IconButtonHolder>
        </div>
      </NavHolder>
    </Holder>
  )
}

export default Header
