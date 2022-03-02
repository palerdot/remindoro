import slate, { serialize, deserialize } from 'remark-slate'
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

export function mdToSlate(md: string): Promise<any> {
  const parsed = fromMarkdown(md)
  const output = parsed.children.map(v => deserialize(v as any))

  return new Promise(resolve => {
    resolve(output)
  })
}

export function slateToMd(nodes: Descendant[]): Promise<string> {
  return new Promise(resolve => {
    const output = nodes
      .map(v => {
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
          return serialize({
            type: 'ul_list',
            children: listChildren,
          })
        }

        const output = serialize(v)
        return output || ''
      })
      .join('')

    return resolve(output)
  })
}

export function porumaiMd(doc: string) {
  const parsed = fromMarkdown(doc)
  const output = parsed.children.map(v => deserialize(v as any))

  console.log('porumai ... porumai md ', output, doc)
}
