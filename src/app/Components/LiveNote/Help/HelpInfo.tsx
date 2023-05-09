import React from 'react'
import styled from 'styled-components'

const Holder = styled.div`
  & .shortcut {
    display: flex;
    padding: 8px;
    border: ${props => `thin solid ${props.theme.borderDark}`};

    .left {
      flex: 1;
      font-size: 0.89rem;
    }

    .right {
      flex: 2;
    }
  }
`

const Spacer = styled.span`
  font-size: 0.75rem;
  font-style: italic;
  margin: 0 4px;

  &::after {
    content: '<space>';
  }
`

function HelpInfo() {
  return (
    <Holder>
      <h2>{'Rich Text Editor'}</h2>
      <p>
        {`Remindoro 1.x introduces an experimental Rich Text Editor. You can use icons at the top to create rich text items like bold text, italic text, ordered/unordered list items, checklist items etc. You can also use 'Markdown' like shortcuts while you type to convert normal text to rich text. Please note, text is formatted live in the editor.`}
      </p>
      <p>
        {`Markdown shortcuts you can use for rich text formattings as you type.`}
      </p>
      {/* Bold */}
      <div className={'shortcut'}>
        <div className={'left'}>{`Ctrl/Cmd + b`}</div>
        <div className={'right'}>{'Bold'}</div>
      </div>
      {/* Italic */}
      <div className={'shortcut'}>
        <div className={'left'}>{`Ctrl/Cmd + i`}</div>
        <div className={'right'}>{'Italic'}</div>
      </div>
      {/* Underscore */}
      <div className={'shortcut'}>
        <div className={'left'}>{`Ctrl/Cmd + u`}</div>
        <div className={'right'}>{'Underline'}</div>
      </div>
      {/* Headings */}
      <div className={'shortcut'}>
        <div className={'left'}>
          {'#'}
          <Spacer />
        </div>
        <div className={'right'}>{'Level 1 Heading'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>
          {'##'}
          <Spacer />
        </div>
        <div className={'right'}>{'Level 2 Heading'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>
          {'###'}
          <Spacer />
        </div>
        <div className={'right'}>{'Level 3 Heading'}</div>
      </div>
      {/* Blockquote */}
      <div className={'shortcut'}>
        <div className={'left'}>
          {'>'}
          <Spacer />
        </div>
        <div className={'right'}>{'Blockquote text'}</div>
      </div>
      {/* Unordered list */}
      <div className={'shortcut'}>
        <div className={'left'}>
          {'-'}
          <Spacer />
        </div>
        <div className={'right'}>{'Unordered List'}</div>
      </div>
      {/* Numbered list */}
      <div className={'shortcut'}>
        <div className={'left'}>
          {'1.'}
          <Spacer />
        </div>
        <div className={'right'}>{'Numbered List'}</div>
      </div>
      <p>
        {
          'Press double enter inside codeblock to exit codeblock. Press Shift + Enter, inside codeblock/quote block to insert new lines.'
        }
      </p>
      <p>{'Please note this rich text editor is experimental/beta.'}</p>
    </Holder>
  )
}

export default HelpInfo
