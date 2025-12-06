import styled from '@emotion/styled'
import { SLITE_EDITOR_CONTAINER_CLASS } from 'react-slite'

export const EditorHolder = styled.div`
  .${SLITE_EDITOR_CONTAINER_CLASS} {
    background: ${props => props.theme.palette.background.paper};
    color: ${props => props.theme.palette.text.primary};

    margin-top: 0;
    margin-bottom: 0;

    & .editor-inner {
      min-height: 100%;

      background: ${props => props.theme.palette.background.paper};
      color: ${props => props.theme.palette.text.primary};

      & .editor-input {
        color: ${props => props.theme.palette.text.primary};
        caret-color: ${props => props.theme.palette.text.primary};
      }
    }

    & .toolbar {
      background: ${props => props.theme.palette.background.paper};
      color: ${props => props.theme.palette.text.primary};

      padding: 4px 8px;
    }

    .toolbar button.toolbar-item {
      color: ${props => props.theme.palette.primary.main};

      border-radius: 1px;
      padding: 4px;
    }

    .toolbar select.toolbar-item,
    .block-controls {
      background-color: ${props => props.theme.palette.primary.main};
      color: ${props => props.theme.palette.primary.contrastText};

      border-radius: 4px;
      padding: 4px;
    }

    .toolbar .block-controls {
      & .text,
      .icon,
      i {
        color: ${props => props.theme.palette.primary.contrastText};
      }
    }

    .toolbar button.toolbar-item.active {
      background-color: ${props => props.theme.palette.background.default};
      color: ${props => props.theme.palette.secondary.main};
    }

    .toolbar .toolbar-item:hover:not([disabled]) {
      background-color: ${props => props.theme.palette.primary.main};
      color: ${props => props.theme.palette.primary.contrastText};
    }

    .toolbar i.chevron-down.inside {
      margin-top: 6px;
    }

    /* heading */
    .editor-heading-h1,
    .editor-heading-h2,
    .editor-heading-h3 {
      color: ${props => props.theme.palette.primary.main};
    }

    /* link */
    .editor-link {
      color: ${props => props.theme.palette.primary.main};
    }

    /* divider */
    .toolbar .divider {
      width: 1px;
      background-color: ${props => props.theme.palette.divider};
      margin: 0 4px;
    }

    /* inline code */
    .editor-text-code {
      font-family: monospace;
      background-color: ${props => props.theme.palette.primary.main};
      color: ${props => props.theme.palette.primary.contrastText};
      padding: 3px;

      font-size: 89%;
    }

    /* quote block */
    .editor-quote {
      border-left: ${props => `4px solid ${props.theme.palette.grey[400]}`};
      margin: 1.314rem 0;
      color: ${props => props.theme.palette.text.primary};
      font-style: italic;
    }
  }

  &.readonly {
    pointer-events: none;
  }
`
