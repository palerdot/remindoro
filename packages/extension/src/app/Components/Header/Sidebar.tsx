import React from 'react'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import {
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Home as HomeIcon,
  Notes as NotesIcon,
  PendingActions as PendingActionsIcon,
  IndeterminateCheckBox as TodoIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Star as StarIcon,
  Comment as MessageIcon,
  ManageAccounts as AccountIcon,
} from '@mui/icons-material/'
import { useTodoCount } from '@app/Store/Slices/Remindoros'

import { Screens } from '@app/Routes/'

// replaced by bun
const rateUrl = process.env.BUN_RATE_URL || 'https://palerdot.in/remindoro'

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

const BottomMenu = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  /* left: 1px;
  padding: 4px; */
`

const RateLink = styled.a`
  display: flex;
  text-decoration: none;
  color: ${props => props.theme.textColor};
  margin: 2px 0;

  &:hover {
    background: ${props => props.theme.borderDark};
  }

  & .listIcon {
    color: ${props => props.theme.highlight};
  }
`

function TodoMenu() {
  const count = useTodoCount()
  return (
    <ListItemButton>
      <ListItemIcon className={'listIcon'}>{<TodoIcon />}</ListItemIcon>
      <ListItemText primary={`Todo ${count > 0 ? `(${count})` : ''}`} />
    </ListItemButton>
  )
}

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
            <ListItemButton>
              <ListItemIcon className={'listIcon'}>{<HomeIcon />}</ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItemButton>
          </Link>

          {/* Remindoros Menu */}
          <Link
            to={Screens.Remindoros}
            exact
            activeClassName={'selected-screen'}
          >
            <ListItemButton>
              <ListItemIcon className={'listIcon'}>
                {<NotesIcon />}
              </ListItemIcon>
              <ListItemText primary={'Reminders'} />
            </ListItemButton>
          </Link>

          {/* Todo Menu */}
          <Link to={Screens.Todo} exact activeClassName={'selected-screen'}>
            <TodoMenu />
          </Link>

          {/* Scheduled Menu */}
          <Link
            to={Screens.Scheduled}
            exact
            activeClassName={'selected-screen'}
          >
            <ListItemButton>
              <ListItemIcon className={'listIcon'}>
                {<EventIcon />}
              </ListItemIcon>
              <ListItemText primary={'Scheduled'} />
            </ListItemButton>
          </Link>

          {/* Settings Menu */}
          <Link to={Screens.Settings} exact activeClassName={'selected-screen'}>
            <ListItemButton>
              <ListItemIcon className={'listIcon'}>
                {<SettingsIcon />}
              </ListItemIcon>
              <ListItemText primary={'Settings'} />
            </ListItemButton>
          </Link>

          {/* Time Tracker Menu */}
          <Link
            to={Screens.TimeTracker}
            exact
            activeClassName={'selected-screen'}
          >
            <ListItemButton>
              <ListItemIcon className={'listIcon'}>
                {<PendingActionsIcon />}
              </ListItemIcon>
              <ListItemText primary={'Time Tracker'} />
            </ListItemButton>
          </Link>
        </List>
        <Divider
          sx={{
            background: theme => theme.colors.primaryDark,
          }}
        />
        <List>
          {/* Help Menu */}
          <Link to={Screens.Help} exact activeClassName={'selected-screen'}>
            <ListItemButton>
              <ListItemIcon className={'listIcon'}>{<HelpIcon />}</ListItemIcon>
              <ListItemText primary={'Help'} />
            </ListItemButton>
          </Link>

          {/* Feedback Menu */}
          <Link to={Screens.Feedback} exact activeClassName={'selected-screen'}>
            <ListItemButton>
              <ListItemIcon className={'listIcon'}>
                {<MessageIcon />}
              </ListItemIcon>
              <ListItemText primary={'Feedback'} />
            </ListItemButton>
          </Link>

          {/* Rating Menu */}
          <RateLink
            href={rateUrl}
            target={'_blank'}
            onClick={() => {
              // window.open(rateUrl)
              // window.close()
            }}
          >
            <ListItemButton>
              <ListItemIcon className={'listIcon'}>{<StarIcon />}</ListItemIcon>
              <ListItemText primary={'Rate'} />
            </ListItemButton>
          </RateLink>
        </List>
        <Divider
          sx={{
            background: theme => theme.colors.primaryDark,
          }}
        />
        <BottomMenu>
          {/* Account Menu */}
          <List>
            <Link
              to={Screens.Account}
              exact
              activeClassName={'selected-screen'}
            >
              <ListItemButton>
                <ListItemIcon className={'listIcon'}>
                  {<AccountIcon />}
                </ListItemIcon>
                <ListItemText primary={'Account'} />
              </ListItemButton>
            </Link>
          </List>
        </BottomMenu>
      </DrawerHolder>
    </Drawer>
  )
}

export default Sidebar
