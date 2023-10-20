import { describe, test, expect } from 'vitest'

import { updateRegistry, cleanClosedTabs, TabInfo, RegistryInfo } from './index'

describe('porumai ... time tracking tests', () => {
  test('registry is updated correctly with empty registry', () => {
    const tabInfo: TabInfo = {
      tabId: 1,
      url: 'https://remindoro.app',
      isClosed: false,
    }
    const first_pass = {
      1: tabInfo,
    }

    expect(updateRegistry(undefined, tabInfo)).toMatchObject(first_pass)

    const updatedTab: TabInfo = {
      ...tabInfo,
      url: 'https://youtube.com',
    }

    const updatedRegistry = updateRegistry(first_pass, updatedTab)
    expect(updatedRegistry[tabInfo.tabId]?.url).toBe('https://youtube.com')
  })

  test('closed tabs are cleaned correctly', () => {
    const registry: RegistryInfo = {
      1: {
        tabId: 1,
        url: 'https://remindoro.app',
        isClosed: false,
      },
      2: {
        tabId: 2,
        url: 'https://youtube.com',
        isClosed: true,
      },
    }

    const cleaned = cleanClosedTabs(registry)
    expect(cleaned).toMatchObject({
      1: {
        tabId: 1,
        url: 'https://remindoro.app',
        isClosed: false,
      },
    })
    // should NOT have closed tab entry
    expect(cleaned?.[2]).toBeUndefined()
  })
})
