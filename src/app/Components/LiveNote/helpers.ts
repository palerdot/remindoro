import slate, { serialize } from 'remark-slate'
import { unified } from 'unified'
import markdown from 'remark-parse'
import styled, { css } from 'styled-components'

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
    color: #aaa;
    font-style: italic;
  }

  :not(pre) > code {
    font-family: monospace;
    background-color: #eee;
    padding: 3px;
  }

  pre.codeblock {
    font-family: monospace;
    background-color: ${props => props.theme.primaryDark};
    margin: 0;
    padding: 3px;
    font-size: 0.89rem;
  }
`

export const EditorHolder = styled.div`
  ${LiveNoteStyles}
`

export function mdToSlate(
  md: string,
  callback: (value: Descendant[] | undefined) => void
) {
  unified()
    .use(markdown)
    .use(slate)
    .process(md, (err, parsed) => {
      if (err) {
        callback([])

        return
      }

      // TS compiler hacks
      callback(parsed as any)
    })
}

export function slateToMd(nodes: Descendant[]): Promise<string> {
  return new Promise(resolve => {
    const output = nodes.map(v => serialize(v)).join('')

    return resolve(output)
  })
}
