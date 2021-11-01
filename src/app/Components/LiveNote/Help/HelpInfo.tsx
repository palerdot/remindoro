import React from 'react'

function HelpInfo() {
  return (
    <div>
      <h2>{'Rich Text Editor'}</h2>
      <p>
        {`Remindoro 1.x introduces an experimental Rich Text Editor. You can use icons at the top to create rich text items like bold text, italic text, ordered/unordered list items, checklist items etc. You can also use 'Markdown' like shortcuts while you type to convert normal text to rich text. Please note, text is formatted live in the editor.`}
      </p>
      <p>
        {`Markdown shortcuts you can use for rich text formattings as you type.`}
      </p>
      <div>{`**<TEXT>** - Bold`}</div>
      <div>{`*<TEXT>* - Italic`}</div>
      <div>{`~~<TEXT>~~ - Strikethrough`}</div>
      <div>{'><SPACE> - Blockquote text'}</div>
      <div>{'`<TEXT>` - inline code block'}</div>
      <div>{'``` - Starts a code block'}</div>
      <div>{`1.<SPACE> - Numbered/Ordered List`}</div>
      <div>{`-<SPACE> - Unordered List`}</div>
      <div>{`[]<SPACE> - Check List Item`}</div>
      <div>{`[x]<SPACE> - Check List Item (with checked item)`}</div>
      <div>{'# - Level 1 Heading'}</div>
      <div>{'## - Level 2 Heading'}</div>
      <div>{'### - Level 3 Heading'}</div>
      <p>{'Please note this rich text editor is experimental/beta.'}</p>
    </div>
  )
}

export default HelpInfo
