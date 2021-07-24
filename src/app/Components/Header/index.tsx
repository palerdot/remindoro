import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import type { ThemeInterface } from '@app/Util/colors'
import type { RootState } from '@app/Store/'

import { makeStyles } from '@material-ui/core/styles'
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@material-ui/core'
import {
  Inbox as InboxIcon,
  Mail as MailIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from '@material-ui/icons/'

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
`

const IconButtonHolder = styled(IconButton)`
  color: white !important;

  &:hover {
    opacity: 0.75;
  }
`

const DrawerHolder = styled.div`
  background: ${props => props.theme.primary};
  color: white;
  width: 250px;
  height: 100%;
`

function Header() {
  const theme = useSelector((state: RootState) => state.settings.theme)

  const classes = useStyles({ theme })
  const [isMenuOpen, setMenuStatus] = useState(false)

  return (
    <Holder>
      <div>
        <IconButtonHolder onClick={() => setMenuStatus(true)}>
          <MenuIcon fontSize={'large'} />
        </IconButtonHolder>
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
              {['Inbox', 'Starred', 'Send email', 'Drafts'].map(
                (text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon className={classes.listIcon}>
                      {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItem>
                )
              )}
            </List>
            <Divider className={classes.divider} />
            <List>
              {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon className={classes.listIcon}>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </DrawerHolder>
        </Drawer>
      </div>
      <div className={classes.actionHolder}>
        <IconButtonHolder onClick={() => window.close()}>
          <CloseIcon fontSize={'large'} />
        </IconButtonHolder>
      </div>
    </Holder>
  )
}

export default Header
