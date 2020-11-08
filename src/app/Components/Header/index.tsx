import React, { useState } from 'react'
import styled from 'styled-components'

import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'

import { colors } from '@app/Util/colors'

const useStyles = makeStyles({
  listIcon: {
    color: 'white',
  },
  divider: {
    background: '#AAAAAA',
  },
})

const Holder = styled.div`
  display: flex;
`

const MenuButton = styled(IconButton)`
  color: white !important;
`

const DrawerHolder = styled.div`
  background: ${colors.main};
  color: white;
  width: 250px;
  height: 100%;
`

function Header() {
  const classes = useStyles()
  const [isMenuOpen, setMenuStatus] = useState(false)

  return (
    <Holder>
      <MenuButton onClick={() => setMenuStatus(true)}>
        <MenuIcon fontSize={'large'} />
      </MenuButton>
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
                <ListItemIcon className={classes.listIcon}>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
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
    </Holder>
  )
}

export default Header
