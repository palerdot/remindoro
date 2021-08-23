import { LeafNode } from 'slate-mark'

// ok; we are going to split new lines into their own 'p' tag
/*  
  text: "\n \n some text \n \n"

  will be transformed to
  - empty p tag
  - empty p tag
  - p tag with "some text"
  - empty p tag
  - empty p tag

  this will be applied for all children in p tag
*/

type PNode = {
  type: 'p'
  children: Array<LeafNode>
}

export function transformNewLines(children: Array<LeafNode>): Array<PNode> {
  const transformed: Array<PNode> = []

  children.forEach(mark => {
    console.log('porumai .... handling new line split ', mark)
    const splitted = mark.text.split('\n')
    // IMPORTANT
    // Interesting edge case
    // Each p/paragraph already has a \n (newline) ending
    // we cannot be splitting that and making again a new p tag
    // that will cyclically increase the new lines
    // so we need to deliberatly ignore the ending newline
    const TOTAL_NEWLINES_TO_IGNORE = 2
    let ENDING_NEWLINE_IGNORED = 0

    splitted.forEach(s => {
      // if empty we will push empty p tag
      const isEmpty = s.trim() === ''
      if (isEmpty) {
        // but before that
        // we will ignore the ending new line
        if (ENDING_NEWLINE_IGNORED < TOTAL_NEWLINES_TO_IGNORE) {
          // ignore ending new line
          ENDING_NEWLINE_IGNORED = ENDING_NEWLINE_IGNORED + 1
          // do not proceed to enter an empty p tag
          return
        }

        transformed.push({
          type: 'p',
          children: [{ text: '' }],
        })
      } else {
        // we will push the text with marks (bold, italic etc)
        transformed.push({
          type: 'p',
          children: [
            {
              ...mark,
              text: s,
            },
          ],
        })
      }
    })
  })

  return transformed
}
