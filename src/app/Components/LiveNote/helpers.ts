import styled, { css } from 'styled-components'
import { SLITE_EDITOR_CONTAINER_CLASS } from 'react-slite'

export const LiveNoteStyles = css`
  .${SLITE_EDITOR_CONTAINER_CLASS} {
    margin-top: 0;
    margin-bottom: 0;

    & .toolbar {
      padding: 4px;
    }

    .toolbar button.toolbar-item {
      padding: 4px;
    }

    .toolbar i.chevron-down.inside {
      margin-top: 6px;
    }

    .toolbar select.toolbar-item {
      padding: 4px;
    }
  }

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

  // p[data-slate-node='element']:first-child span[data-slate-string='true'] {
  p[data-slate-node='element'] span[data-slate-string='true'] {
    line-height: 1.89rem;
  }

  p[data-slate-node='element']:first-child {
    margin-bottom: 0.5rem;
  }

  p[data-slate-node='element']:not(:first-child) {
    margin-top: 0;
  }

  .thematic_break {
    border-top: ${props => `thin solid ${props.theme.primaryLight}`};
    padding-top: 4px;
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
