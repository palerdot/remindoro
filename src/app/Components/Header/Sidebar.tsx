import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Inbox as InboxIcon,
  Mail as MailIcon,
  Home as HomeIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material/'

import { Screens } from '@app/Routes/'

type Props = {
  isMenuOpen: boolean
  setMenuStatus: React.Dispatch<React.SetStateAction<boolean>>
}

const DrawerHolder = styled.div`
  background: ${props => props.theme.background};
  color: white;
  width: 250px;
  height: 100%;
`

const Link = styled(NavLink)`
  display: flex;
  text-decoration: none;
  color: ${props => props.theme.textColor};
  margin: 2px 0;

  &:hover {
    background: ${props => props.theme.borderDark};
  }

  &.selected-screen {
    background: ${props => props.theme.primaryDark};
  }

  & .listIcon {
    color: ${props => props.theme.highlight};
  }
`

function Sidebar({ isMenuOpen, setMenuStatus }: Props) {
  return (
    <Drawer
      anchor={'left'}
      open={isMenuOpen}
      onClose={() => setMenuStatus(false)}
    >
      <DrawerHolder
        role="presentation"
        onClick={() => setMenuStatus(false)}
        onKeyDown={() => setMenuStatus(false)}
      >
        <List>
          {/* Home Menu */}
          <Link to={Screens.Home} exact activeClassName={'selected-screen'}>
            <ListItem button>
              <ListItemIcon className={'listIcon'}>{<HomeIcon />}</ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItem>
          </Link>

          {/* Scheduled Menu */}
          <Link
            to={Screens.Scheduled}
            exact
            activeClassName={'selected-screen'}
          >
            <ListItem button>
              <ListItemIcon className={'listIcon'}>
                {<EventIcon />}
              </ListItemIcon>
              <ListItemText primary={'Scheduled'} />
            </ListItem>
          </Link>

          {/* Settings Menu */}
          <Link to={Screens.Settings} exact activeClassName={'selected-screen'}>
            <ListItem button>
              <ListItemIcon className={'listIcon'}>
                {<SettingsIcon />}
              </ListItemIcon>
              <ListItemText primary={'Settings'} />
            </ListItem>
          </Link>
        </List>
        <Divider
          sx={{
            background: theme => theme.colors.primaryDark,
          }}
        />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon
                sx={{
                  color: theme => theme.colors.highlight,
                }}
              >
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </DrawerHolder>
    </Drawer>
  )
}

export default Sidebar
