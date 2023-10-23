import { describe, test, expect } from 'vitest'

import { isURLTracked } from './store/'

const sites = [
  {
    site: 'youtube.com',
    initiator: 'EXTENSION' as const,
  },
]

describe('porumai ... time tracker test', () => {
  test('site track check works fine', () => {
    const url = 'https://www.youtube.com/watch?v=kQlIow000KM'

    expect(isURLTracked({ url, sites })).toBeTruthy()
  })
})
