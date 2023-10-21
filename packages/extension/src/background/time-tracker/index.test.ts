import { describe, test, expect } from 'vitest'

import { isSiteTracked } from './index'

describe('porumai ... time tracker test', () => {
  test('site track check works fine', () => {
    const site = 'youtube.com'
    const url = 'https://www.youtube.com/watch?v=kQlIow000KM'

    expect(isSiteTracked({ url, site })).toBeTruthy()
  })
})
