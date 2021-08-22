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
    const splitted = mark.text.split('\n')
    splitted.forEach(s => {
      // if empty we will push empty p tag
      const isEmpty = s.trim() === ''
      if (isEmpty) {
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
