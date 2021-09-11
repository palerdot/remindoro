import { transformNewLines, chunkParagraphs } from './utils'

describe('New line transformation is working fine', () => {
  test('Properly splitting new lines and preserving text', () => {
    const sample_input = [
      {
        text: '\n porumai \n',
        bold: true,
      },
      {
        text: '\n patience \n',
        italic: true,
      },
    ]

    const EXPECTED = [
      {
        type: 'p',
        children: [{ text: '' }],
      },
      {
        type: 'p',
        children: [{ text: ' porumai ', bold: true }],
      },
      {
        type: 'p',
        children: [{ text: '' }],
      },

      {
        type: 'p',
        children: [{ text: '' }],
      },
      {
        type: 'p',
        children: [{ text: ' patience ', italic: true }],
      },
      {
        type: 'p',
        children: [{ text: '' }],
      },
    ]

    expect(transformNewLines(sample_input)).toMatchObject(EXPECTED)
  })
})

describe('paragraph chunking is working fine', () => {
  test('multiple paragraphs are chunked fine', () => {
    const sample_input = [
      'porumai  ',
      '',
      '',
      'amaidhi ',
      '',
      '',
      'patience ',
      '',
      '',
    ]
    const EXPECTED = [
      ['porumai  ', '', ''],
      ['amaidhi ', '', ''],
      ['patience ', '', ''],
    ]

    expect(chunkParagraphs(sample_input)).toMatchObject(EXPECTED)
  })

  test('single paragraphs are chunked fine', () => {
    const sample_input = ['porumai  ', '', '']
    const EXPECTED = [['porumai  ', '', '']]

    expect(chunkParagraphs(sample_input)).toMatchObject(EXPECTED)
  })

  test('Repeated word chunking is working fine', () => {
    const sample_input = [
      '{{porumai-wait-and-hope}}',
      '',
      'patience ',
      '',
      '',
      'patience2 ',
      '',
      '',
      'patience3 ',
      '',
      'patience ',
      '',
      '{{porumai-wait-and-hope}}',
    ]

    const EXPECTED = [
      ['{{porumai-wait-and-hope}}', ''],
      ['patience ', '', ''],
      ['patience2 ', '', ''],
      ['patience3 ', ''],
      ['patience ', ''],
      ['{{porumai-wait-and-hope}}'],
    ]

    expect(chunkParagraphs(sample_input)).toMatchObject(EXPECTED)
  })

  test('Empty new line start with Repeated word chunking is working fine', () => {
    const sample_input = [
      '',
      '',
      'patience ',
      '',
      '',
      'patience2 ',
      '',
      '',
      'patience3 ',
      '{{porumai-wait-and-hope}}',
    ]

    const EXPECTED = [
      ['', ''],
      ['patience ', '', ''],
      ['patience2 ', '', ''],
      ['patience3 '],
      ['{{porumai-wait-and-hope}}'],
    ]

    expect(chunkParagraphs(sample_input)).toMatchObject(EXPECTED)
  })
})
