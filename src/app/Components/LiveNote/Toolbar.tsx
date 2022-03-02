import React, { MouseEvent } from 'react'
import styled from 'styled-components'
import { Toolbars } from 'react-slite'
import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_TODO_LI,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_CODE,
  MARK_STRIKETHROUGH,
  useStoreEditorRef,
  useEventEditorId,
  getPlatePluginType,
  ToolbarElement,
  ToolbarMark,
  ToolbarCodeBlock,
  ToolbarList,
  SPEditor,
} from '@udecode/plate'
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  Code,
  DeveloperMode,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  PlaylistAddCheck,
} from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'

import { LooksOne, LooksTwo, LooksThree } from '@app/Util/Icons/'

const Holder = styled.div`
  display: flex;
  color: ${props => props.theme.primaryDark};

  & .active {
    color: ${props => props.theme.highlight};
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
      <Stack direction="row" spacing={1}>
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
      </Stack>
    </Holder>
  )
}

export default Toolbar
