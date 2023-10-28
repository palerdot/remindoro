import browser from 'webextension-polyfill'

import {
  updateWebSession,
  handleActivatedTab,
  handleClosedTab,
  timeTrackerAlarmHandler,
  timeTrackerSyncHandler,
  TabInfo,
} from '@background/time-tracker/store'

export const TIME_TRACKER_SYNC_ALARM = 'TIME_TRACKER_SYNC_ALARM'
export { timeTrackerAlarmHandler, timeTrackerSyncHandler }

// START: Init time tracking
export function init_time_tracking() {
  init_tab_events()
}

function init_tab_events() {
  init_tab_activated()
  init_tab_updated()
  init_tab_removed()
}
// END: Init time tracking

function init_tab_activated() {
  function handleActivated(activeInfo: browser.Tabs.OnActivatedActiveInfoType) {
    handleActivatedTab({
      tabId: activeInfo.tabId,
      windowId: activeInfo.windowId,
    })
  }

  browser.tabs.onActivated.addListener(handleActivated)
}

function init_tab_updated() {
  function handleUpdated(
    tabId: number,
    changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
    tabInfo: browser.Tabs.Tab
  ) {
    if (changeInfo.url) {
      // update web session whenever there is a change in the url
      // registry is automatically updated with the tabinfo
      const tab_info: TabInfo = {
        tabId,
        windowId: tabInfo.windowId,
        url: changeInfo.url,
        title: changeInfo.title,
        isClosed: false,
      }
      updateWebSession(tab_info)
    } else if (changeInfo.status === 'complete' && tabInfo.url) {
      // another scenarios where tab has finished loading with an url
      const tab_info: TabInfo = {
        tabId,
        windowId: tabInfo.windowId,
        url: tabInfo.url,
        title: tabInfo.title,
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
    removeInfo: browser.Tabs.OnRemovedRemoveInfoType
  ) {
    handleClosedTab({
      tabId,
      windowId: removeInfo.windowId,
    })
  }

  browser.tabs.onRemoved.addListener(handleRemoved)
}
