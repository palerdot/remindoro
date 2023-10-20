import browser from 'webextension-polyfill'

// START: Init time tracking
export function init_time_tracking() {
  init_tab_activated()
  init_tab_updated()
  init_tab_removed()
}
// END: Init time tracking

function init_tab_activated() {
  function handleActivated(activeInfo: browser.Tabs.OnActivatedActiveInfoType) {
    console.log(`Tab ${activeInfo.tabId} was activated`, activeInfo)
  }

  browser.tabs.onActivated.addListener(handleActivated)
}

function init_tab_updated() {
  function handleUpdated(
    tabId: number,
    changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
    tabInfo: browser.Tabs.Tab
  ) {
    console.log('porumai ... tab change ', changeInfo, tabInfo, tabId)
    if (changeInfo.url) {
      console.log(`Tab: ${tabId} URL changed to ${changeInfo.url}`)
    }
  }

  browser.tabs.onUpdated.addListener(handleUpdated)
}

function init_tab_removed() {
  function handleRemoved(
    tabId: number,
    removeInfo: browser.Tabs.OnRemovedRemoveInfoType
  ) {
    console.log(`Tab: ${tabId} is closing`)
    browser.tabs
      .get(tabId)
      .then(tab => {
        console.log('porumai ... closed tab details ', tab)
      })
      .catch(e => {
        console.log('error getting tab details ', e)
      })
    console.log(`Window ID: ${removeInfo.windowId}`, removeInfo)
    console.log(`Window is closing: ${removeInfo.isWindowClosing}`)
  }

  browser.tabs.onRemoved.addListener(handleRemoved)
}
