import { get, compact, flatten, isString, isArray } from '@lodash'
import { SlateNode, LeafNode, isLeafNode } from 'slate-mark'
import { TNode, deserializeMD, SPEditor } from '@udecode/plate'

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
  // inital pass will use 'deserializeMD' and handle new lines
  const initialParse = deserializeMD(
    editor,
    note.replaceAll(' \n ', '&nbsp;\n')
  )

  return handleExtraMdParse(initialParse)
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
      const firstElem = node.children[0]

      if (!isLeafNode(firstElem)) {
        return
      }

      // we have valid action items
      const actionItems = transformActionItems(firstElem)
      // we will get list of items
      actionItems.forEach(actionItem => {
        transformedNodes.push(actionItem)
      })
    }
  })

  return transformedNodes
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

  const isValidChildren = isArray(children) && children.length === 1
  if (!isValidChildren) {
    // not an action item
    return false
  }

  // we will deal only with leaf node
  if (!isLeafNode(children[0])) {
    return false
  }

  const isValidText = isString(children[0].text)
  if (!isValidText) {
    // not an action item
    return false
  }

  // valid action item starts with [ ] or [x]
  const text: string = isString(children[0].text) ? children[0].text : ''
  const isValidActionItem = text.startsWith('[ ]') || text.startsWith('[x]')
  if (!isValidActionItem) {
    // not an action item
    return false
  }

  // we have a valid action item
  return true
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
      return [`[ ]${item}`]
    }

    // we have checked item
    // two cases - string starts/does not start with [x]
    // case 1: [x] porumai\n[x] amaidhi\n
    // case 2:  porumai\n[x] amaidhi\n
    const checkedItems = compact(item.split('[x]'))

    return checkedItems.map((checkedItem, index) => {
      // anything not first item is normal checked item
      if (index > 0) {
        return `[x]${checkedItem}`
      }

      // special cases for first item
      // case 1: [x] porumai\n[x] amaidhi\n
      // starts with [x]
      if (item.startsWith('[x]')) {
        // all is fine; we just need to prefix everything with [x]
        return `[x]${checkedItem}`
      } else {
        // case 2: The original string started with [ ]
        return `[ ]${checkedItem}`
      }
    })
  })

  // let us flatten and add type 'action item'
  const actionItems = flatten(parsed).map(text => {
    // here we decide if the item is checked or not
    const isChecked = text.startsWith('[x]')
    return Object.assign(
      {
        type: 'action_item',
        children: [
          {
            text,
          },
        ],
      },
      isChecked
        ? {
            checked: true,
          }
        : {}
    )
  })

  return actionItems
}
