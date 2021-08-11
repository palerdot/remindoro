import React, { useMemo } from 'react'
import {
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createBlockquotePlugin,
  createCodeBlockPlugin,
  createHeadingPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createCodePlugin,
  createAutoformatPlugin,
  createExitBreakPlugin,
  createResetNodePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  ELEMENT_PARAGRAPH,
  Plate,
  createListPlugin,
  createPlateOptions,
  createPlateComponents,
} from '@udecode/plate'

import {
  optionsAutoformat,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
} from './options'

const editableProps = {
  placeholder: 'Enter some rich text…',
  spellCheck: false,
  padding: '0 30px',
}

function LiveNote() {
  const options = createPlateOptions()
  const components = createPlateComponents()
  const plugins = useMemo(() => {
    return [
      // editor
      createReactPlugin(), // withReact
      createHistoryPlugin(), // withHistory

      // elements
      createParagraphPlugin(), // paragraph element
      createBlockquotePlugin(), // blockquote element
      createCodeBlockPlugin(), // code block element
      createHeadingPlugin(), // heading elements

      // marks
      createBoldPlugin(), // bold mark
      createItalicPlugin(), // italic mark
      createCodePlugin(), // code mark
      createListPlugin(),
      createTodoListPlugin(),

      // auto format
      createAutoformatPlugin(optionsAutoformat),
      createExitBreakPlugin(optionsExitBreakPlugin),
      createResetNodePlugin(optionsResetBlockTypePlugin),
      createTrailingBlockPlugin({ type: ELEMENT_PARAGRAPH }),
    ]
  }, [])

  return (
    <div>
      <Plate
        id="porumai"
        plugins={plugins}
        components={components}
        options={options}
        editableProps={editableProps}
      />
    </div>
  )
}

export default LiveNote
