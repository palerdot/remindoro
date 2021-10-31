import React from 'react'
import styled from 'styled-components'
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Inbox as InboxIcon, Mail as MailIcon } from '@mui/icons-material/'

type Props = {
  isMenuOpen: boolean
  setMenuStatus: React.Dispatch<React.SetStateAction<boolean>>
}

const DrawerHolder = styled.div`
  background: ${props => props.theme.background};
  color: white;
  width: 250px;
  height: 100%;

  & > ul > div.MuiListItem-root {
    &:hover {
      background: ${props => props.theme.primaryDark};
    }
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
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
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
