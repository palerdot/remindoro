import React, { useState } from 'react'
import styled from 'styled-components'
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
    background: props.theme.primary,
  }),
})

const Holder = styled.div`
  display: flex;
  flex-direction: row;

  padding: 8px;
`

const IconButtonHolder = styled(IconButton)`
  color: white !important;
  padding: 6px !important;

  &.highlight,
  &.highlight:hover,
  &.hightlight:focus {
    background: red;
    opacity: 1;
  }

  &:hover {
    opacity: 0.8;
  }
`

function Header() {
  const location = useLocation()
  const theme = useTheme()

  console.log('porumai ... location match ', location)

  const classes = useStyles({ theme })
  const [isMenuOpen, setMenuStatus] = useState(false)

  return (
    <Holder>
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
              location.pathname === String(Screens.Home)
                ? 'highlight'
                : 'nohighlight'
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
    </Holder>
  )
}

export default Header
