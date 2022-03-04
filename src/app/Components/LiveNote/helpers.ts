import { serialize, deserialize } from 'remark-slate'
import { unified } from 'unified'
import markdown from 'remark-parse'
import styled, { css } from 'styled-components'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { get } from '@lodash'

import type { Descendant } from 'react-slite'

export const LiveNoteStyles = css`
  .slate-li {
    & .slate-p {
      padding: 0;
    }
  }

  & h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    color: ${props => props.theme.greyOne};
  }

  ul li p {
    margin: 0;
  }

  .slate-CodeBlockElement,
  .slate-code {
    background: ${props => props.theme.primaryDark};
    color: ${props => props.theme.textColor};
  }

  blockquote {
    border-left: ${props => `2px solid ${props.theme.primaryDark}`};
    margin-left: 0;
    margin-right: 0;
    padding-left: 10px;
    color: ${props => props.theme.greyOne};
    font-style: italic;
  }

  span[data-slate-leaf='true'] > code {
    font-family: monospace;
    background-color: ${props => props.theme.primaryDark};
    color: ${props => props.theme.textColor};
    padding: 3px;
  }

  pre.codeblock {
    font-family: monospace;
    background-color: ${props => props.theme.primaryDark};
    color: ${props => props.theme.textColor};
    margin: 0;
    padding: 3px;
    font-size: 0.89rem;
  }

  &.readonly {
    pointer-events: none;
  }
`

export const EditorHolder = styled.div`
  ${LiveNoteStyles}
`
/*  
 - <br> => \n\r\n
 - add an empty paragraph at the end for easier editing
 - unwrap incoming slate list item and replace paragraphs with children
 - clean up LiveNote folder files
 - Nuke dependencies
 */

/*  

// replace incoming paragraph child with their children directly
// this is the preferred way for list elements in slate
// IMPORTANT: we are doing the reverse when exporting slate to md
// NOTE: There might be a problem with nested lists, but we will figure it out later

{
  "type": "ul_list",
  "children": [
    {
      "type": "list_item",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "porumai"
            }
          ]
        }
      ]
    },
    {
      "type": "list_item",
      "children": [
        {
          "type": "paragraph",
          "children": [
            {
              "text": "amaidhi"
            }
          ]
        }
      ]
    }
  ]
}
*/
function unwrapListItems(listChildren: any[]) {
  return listChildren.map((li: any) => {
    // replace li item paragraph with its first child
    return {
      type: get(li, 'type', 'list_item'),
      children: get(li, 'children', []).map((y: any) => {
        return y.children[0]
      }),
    }
  })
}

// newline token; <br> tag will be replaced with this for better readability
// and to maintain new lines (md format does not allow more than one new lines)
// IMPORTANT: CRLF (\r\n) is used so that is not messed up with remark slate \n\n
const NEWLINE_TOKEN = '\r\n\r\n'

export function mdToSlate(md: string): Promise<any> {
  const parsed = fromMarkdown(md.replaceAll(NEWLINE_TOKEN, `<br>`))
  const output = parsed.children.map(v => deserialize(v as any))

  const finalSlateTree: any[] = []

  output.forEach(v => {
    const isList = get(v, 'type') === 'ul_list'
    if (isList) {
      const listChildren = get(v, 'children', [])
      const unwrapped = unwrapListItems(listChildren)
      finalSlateTree.push({
        type: 'ul_list',
        children: unwrapped,
      })
      // do not proceed
      return
    }

    // just push things as is
    finalSlateTree.push(v)
    // do notp proceed
    return
  })

  // insert empty line at the end for better editing
  // we are trimming empty lines anyway before saying
  finalSlateTree.push({
    break: true,
    type: 'paragraph',
    children: [{ text: '' }],
  })

  return new Promise(resolve => {
    resolve(finalSlateTree)
  })
}

export function slateToMd(nodes: Descendant[]): Promise<string> {
  return new Promise(resolve => {
    const parsed: string[] = []
    nodes.forEach(v => {
      // list item handling
      // wrap children inside paragraphs
      const isList = get(v, 'type') === 'ul_list'
      if (isList) {
        const listChildren = get(v, 'children', []).map((x: any) => {
          return {
            ...x,
            children: [
              {
                type: 'paragraph',
                children: get(x, 'children', []),
              },
            ],
          }
        })
        const output = serialize({
          type: 'ul_list',
          children: listChildren,
        })
        parsed.push(output || '')
        // do not proceed
        return
      }

      // dealing with remark-slate fragile code
      const isParagraph = get(v, 'type') === 'paragraph'
      // if paragraph, we will trim all the child {text: '\n'}
      if (isParagraph) {
        // @ts-ignore
        const paraChildren = v.children.filter(x => {
          const emptyLine = x && x.text && x.text === '\n'

          return !emptyLine
        })
        const output = serialize({
          type: 'paragraph',
          children: paraChildren,
        })
        parsed.push(output || '')
        // do not proceed
        return
      }

      const output = serialize(v)
      parsed.push(output || '')

      // do not proceed
      return
    })
    const finalMd = parsed.join('').replaceAll('<br>', NEWLINE_TOKEN).trim()

    return resolve(finalMd)
  })
}
