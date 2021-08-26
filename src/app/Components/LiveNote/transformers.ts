import { every, isBoolean } from '@lodash'
import { isLeaf } from 'slate-mark'
import {
  TNode,
  SPEditor,
  getPlatePluginType,
  ELEMENT_PARAGRAPH,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_LINK,
  ELEMENT_CODE_BLOCK,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  MARK_STRIKETHROUGH,
} from '@udecode/plate'
import { deserialize } from 'remark-slate'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfmStrikethrough } from 'micromark-extension-gfm-strikethrough'
import { gfmStrikethroughFromMarkdown } from 'mdast-util-gfm-strikethrough'
import { gfmTaskListItem } from 'micromark-extension-gfm-task-list-item'
import { gfmTaskListItemFromMarkdown } from 'mdast-util-gfm-task-list-item'

import { transformNewLines, NEWLINE_MAGIC_TOKEN, drillTillLeaf } from './utils'

type NodeTypes = {
  paragraph: string
  block_quote: string
  link: string
  code_block: string
  ul_list: string
  ol_list: string
  listItem: string
  heading: {
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
  }
}

function porumaiMd(doc: string, nodeTypes: NodeTypes): TNode {
  const NEW_LINE_SEPARATOR = ' \n'
  /*
   * IMPORTANT: Handling multiple new lines
   *
   * In our editor, we have to show the empty newlines as is
   * as per markdown format, multiple new lines will be trimmed to single new line
   * We have to somehow maintain the new lines
   * we will replace newlines in original markdown with our unique token
   * Once tree is parsed, we will replace unique token back to empty new line
   * by this time, we will have multiple p tags which will give back original new lines
   */

  // markdown does not support multiple new lines
  // we are manually injecting `&nbsp;\n` so that we can preserve multiple new lines
  const tree = fromMarkdown(
    doc.replaceAll(NEW_LINE_SEPARATOR, `${NEWLINE_MAGIC_TOKEN}\n`),
    {
      extensions: [gfmStrikethrough(), gfmTaskListItem],
      mdastExtensions: [
        gfmStrikethroughFromMarkdown,
        gfmTaskListItemFromMarkdown,
      ],
    }
  )

  const parsed: TNode = []

  tree.children.forEach(t => {
    const isActionItem =
      t.type === 'list' &&
      every(t.children, x => {
        return x.type === 'listItem' && isBoolean(x.checked)
      })

    // ok; we have an action item
    // this is an edge case where we can have to proactively deserialize
    if (isActionItem) {
      // extra check to make compiler happy
      if (t.type !== 'list') {
        return
      }

      const actionItems = t.children.map(x => {
        const parsedActionItems = deserialize(x.children[0], { nodeTypes })

        const children = parsedActionItems.children?.map((x, index, orig) => {
          const isLast = index === orig.length - 1

          // replace our unique token
          const text = (x.text || '').replaceAll(NEWLINE_MAGIC_TOKEN, '')

          return {
            ...x,
            text: isLast ? text.trim() : text,
          }
        })

        return {
          type: 'action_item',
          checked: x.checked,
          children,
        }
      })

      // insert action items
      actionItems.forEach(item => {
        parsed.push(item)
      })

      // do not proceed
      return
    }

    const output = deserialize(t, {
      nodeTypes,
    })

    const withNewLines =
      output.type === 'p' && output.children && isLeaf(output.children as any)

    if (withNewLines) {
      const transformed = transformNewLines(output.children as any)
      transformed.forEach(node => {
        parsed.push(node)
      })
    } else {
      // normal output
      parsed.push(output)
    }
  })

  console.log('porumai ... parsed ', tree, parsed)
  // before passing the final tree
  // let us make sure we are removing our magic token
  return parsed.map(drillTillLeaf)
}

/*
 * Customized deserializeMD
 *
 * we are going to manually parse markdown -> slate in two stesps
 *
 * Step 1: markdown -> mdast (mdast-util)
 * Step 2: mdast -> slate (remark-slate)
 */

function deserializeMD(editor: SPEditor, note: string): TNode {
  const nodeTypes = {
    paragraph: getPlatePluginType(editor, ELEMENT_PARAGRAPH),
    block_quote: getPlatePluginType(editor, ELEMENT_BLOCKQUOTE),
    link: getPlatePluginType(editor, ELEMENT_LINK),
    code_block: getPlatePluginType(editor, ELEMENT_CODE_BLOCK),
    ul_list: getPlatePluginType(editor, ELEMENT_UL),
    ol_list: getPlatePluginType(editor, ELEMENT_OL),
    listItem: getPlatePluginType(editor, ELEMENT_LI),
    heading: {
      1: getPlatePluginType(editor, ELEMENT_H1),
      2: getPlatePluginType(editor, ELEMENT_H2),
      3: getPlatePluginType(editor, ELEMENT_H3),
      4: getPlatePluginType(editor, ELEMENT_H4),
      5: getPlatePluginType(editor, ELEMENT_H5),
      6: getPlatePluginType(editor, ELEMENT_H6),
    },
    delete_mark: getPlatePluginType(editor, MARK_STRIKETHROUGH),
  }

  const initialParse = porumaiMd(note, nodeTypes)
  // const transformedItems = handleExtraMdParse(initialParse)

  // return transformedItems
  return initialParse
}

/*
 * Convert MD -> slate/plate
 *
 * For most part, we will use deserializeMD from 'plate'
 * There are edge cases which is not considered by deserializeMD
 * Those edge cases will be manually handled
 *
 * Case 1: Action Item handling:
 * Sniff for text that starts with `[ ]` or `[x]` and convert it to action item
 */
export function parseMd(editor: SPEditor, note: string): TNode {
  return deserializeMD(editor, note)
}
