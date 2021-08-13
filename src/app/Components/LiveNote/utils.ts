import { Node } from 'slate'
import { unified } from 'unified'
import markdown from 'remark-parse'
import stringify from 'remark-stringify'
import slate, { serialize } from 'remark-slate'
import { remarkToSlate, slateToRemark } from 'remark-slate-transformer'
import {
  serializeHTMLFromNodes,
  SPEditor,
  createBasicElementPlugins,
  withDeserializeAst,
} from '@udecode/plate'
import TurndownService from 'turndown'

import { plugins } from './options'

const turndownService = new TurndownService({
  codeBlockStyle: 'fenced',
})

// ref: https://github.com/inokawa/remark-slate-transformer/blob/master/stories/playground-current.stories.tsx

const toSlateProcessor = unified().use(markdown).use(remarkToSlate)

/* export const toSlate = (s: string) => {
  const output = toSlateProcessor.processSync('porumai').result as Node[]
  console.log('porumai ... to slate ', s, output)
  return output
} */

/* export const toSlate = (editor: SPEditor, s: string) => {
  return deserializeMD(editor, s)
} */

// export const toMd = (value: Array<Node>) => {}
/* export const toMd = (value: any) => {
  return value.map((v: any) => serialize(v)).join('\n')
} */

/*  

const lazyUpdate = useMemo(
    () =>
      // IMPORTANT: `remark-slate` has imperfect types
      // ref: https://github.com/hanford/remark-slate/issues/25
      // once we have correct types, we can type this properly
      debounce(updatedPlateNote => {
        const updatedNote = toMd(updatedPlateNote)

        console.log('porumai ... udpated note ', updatedNote, updatedPlateNote)

        if (isEqual(updatedNote, note)) {
          // do not proceed
          return
        }

        dispatch(
          updateNote({
            id,
            value: updatedNote,
          })
        )
      }, 2500),
      [id, dispatch, note]
    )

    const initialValue = useMemo(() => {
    if (isEmpty(note.trim())) {
      // ref: https://github.com/ianstormtaylor/slate/issues/713
      return [{ type: 'paragraph', children: [{ text: '' }] }]
    }
    return deserializeMD(editor, note)
  }, [editor, note])

*/

const toRemarkProcessor: any = unified().use(slateToRemark).use(stringify)

export const toHTML = (editor: SPEditor, nodes: Array<Node>) => {
  return serializeHTMLFromNodes(editor, {
    nodes,
    // plugins: FORMATING_PLUGINS,
    plugins,
  })
}

export const toMd = (html: string) => {
  return turndownService.turndown(html)
}

/* export const toMd = (value: any) => {
  // return value.map((v: any) => serialize(v)).join('\n')

  const mdast = toRemarkProcessor.runSync({
    type: 'root',
    children: value,
  })
  return toRemarkProcessor.stringify(mdast)
} */
