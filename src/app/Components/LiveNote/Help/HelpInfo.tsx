import React from 'react'
import styled from 'styled-components'

const Holder = styled.div`
  & .shortcut {
    display: flex;
    margin: 8px 0;

    .left {
      flex: 1;
    }

    .right {
      flex: 2;
    }
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
      <div className={'shortcut'}>
        <div className={'left'}>{`**<TEXT>**`}</div>
        <div className={'right'}>{'Bold'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'*<TEXT>*'}</div>
        <div className={'right'}>{'Italic'}</div>
      </div>

      <div className={'shortcut'}>
        <div className={'left'}>{'~~<TEXT>~~'}</div>
        <div className={'right'}>{'Strikethrough'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'><SPACE>'}</div>
        <div className={'right'}>{'Blockquote text'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'`<TEXT>`'}</div>
        <div className={'right'}>{'Inline code block'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'```'}</div>
        <div className={'right'}>{'Starts a code block'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'1.<SPACE>'}</div>
        <div className={'right'}>{'Numbered/Ordered List'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'-<SPACE>'}</div>
        <div className={'right'}>{'Unordered List'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'[]<SPACE>'}</div>
        <div className={'right'}>{'Check List Item'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'[x]<SPACE>'}</div>
        <div className={'right'}>{'Check List Item (with checked item)'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'#'}</div>
        <div className={'right'}>{'Level 1 Heading'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'##'}</div>
        <div className={'right'}>{'Level 2 Heading'}</div>
      </div>
      <div className={'shortcut'}>
        <div className={'left'}>{'###'}</div>
        <div className={'right'}>{'Level 3 Heading'}</div>
      </div>
      <p>{'Please note this rich text editor is experimental/beta.'}</p>
    </Holder>
  )
}

export default HelpInfo
