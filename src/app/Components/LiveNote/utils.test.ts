import { transformNewLines } from './utils'

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
