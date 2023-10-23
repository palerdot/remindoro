import { describe, test, expect } from 'vitest'

import { cleanClosedTabs } from './index'

describe('porumai ... time tracking tests', () => {
  test('closed tabs are cleaned correctly', () => {
    const registry = {
      '1': {
        tabId: 1,
        url: 'https://remindoro.app',
        isClosed: false,
      },
      '2': {
        tabId: 2,
        url: 'https://youtube.com',
        isClosed: true,
      },
    }

    const cleaned = cleanClosedTabs(registry)
    expect(cleaned).toMatchObject({
      '1': {
        tabId: 1,
        url: 'https://remindoro.app',
        isClosed: false,
      },
    })
    // should NOT have closed tab entry
    expect(cleaned?.[2]).toBeUndefined()
  })
})
