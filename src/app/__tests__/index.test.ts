import {
  transformActionItems,
  handleExtraMdParse,
} from '@app/Components/LiveNote/transformers'

const UNPARSED_ACTION_ITEM = {
  type: 'p',
  children: [
    {
      text: '[ ] porumai\n[x] amaidhi\n[ ] patience\n \n \n ',
    },
  ],
}

const PARSED_ACTION_ITEM = [
  {
    type: 'action_item',
    children: [
      {
        text: '[ ] porumai\n',
      },
    ],
  },
  {
    type: 'action_item',
    children: [
      {
        text: '[x] amaidhi\n',
      },
    ],
    checked: true,
  },
  {
    type: 'action_item',
    children: [
      {
        text: '[ ] patience\n \n \n ',
      },
    ],
  },
]

describe('parseMd correctly parses action item', () => {
  test('action item is correctly parsed', () => {
    const sample_input = UNPARSED_ACTION_ITEM.children[0]

    expect(transformActionItems(sample_input)).toMatchObject(PARSED_ACTION_ITEM)
  })
})

describe('Nodes are parsed correctly', () => {
  test('Nodes without action item are correctly parsed', () => {
    const sample_input = [
      {
        type: 'p',
        children: [
          {
            text: 'porumai',
          },
        ],
      },
      {
        type: 'blockquote',
        children: [
          {
            text: 'porumai',
          },
        ],
      },
    ]

    expect(sample_input).toMatchObject(handleExtraMdParse(sample_input))
  })

  test('Nodes WITH action item are correctly parsed', () => {
    const NORMAL_NODES = [
      {
        type: 'p',
        children: [
          {
            text: 'porumai',
          },
        ],
      },
      {
        type: 'blockquote',
        children: [
          {
            text: 'porumai',
          },
        ],
      },
    ]

    const sample_input = [...NORMAL_NODES, UNPARSED_ACTION_ITEM]

    const EXPECTED = [...NORMAL_NODES, ...PARSED_ACTION_ITEM]

    expect(handleExtraMdParse(sample_input)).toMatchObject(EXPECTED)
  })
})
