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
  content: '<space>';
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
      {/* Inline code */}
      <div className={'shortcut'}>
        <div className={'left'}>{'Ctrl + `(backtick)'}</div>
        <div className={'right'}>{'Inline code block'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'``'}</div>
        <div className={'right'}>
          {'Starts Inline code block (2 backticks)'}
        </div>
      </div>
      {/* Code block */}
      <div className={'shortcut'}>
        <div className={'left'}>{'```'}</div>
        <div className={'right'}>{'Starts a code block (3 backticks)'}</div>
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
      <p>{'Please note this rich text editor is experimental/beta.'}</p>
    </Holder>
  )
}

export default HelpInfo
