import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import {
  Close as CloseIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Event as EventIcon,
} from '@material-ui/icons/'

import type { ThemeInterface } from '@app/Util/colors'

import { Screens } from '@app/Routes/'
import { useTheme } from '@app/Hooks/'
import Sidebar from './Sidebar'

const useStyles = makeStyles({
  actionHolder: {
    display: 'flex',
    marginLeft: 'auto',
  },
  listIcon: {
    color: 'white',
  },
  divider: (props: { theme: ThemeInterface }) => ({
    // background: '#AAAAAA',
    background: props.theme.primaryDark,
  }),
})

const normalFlex = css`
  display: flex;
`

const Holder = styled.div`
  ${normalFlex};
  flex-direction: column;

  padding: 8px;

  & .nav-crumb {
    padding: 0 8px;
    font-size: 15px;
  }
`

const NavHolder = styled.div`
  ${normalFlex};
`

const IconButtonHolder = styled(IconButton)`
  color: white !important;
  padding: 4px !important;
  margin: 0 2px !important;

  &.highlight,
  &.highlight:hover,
  &.hightlight:focus {
    background: ${props => props.theme.primaryLight};
    opacity: 1;
  }

  &:hover {
    opacity: 0.8;
  }
`

function Header() {
  const location = useLocation()
  const theme = useTheme()
  const classes = useStyles({ theme })

  const [isMenuOpen, setMenuStatus] = useState(false)

  const isHomePage = location.pathname === Screens.Home

  return (
    <Holder>
      <NavHolder>
        <div>
          <IconButtonHolder onClick={() => setMenuStatus(true)}>
            <MenuIcon fontSize={'large'} />
          </IconButtonHolder>
          <Sidebar
            isMenuOpen={isMenuOpen}
            setMenuStatus={setMenuStatus}
            classes={classes}
          />
        </div>
        <div className={classes.actionHolder}>
          <Link to={Screens.Home}>
            <IconButtonHolder
              className={
                location.pathname === Screens.Home ? 'highlight' : 'nohighlight'
              }
            >
              <HomeIcon fontSize={'large'} />
            </IconButtonHolder>
          </Link>

          <Link to={Screens.Scheduled}>
            <IconButtonHolder
              className={
                location.pathname === Screens.Scheduled
                  ? 'highlight'
                  : 'nohighlight'
              }
            >
              <EventIcon fontSize={'large'} />
            </IconButtonHolder>
          </Link>

          <IconButtonHolder onClick={() => window.close()}>
            <CloseIcon fontSize={'large'} />
          </IconButtonHolder>
        </div>
      </NavHolder>
      {!isHomePage && (
        <div className={'nav-crumb'}>
          <Link to={Screens.Home}>{'Home'}</Link>
        </div>
      )}
    </Holder>
  )
}

export default Header
