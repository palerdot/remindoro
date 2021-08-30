import { get } from '@lodash'
import {
  unwrapList,
  getParent,
  isElement,
  isType,
  toggleList,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_LI,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_TODO_LI,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_PARAGRAPH,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_CODE,
  KEYS_HEADING,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  // plugins
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createBlockquotePlugin,
  createCodeBlockPlugin,
  createHeadingPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createCodePlugin,
  createListPlugin,
  createAutoformatPlugin,
  createExitBreakPlugin,
  createResetNodePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createPlateOptions,
  createPlateComponents,
} from '@udecode/plate'
import type {
  SPEditor,
  AutoformatRule,
  WithAutoformatOptions,
  ExitBreakPluginOptions,
} from '@udecode/plate'

const preFormat: AutoformatRule['preFormat'] = editor =>
  unwrapList(editor as SPEditor)

// helper function to prevent marks
// used inside code block
function preventMarksInsideCodeBlock(editor: SPEditor): boolean {
  if (editor.selection) {
    const parentEntry = getParent(editor, editor.selection)
    if (!parentEntry) {
      return true
    }
    const isCodeBlock = get(parentEntry, '[0].type') === 'code_block'
    if (isCodeBlock) {
      return false
    }
    return true
  }

  return true
}

const resetBlockTypesCommonRule = {
  types: [
    ELEMENT_BLOCKQUOTE,
    ELEMENT_TODO_LI,
    ELEMENT_CODE_BLOCK,
    ELEMENT_CODE_LINE,
  ],
  defaultType: ELEMENT_PARAGRAPH,
}

export const optionsResetBlockTypePlugin = {
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Enter',
      predicate: isBlockAboveEmpty,
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Backspace',
      predicate: isSelectionAtBlockStart,
    },
  ],
}

export const optionsAutoformat: WithAutoformatOptions = {
  rules: [
    {
      type: ELEMENT_H1,
      markup: '#',
      preFormat,
    },
    {
      type: ELEMENT_H2,
      markup: '##',
      preFormat,
    },
    {
      type: ELEMENT_H3,
      markup: '###',
      preFormat,
    },
    {
      type: ELEMENT_H4,
      markup: '####',
      preFormat,
    },
    {
      type: ELEMENT_H5,
      markup: '#####',
      preFormat,
    },
    {
      type: ELEMENT_H6,
      markup: '######',
      preFormat,
    },
    {
      type: ELEMENT_LI,
      markup: ['*', '-'],
      preFormat,
      format: actualEditor => {
        const editor = actualEditor as SPEditor
        if (editor.selection) {
          const parentEntry = getParent(editor, editor.selection)
          if (!parentEntry) return
          const [node] = parentEntry
          if (
            isElement(node) &&
            !isType(editor, node, ELEMENT_CODE_BLOCK) &&
            !isType(editor, node, ELEMENT_CODE_LINE)
          ) {
            toggleList(editor, {
              type: ELEMENT_UL,
            })
          }
        }
      },
    },
    {
      type: ELEMENT_LI,
      markup: ['1.', '1)'],
      preFormat,
      format: actualEditor => {
        const editor = actualEditor as SPEditor
        if (editor.selection) {
          const parentEntry = getParent(editor, editor.selection)
          if (!parentEntry) return
          const [node] = parentEntry
          if (
            isElement(node) &&
            !isType(editor, node, ELEMENT_CODE_BLOCK) &&
            !isType(editor, node, ELEMENT_CODE_LINE)
          ) {
            toggleList(editor, {
              type: ELEMENT_OL,
            })
          }
        }
      },
    },
    {
      type: ELEMENT_TODO_LI,
      markup: ['[]'],
    },
    {
      type: ELEMENT_TODO_LI,
      markup: ['[ ]'],
    },
    {
      type: ELEMENT_TODO_LI,
      markup: ['[x]'],
    },
    {
      type: ELEMENT_BLOCKQUOTE,
      markup: ['>'],
      preFormat,
    },
    {
      type: MARK_BOLD,
      between: ['**', '**'],
      mode: 'inline',
      insertTrigger: true,
      query: actualEditor => {
        const editor = actualEditor as SPEditor
        // prevent marks inside codeblock
        return preventMarksInsideCodeBlock(editor)
      },
    },
    {
      type: MARK_BOLD,
      between: ['__', '__'],
      mode: 'inline',
      insertTrigger: true,
      query: actualEditor => {
        const editor = actualEditor as SPEditor
        // prevent marks inside codeblock
        return preventMarksInsideCodeBlock(editor)
      },
    },
    {
      type: MARK_ITALIC,
      between: ['*', '*'],
      mode: 'inline',
      insertTrigger: true,
      query: actualEditor => {
        const editor = actualEditor as SPEditor
        // prevent marks inside codeblock
        return preventMarksInsideCodeBlock(editor)
      },
    },
    {
      type: MARK_STRIKETHROUGH,
      between: ['~~', '~~'],
      mode: 'inline',
      insertTrigger: true,
      query: actualEditor => {
        const editor = actualEditor as SPEditor
        // prevent marks inside codeblock
        return preventMarksInsideCodeBlock(editor)
      },
    },
    {
      type: MARK_CODE,
      between: ['`'],
      mode: 'inline',
      trigger: '`',
      ignoreTrim: false,
      query: actualEditor => {
        const editor = actualEditor as SPEditor
        // prevent marks inside codeblock
        return preventMarksInsideCodeBlock(editor)
      },
    },

    {
      type: ELEMENT_CODE_BLOCK,
      markup: '``',
      trigger: '`',
      triggerAtBlockStart: false,
      preFormat,
    },
  ],
}

export const optionsExitBreakPlugin: ExitBreakPluginOptions = {
  rules: [
    {
      hotkey: 'mod+enter',
    },
    {
      hotkey: 'mod+shift+enter',
      before: true,
    },
    {
      hotkey: 'enter',
      query: {
        start: true,
        end: true,
        allow: KEYS_HEADING,
      },
    },
  ],
}

export const options = createPlateOptions()
export const components = createPlateComponents()

export const plugins = [
  // editor
  createReactPlugin(), // withReact
  createHistoryPlugin(), // withHistory

  // elements
  createParagraphPlugin(), // paragraph element
  createBlockquotePlugin(), // blockquote element
  createStrikethroughPlugin(), // strikethrough
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
