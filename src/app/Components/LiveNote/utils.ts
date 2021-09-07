import { LeafNode, SlateNode, isLeafNode } from 'slate-mark'
import { compact, last, isEmpty, findIndex, slice } from '@lodash'
import styled, { css } from 'styled-components'

export const LiveNoteStyles = css`
  .slate-li {
    & .slate-p {
      padding: 0;
    }
  }
`

export const EditorHolder = styled.div`
  ${LiveNoteStyles}
`

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

// we will replace new line with this MAGIC STRING
// if someone enters content that matches this MAGIC STRING
// it will disappear !!!
export const NEWLINE_MAGIC_TOKEN = '{{porumai-wait-and-hope}}'

export function transformNewLines(children: Array<LeafNode>): Array<PNode> {
  const transformed: Array<PNode> = []

  children.forEach((mark, index, origChildren) => {
    let originalSplitted = mark.text.split(`${NEWLINE_MAGIC_TOKEN}\n`)

    // trim last space
    if (isEmpty(last(originalSplitted))) {
      originalSplitted = originalSplitted.slice(0, -1)
    }

    const multiLineSplit = chunkParagraphs(originalSplitted)

    multiLineSplit.forEach(splitted => {
      // track ignore count
      let EMPTY_LINES_IGNORE_COUNT = 1
      let NON_EMPTY_LINES_IGNORE_COUNT = 0

      // edge case:
      // we may deal with only empty lines or content + empty lines
      // if content + empty lines; we may have to ignore new lines (see below)
      const onlyEmptyLines =
        splitted.join('').replaceAll(NEWLINE_MAGIC_TOKEN, '').trim() === ''

      if (onlyEmptyLines) {
        EMPTY_LINES_IGNORE_COUNT = 1
      }
      /* else {
        // edge case
        // if it is a line with first element as non empty
        // and rest of the lines are empty
        const first = head(splitted) || ''
        const rest = tail(splitted)

        if (first.endsWith(' ') && isEmpty(compact(rest))) {
          NON_EMPTY_LINES_IGNORE_COUNT = 1
        }
      } */

      const hasEmptySpaces = onlyEmptyLines && compact(splitted).length > 0

      if (hasEmptySpaces) {
        EMPTY_LINES_IGNORE_COUNT = 0

        // one more edge case; we need to check if previous line is a mark
        const prevLine = origChildren[index - 1]

        if (prevLine) {
          const isBold = prevLine.bold === true
          const isItalic = prevLine.italic === true
          const isStrikeThrough = prevLine.strikethrough === true
          const isInlineCode = prevLine.code === true
          const isPrevLineMark =
            isBold || isItalic || isStrikeThrough || isInlineCode

          if (isPrevLineMark) {
            EMPTY_LINES_IGNORE_COUNT = 1
          }
        }
      }

      // IMPORTANT
      // Interesting edge case
      // Each p/paragraph already has a \n (newline) ending
      // we cannot be splitting that and making again a new p tag
      // that will cyclically increase the new lines
      // so we need to deliberatly ignore the ending newline

      const TOTAL_NEWLINES_TO_IGNORE = onlyEmptyLines
        ? EMPTY_LINES_IGNORE_COUNT
        : // : 1
          NON_EMPTY_LINES_IGNORE_COUNT // 0
      let ENDING_NEWLINE_IGNORED = 0

      console.log(
        'porumai ... new line split ',
        splitted,
        TOTAL_NEWLINES_TO_IGNORE,
        children,
        originalSplitted
      )

      splitted.forEach(s => {
        const text = s.replaceAll(NEWLINE_MAGIC_TOKEN, '')

        // if empty we will push empty p tag
        const isEmpty = text.trim() === ''
        if (isEmpty) {
          // we will ignore empty spaces ??? ' '
          /* if (text !== '') {
        return
      } */

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
          // let us replace our new line token
          transformed.push({
            type: 'p',
            children: [
              {
                ...mark,
                text,
              },
            ],
          })
        }
      })
    })
  })

  return transformed
}

// drill down the nodes till we reach the leaf node
// if we reach leaf node transform the text by removing our new line modifiers
// have a limit so that we don't loop infinitely
export function drillTillLeaf(node: SlateNode): SlateNode {
  const children = node.children.map(n1 => {
    // if leaf node we will transform the text
    if (isLeafNode(n1)) {
      return {
        ...n1,
        text: n1.text.replaceAll(NEWLINE_MAGIC_TOKEN, ''),
      }
    }

    // we are not in the leaf node
    // we have to do further drilling
    return drillTillLeaf(n1)
  })

  return {
    ...node,
    children,
  }
}

// chunk lines
// if multiple paragraphs are inside a single 'p' tag
// we have to split for better whitespace handling
// for eg: if three lines are clumped in a single node
// INPUT: ["porumai  ", "", "", "amaidhi ", "", "", "patience ", "", ""]
// OUTPUT: [ ["porumai  ", "", ""], ["amaidhi ", "", ""], ["patience ", "", ""] ]
//
// INPUT: ["porumai  ", "", "", ""]
// OUTPUT: [ ["porumai  ", "", "", ""] ]
type ChunkInput = Array<string>
type ChunkOutput = Array<ChunkInput>

export function chunkParagraphs(input: ChunkInput): ChunkOutput {
  const cleaned = compact(input)
  const indexes = cleaned.map(x => {
    return findIndex(input, i => i === x)
  })

  const chunked: ChunkOutput = indexes.map((index, i, arr) => {
    const nextIndex = i + 1
    const nextChunkIndex =
      nextIndex < arr.length ? indexes[nextIndex] : input.length

    return slice(input, index, nextChunkIndex)
  })

  return chunked
}
