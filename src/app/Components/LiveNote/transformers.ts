import { get, compact, flatten, times } from '@lodash'
import { SlateNode, LeafNode, isLeafNode, isLeaf } from 'slate-mark'
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

import { transformNewLines } from './utils'

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

  // markdown does not support multiple new lines
  // we are manually injecting `&nbsp;\n` so that we can preserve multiple new lines
  const tree = fromMarkdown(doc.replaceAll(NEW_LINE_SEPARATOR, '&nbsp;\n'), {
    extensions: [gfmStrikethrough()],
    mdastExtensions: [gfmStrikethroughFromMarkdown],
  })

  const parsed: TNode = []

  tree.children.forEach(t => {
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

  return parsed
}

/*
 * Customized deserializeMD
 * https://github.com/udecode/plate/blob/main/packages/serializers/md-serializer/src/deserializer/utils/deserializeMD.ts
 *
 * We are going to deal with extra space using - https://github.com/remarkjs/remark-breaks
 * We will be dealing with task lists (github flavoured markdown) - https://github.com/remarkjs/remark-gfm
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
  const transformedItems = handleExtraMdParse(initialParse)

  console.log('porumai ... MD TREE ... ', initialParse, transformedItems)

  return transformedItems
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

export function handleExtraMdParse(nodes: TNode): TNode {
  const transformedNodes: TNode = []

  // NOTE: we cannot do a map since there is no 1:1
  // transformation of nodes. for eg: one entry will
  // split into multiple action items
  nodes.forEach((node: SlateNode) => {
    // for now we are transforming only action items
    if (!isNodeActionItem(node)) {
      // push node to our transformed nodes
      transformedNodes.push(node)
    } else {
      // ok; let us deal with the children
      /*  
      Case 1: we have our action item directly
      children: [
        {
          text: "[ ] action item \n[x] checked item"
        }
      ]

      Case 2: we have empty lines nested (unexpected behaviour from slate)
      children: [
        {
          text: " " // empty lines
        },
        {
          text: "" // empty lines
        },
        {
          text: "[ ] action item \n[x] checked item"
        }
      ]
      */

      const children = node.children

      // so we are going to loop through the children and if not valid action item
      // we are going to return text as a new 'p' element
      children.forEach(node => {
        // we will not deal if not leaf node
        if (!isLeafNode(node)) {
          return
        }

        const text = node.text
        const isValidActionItem =
          text.startsWith('[ ]') || text.startsWith('[x]')

        if (!isValidActionItem) {
          transformedNodes.push({
            type: 'p',
            children: [{ text }],
          })
        } else {
          // we are going to deal with action items
          // we have valid action items
          const actionItems = transformActionItems(node)
          // we will get list of items
          actionItems.forEach(actionItem => {
            transformedNodes.push(actionItem)
          })
        }
      })
    }
  })

  return transformedNodes
}

export function checkActionItemNode(children: Array<LeafNode>) {
  /*  
   Case 1: we have our action item directly
   children: [
     {
       text: "[ ] action item \n[x] checked item"
     }
   ]

   Case 2: we have empty lines nested (unexpected behaviour from slate)
   children: [
     {
       text: " " // empty lines
     },
     {
       text: "" // empty lines
     },
     {
       text: "[ ] action item \n[x] checked item"
     }
   ]
   */
  let isValid = false
  children.forEach(node => {
    const text = node.text
    // it is valid it should have atleast one valid action item
    const isValidActionItem = text.startsWith('[ ]') || text.startsWith('[x]')

    isValid = isValidActionItem
  })

  return isValid
}

// helper function to decide if node is valid action item
export function isNodeActionItem(node: SlateNode) {
  const nodeType = get(node, 'type')
  const children = get(node, 'children')

  const isDefaultType = nodeType === 'p' || nodeType === 'paragraph'

  if (!isDefaultType) {
    // not an action item
    return false
  }

  return isLeaf(children) && checkActionItemNode(children)
}

// we are sniffing for action item which is not yet parsed
/*  
  {
    type: "p",
    children: [
      { text: "[ ] porumai\n[x] amaidhi\n[ ] patience\n \n \n " }
    ]
  }

  // here we are going to sniff for [ ] or [x] as entry point
  // Case 1:
  // "[ ] porumai\n[x] amaidhi\n[ ] patience\n \n \n "
  
  // Case 2:
  // "[x] porumai\n[x] amaidhi\n[ ] patience\n \n \n "
*/
export function transformActionItems({ text }: LeafNode) {
  // seems like we have a valid action item
  // let us parse the action item
  // eg: "[ ] porumai\n[x] amaidhi\n[ ] patience\n \n \n "
  // first let us split by [ ]
  // [" porumai\n[x] amaidhi\n", " patience\n \n \n " ]
  const parsed = compact(text.split('[ ]')).map(item => {
    // ok; happy path case
    // if we don't have [x] in the text; all items are unchecked
    // we just have to prefix with [ ]
    const isCheckedItem = item.includes('[x]')
    if (!isCheckedItem) {
      // we are returning an array, so that we can flatten things out

      return {
        text: item.trim(),
        checked: false,
      }
    }

    // we have checked item
    // two cases - string starts/does not start with [x]
    // case 1: [x] porumai\n[x] amaidhi\n
    // case 2:  porumai\n[x] amaidhi\n
    const checkedItems = compact(item.split('[x]'))

    return checkedItems.map((checkedItem, index) => {
      // anything not first item is normal checked item
      if (index > 0) {
        return {
          text: checkedItem.trim(),
          checked: true,
        }
      }

      // special cases for first item
      // case 1: [x] porumai\n[x] amaidhi\n
      // starts with [x]
      if (item.startsWith('[x]')) {
        // all is fine; we just need to prefix everything with [x]
        return {
          text: checkedItem.trim(),
          checked: true,
        }
      } else {
        // case 2: The original string started with [ ]
        return {
          text: checkedItem.trim(),
          checked: false,
        }
      }
    })
  })

  // let us flatten and add type 'action item'
  const actionItems = flatten(parsed).map(({ text, checked }) => {
    return Object.assign(
      {
        type: 'action_item',
        children: [
          {
            text,
          },
        ],
      },
      checked
        ? {
            checked: true,
          }
        : {}
    )
  })

  // EDGE CASE
  // If there is a list and we insert a blank line between the list items
  // we have to make sure the the blank line at the end of the list is parsed correctly
  const totalEndingNewLines = checkEndingNewLine(text)
  if (totalEndingNewLines > 1) {
    times(totalEndingNewLines - 1, () => {
      actionItems.push({
        type: 'p',
        children: [
          {
            text: '  \n',
          },
        ],
      })
    })
  }

  return actionItems
}

// helper function to add ending new line break
function checkEndingNewLine(text: string): number {
  const trimmed = text.trimEnd()
  const diffIndex = text.length - trimmed.length
  const ending: string = text.slice(-diffIndex)
  const splitted = ending.split('\n')

  return splitted.length - 1 // excluding initial ""
}
