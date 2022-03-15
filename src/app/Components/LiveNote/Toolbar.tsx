import React, { MouseEvent } from 'react'
import styled from 'styled-components'
import { Toolbars } from 'react-slite'
import {
  FormatBold,
  FormatItalic,
  Code,
  DeveloperMode,
  FormatQuote,
  FormatListBulleted,
  Straighten,
} from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'

import { LooksOne, LooksTwo, LooksThree } from '@app/Util/Icons/'

const Holder = styled.div`
  display: flex;

  & .active {
    color: ${props => props.theme.highlight};
  }

  & button {
    padding: 0 4px;
    color: ${props => props.theme.primaryDark};
  }

  & .disabled {
    pointer-events: none;
  }
`

type ButtonProps = {
  isActive?: boolean
  children: React.ReactNode
  ariaLabel?: string
  onMouseDown: (event: MouseEvent) => void
}

function Button({ isActive, children, onMouseDown, ariaLabel }: ButtonProps) {
  return (
    <IconButton
      className={`${isActive ? 'active' : ''}`}
      aria-label={ariaLabel || 'toolbar'}
      onMouseDown={onMouseDown}
    >
      {children}
    </IconButton>
  )
}

function Toolbar() {
  return (
    <Holder>
      <Toolbars.Bold>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <FormatBold />
          </Button>
        )}
      </Toolbars.Bold>
      <Toolbars.Italic>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <FormatItalic />
          </Button>
        )}
      </Toolbars.Italic>
      <Toolbars.Code>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <Code />
          </Button>
        )}
      </Toolbars.Code>
      <Toolbars.CodeBlock>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <DeveloperMode />
          </Button>
        )}
      </Toolbars.CodeBlock>
      <Toolbars.HeadingOne>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <LooksOne />
          </Button>
        )}
      </Toolbars.HeadingOne>
      <Toolbars.HeadingTwo>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <LooksTwo />
          </Button>
        )}
      </Toolbars.HeadingTwo>
      <Toolbars.HeadingThree>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <LooksThree />
          </Button>
        )}
      </Toolbars.HeadingThree>
      <Toolbars.BlockQuote>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <FormatQuote />
          </Button>
        )}
      </Toolbars.BlockQuote>
      <Toolbars.BulletedList>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <FormatListBulleted />
          </Button>
        )}
      </Toolbars.BulletedList>
      <Toolbars.ThematicBreakBlock>
        {({ isActive, onMouseDown }) => (
          <Button isActive={isActive} onMouseDown={onMouseDown}>
            <Straighten />
          </Button>
        )}
      </Toolbars.ThematicBreakBlock>
    </Holder>
  )
}

export default Toolbar
