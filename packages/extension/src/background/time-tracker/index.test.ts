import { describe, test, expect } from 'vitest'

import { urlTrackingStatus, siteIdFromHost } from './store/'

const sites = [
  {
    site: 'youtube.com',
    initiator: 'EXTENSION' as const,
    has_background_activity: true,
  },
  {
    site: 'news.ycombinator.com',
    initiator: 'EXTENSION' as const,
    has_background_activity: false,
  },
]

describe('porumai ... time tracker test', () => {
  test('site id from host', () => {
    expect(siteIdFromHost('www.youtube.com')).toBe('youtube.com')
    expect(siteIdFromHost('youtube.com')).toBe('youtube.com')
  })
})

describe('url tracking works fine', () => {
  test('tracked site with background activity', () => {
    const url = 'https://www.youtube.com/watch?v=kQlIow000KM'
    const { isURLTracked, has_background_activity } = urlTrackingStatus({
      url,
      sites,
    })

    expect(isURLTracked).toBeTruthy()
    expect(has_background_activity).toBeTruthy()
  })

  test('tracked site with no background activity', () => {
    const url = 'https://news.ycombinator.com/submitted?id=whoishiring'
    const { isURLTracked, has_background_activity } = urlTrackingStatus({
      url,
      sites,
    })

    expect(isURLTracked).toBeTruthy()
    expect(has_background_activity).toBeFalsy()
  })

  test('Non tracked sites works', () => {
    const { isURLTracked, has_background_activity } = urlTrackingStatus({
      url: '',
      sites,
    })

    expect(isURLTracked).toBeFalsy()
    expect(has_background_activity).toBeFalsy()
  })
})
