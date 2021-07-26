import React, { useState } from 'react'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import {
  Inbox as InboxIcon,
  Mail as MailIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from '@material-ui/icons/'

import type { ThemeInterface } from '@app/Util/colors'

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
`

const IconButtonHolder = styled(IconButton)`
  color: white !important;

  &:hover {
    opacity: 0.75;
  }
`

function Header() {
  const theme = useTheme()

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
        <IconButtonHolder onClick={() => window.close()}>
          <CloseIcon fontSize={'large'} />
        </IconButtonHolder>
      </div>
    </Holder>
  )
}

export default Header
