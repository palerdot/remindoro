import React from 'react'
import styled from 'styled-components'
import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_BLOCKQUOTE,
  MARK_BOLD,
  MARK_ITALIC,
  useStoreEditorRef,
  useEventEditorId,
  getPlatePluginType,
  ToolbarElement,
  ToolbarMark,
} from '@udecode/plate'
import { FormatBold, FormatItalic, Code, FormatQuote } from '@material-ui/icons'

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
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_CODE_BLOCK)}
        icon={<Code />}
      />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
    </Holder>
  )
}

export default Toolbar
