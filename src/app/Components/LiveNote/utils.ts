import { LeafNode, SlateNode, isLeafNode } from 'slate-mark'
import { compact, last, isEmpty, slice, trimEnd } from '@lodash'
import styled, { css } from 'styled-components'

export const LiveNoteStyles = css`
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

  .slate-CodeBlockElement,
  .slate-code {
    background: ${props => props.theme.primaryDark};
    color: ${props => props.theme.textColor};
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

  // IMPORTANT: we need to calculate if incoming node has newline
  // if it has newline we need to insert next text as a new paragraph
  // if not we need to insert as existing children
  let insertNextAsNewNode = true

  children.forEach((mark, index, origChildren) => {
    let markText = mark.text

    if (markText.endsWith(`${NEWLINE_MAGIC_TOKEN}\n${NEWLINE_MAGIC_TOKEN}\n`)) {
      // remove trailing \n
      // handles one edge case where we have MARK \n MARK \n
      markText = markText.slice(0, -1)
    }

    let originalSplitted = markText.split(`${NEWLINE_MAGIC_TOKEN}\n`)

    // trim last space
    if (isEmpty(last(originalSplitted)?.replaceAll(NEWLINE_MAGIC_TOKEN, ''))) {
      originalSplitted = originalSplitted.slice(0, -1)
    }

    if (markText.endsWith(` ${NEWLINE_MAGIC_TOKEN}\n${NEWLINE_MAGIC_TOKEN}`)) {
      // markText += '\n'
      // this is for inserting a new paragraph (by 'chunkParagraphs')
      originalSplitted.push(`${NEWLINE_MAGIC_TOKEN}`)
    }

    // we will replace first empty new line with magic token
    // works fine for certain only empty lines
    if (originalSplitted[0] === '') {
      // originalSplitted[0] = NEWLINE_MAGIC_TOKEN
    }

    const multiLineSplit = chunkParagraphs(originalSplitted)

    console.log(
      'porumai ... INCOMING NEW LINE ',
      children,
      originalSplitted,
      multiLineSplit,
      mark
    )

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
            // EMPTY_LINES_IGNORE_COUNT = 0
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
      // let ENDING_NEWLINE_IGNORED = 0

      console.log(
        'porumai ... new line handling ',
        multiLineSplit,
        splitted,
        TOTAL_NEWLINES_TO_IGNORE,
        onlyEmptyLines,
        originalSplitted
      )

      splitted.forEach(s => {
        const text = s.replaceAll(NEWLINE_MAGIC_TOKEN, '')
        // const text = s

        // if empty we will push empty p tag
        // const isTextEmpty = text.trim() === ''
        const isTextEmpty = text === ''
        if (isTextEmpty) {
          // but before that
          // we will ignore the ending new line
          /* if (ENDING_NEWLINE_IGNORED < TOTAL_NEWLINES_TO_IGNORE) {
            // ignore ending new line
            ENDING_NEWLINE_IGNORED = ENDING_NEWLINE_IGNORED + 1
            // do not proceed to enter an empty p tag
            return
          } */

          console.log('porumai ... NEW LINE INSERT !!!', s, text)

          transformed.push({
            type: 'p',
            children: [{ text: '' }],
          })
        } else {
          // we will push the text with marks (bold, italic etc)
          // let us replace our new line token

          const toInsert = {
            ...mark,
            text,
          }

          if (insertNextAsNewNode) {
            // insert next node
            transformed.push({
              type: 'p',
              children: [toInsert],
            })
          } else {
            const lastItem = last(transformed)
            if (!isEmpty(lastItem)) {
              lastItem?.children.push(toInsert)
            } else {
              transformed.push({
                type: 'p',
                children: [toInsert],
              })
            }
          }
        }
      })
    })

    // update if we need to insert next node as new 'p'
    insertNextAsNewNode =
      mark.text.endsWith(`${NEWLINE_MAGIC_TOKEN}\n`) ||
      mark.text.endsWith(`${NEWLINE_MAGIC_TOKEN}`)
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
  // scan the input; identify empty/non empty words along with indexes
  const scan = input.map((word, index) => {
    return {
      empty: word === '',
      index,
    }
  })

  let indexes: Array<number> = []

  scan.forEach(word => {
    if (word.empty) {
      return
    }

    // for non empty word mark the indexes
    indexes.push(word.index)
  })

  // edge case
  // we should always take the first word (0 index)
  if (indexes[0] !== 0) {
    indexes = [0, ...indexes]
  }

  let chunked: ChunkOutput = indexes.map((index, i, arr) => {
    const nextIndex = i + 1
    const nextChunkIndex =
      nextIndex < arr.length ? indexes[nextIndex] : input.length

    return slice(input, index, nextChunkIndex)
  })

  // insert paragraph break if we have a new paragraph
  chunked = chunked.map(c => {
    const isStartNotEmpty = c[0] !== ''
    const isEndingNewLine = c[c.length - 1] === ''

    const isParagraphBreak = isStartNotEmpty && isEndingNewLine

    if (isParagraphBreak) {
      // insert an extra new line
      c.push('')
    }

    return c
  })

  return chunked
}
