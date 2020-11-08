import React, { useState } from 'react'
import styled from 'styled-components'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

const Holder = styled.div`
  display: flex;
`

const MenuButton = styled(IconButton)`
  color: white !important;
`

function Header() {
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
        {'porumai ... wait and hope ... '}
      </Drawer>
    </Holder>
  )
}

export default Header
