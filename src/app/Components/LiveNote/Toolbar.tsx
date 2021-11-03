import React, { useRef } from 'react'
import styled from 'styled-components'
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

import { LooksOne, LooksTwo, LooksThree } from '@app/Util/Icons/'

const Holder = styled.div`
  display: flex;
  color: ${props => props.theme.primaryDark};

  & .slate-ToolbarButton-active {
    color: ${props => props.theme.highlight};
  }

  & .disabled {
    pointer-events: none;
  }
`

function Toolbar() {
  const editor: SPEditor | undefined = useStoreEditorRef(
    useEventEditorId('focus')
  )
  const $holder = useRef(null)

  return (
    <Holder ref={$holder}>
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
      />

      <ToolbarMark
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_STRIKETHROUGH)}
        icon={<FormatStrikethrough />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_CODE)}
        icon={<Code />}
      />
      <ToolbarCodeBlock
        type={getPlatePluginType(editor, ELEMENT_CODE_BLOCK)}
        icon={<DeveloperMode />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
      <ToolbarList
        type={getPlatePluginType(editor, ELEMENT_UL)}
        icon={<FormatListBulleted />}
      />
      <ToolbarList
        type={getPlatePluginType(editor, ELEMENT_OL)}
        icon={<FormatListNumbered />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H1)}
        icon={<LooksOne />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<LooksTwo />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H3)}
        icon={<LooksThree />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_TODO_LI)}
        icon={<PlaylistAddCheck />}
      />
    </Holder>
  )
}

export default Toolbar
