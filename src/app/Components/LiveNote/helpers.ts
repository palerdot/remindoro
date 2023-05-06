import styled, { css } from 'styled-components'
import { SLITE_EDITOR_CONTAINER_CLASS } from 'react-slite'

export const LiveNoteStyles = css`
  .${SLITE_EDITOR_CONTAINER_CLASS} {
    background: ${props => props.theme.background};
    color: ${props => props.theme.textColor};

    margin-top: 0;
    margin-bottom: 0;

    & .editor-inner {
      background: ${props => props.theme.background};
      color: ${props => props.theme.textColor};

      & .editor-input {
        caret-color: ${props => props.theme.textColor};
      }
    }

    & .toolbar {
      background: ${props => props.theme.background};
      color: ${props => props.theme.textColor};

      padding: 4px 8px;
    }

    .toolbar button.toolbar-item {
      color: ${props => props.theme.textColor};

      border-radius: 1px;
      padding: 4px;
    }

    .toolbar select.toolbar-item,
    .block-controls {
      background-color: ${props => props.theme.primaryDark};
      color: ${props => props.theme.textColor};

      border-radius: 4px;
      padding: 4px;
    }

    .toolbar .block-controls {
      & .text {
        color: ${props => props.theme.textColor};
      }
    }

    .toolbar button.toolbar-item.active {
      background-color: ${props => props.theme.backgroundLight};
      color: ${props => props.theme.highlight};
    }

    .toolbar .toolbar-item:hover:not([disabled]) {
      background-color: ${props => props.theme.primary};
    }

    .toolbar i.chevron-down.inside {
      margin-top: 6px;
    }

    /* heading */
    .editor-heading-h1,
    .editor-heading-h2,
    .editor-heading-h3 {
      color: ${props => props.theme.primaryLight};
    }

    /* divider */
    .toolbar .divider {
      width: 1px;
      background-color: ${props => props.theme.primaryDark};
      margin: 0 4px;
    }

    /* paragraph */
    .editor-paragraph {
      margin-top: 1px;
      margin-bottom: 1px;
    }

    /* inline code */
    .editor-text-code {
      font-family: monospace;
      background-color: ${props => props.theme.primaryDark};
      color: ${props => props.theme.textColor};
      padding: 3px;

      font-size: 89%;
    }

    /* quote block */
    .editor-quote {
      border-left: ${props => `4px solid ${props.theme.primaryLight}`};
      margin: 1.314rem 0;
      color: ${props => props.theme.primaryLight};
      font-style: italic;
    }
  }

  &.readonly {
    pointer-events: none;
  }
`

export const EditorHolder = styled.div`
  ${LiveNoteStyles}
`
