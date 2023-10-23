import browser from 'webextension-polyfill'

import {
  updateWebSession,
  handleActivatedTab,
  handleClosedTab,
} from '@background/time-tracker/store'

import type { TabInfo } from '@background/time-tracker/tab-registry'

// START: Init time tracking
export function init_time_tracking() {
  init_tab_activated()
  init_tab_updated()
  init_tab_removed()
}
// END: Init time tracking

function init_tab_activated() {
  function handleActivated(activeInfo: browser.Tabs.OnActivatedActiveInfoType) {
    handleActivatedTab(activeInfo.tabId)
  }

  browser.tabs.onActivated.addListener(handleActivated)
}

function init_tab_updated() {
  function handleUpdated(
    tabId: number,
    changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
    _tabInfo: browser.Tabs.Tab
  ) {
    if (changeInfo.url) {
      // update web session whenever there is a change in the url
      // registry is automatically updated with the tabinfo
      const tab_info: TabInfo = {
        tabId,
        url: changeInfo.url,
        title: changeInfo.title,
        isClosed: false,
      }
      updateWebSession(tab_info)
    }
  }

  browser.tabs.onUpdated.addListener(handleUpdated)
}

function init_tab_removed() {
  function handleRemoved(
    tabId: number,
    _removeInfo: browser.Tabs.OnRemovedRemoveInfoType
  ) {
    handleClosedTab(tabId)
  }

  browser.tabs.onRemoved.addListener(handleRemoved)
}
