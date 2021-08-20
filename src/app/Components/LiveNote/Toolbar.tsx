import React from 'react'
import styled from 'styled-components'
import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_H2,
  ELEMENT_H3,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_CODE,
  useStoreEditorRef,
  useEventEditorId,
  getPlatePluginType,
  ToolbarElement,
  ToolbarMark,
  ToolbarCodeBlock,
  ToolbarList,
} from '@udecode/plate'
import {
  FormatBold,
  FormatItalic,
  Code,
  DeveloperMode,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
} from '@material-ui/icons'

import { LooksOne, LooksTwo } from '@app/Util/Icons/'

const Holder = styled.div`
  display: flex;
  color: grey;

  & .slate-ToolbarButton-active {
    color: steelblue;
  }
`

function Toolbar() {
  const editor = useStoreEditorRef(useEventEditorId('focus'))
  return (
    <Holder>
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
      />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
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
        type={getPlatePluginType(editor, ELEMENT_H2)}
        icon={<LooksOne />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_H3)}
        icon={<LooksTwo />}
      />
    </Holder>
  )
}

export default Toolbar
