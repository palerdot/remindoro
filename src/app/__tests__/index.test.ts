import {
  transformActionItems,
  handleExtraMdParse,
} from '@app/Components/LiveNote/transformers'

const UNPARSED_ACTION_ITEM = {
  type: 'p',
  children: [
    {
      text: '[ ] porumai\n[x] amaidhi\n[ ] patience\n',
    },
  ],
}

const PARSED_ACTION_ITEM = [
  {
    type: 'action_item',
    children: [
      {
        text: 'porumai',
      },
    ],
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'amaidhi',
      },
    ],
    checked: true,
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'patience',
      },
    ],
  },
]

describe('parseMd correctly parses action item', () => {
  test('action item is correctly parsed', () => {
    const sample_input = UNPARSED_ACTION_ITEM.children[0]

    expect(transformActionItems(sample_input)).toMatchObject(PARSED_ACTION_ITEM)
  })

  test('action item with ending new lines are parsed correctly', () => {
    const sample_input = {
      text: UNPARSED_ACTION_ITEM.children[0].text + '  \n  \n',
    }

    const EXPECTED = [
      ...PARSED_ACTION_ITEM,
      {
        type: 'p',
        children: [
          {
            text: '  \n',
          },
        ],
      },
      {
        type: 'p',
        children: [
          {
            text: '  \n',
          },
        ],
      },
    ]

    expect(transformActionItems(sample_input)).toMatchObject(EXPECTED)
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

  test('Nodes WITH action item (with blank lines) are correctly parsed', () => {
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

    const action_items = {
      type: 'p',
      children: [
        { text: ' ' },
        { text: '' },
        {
          text: '[ ] porumai\n[x] amaidhi\n[ ] patience\n',
        },
      ],
    }

    const expected_action_items = [
      {
        type: 'p',
        children: [{ text: ' ' }],
      },
      {
        type: 'p',
        children: [{ text: '' }],
      },
      ...PARSED_ACTION_ITEM,
    ]

    const sample_input = [...NORMAL_NODES, action_items]
    const EXPECTED = [...NORMAL_NODES, ...expected_action_items]

    expect(handleExtraMdParse(sample_input)).toMatchObject(EXPECTED)
  })
})
