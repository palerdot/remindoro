import browser from 'webextension-polyfill'

import type { RootState } from '@app/Store/'

import packageInfo from '@package-info'
import { ALARM_KEY, STORAGE_KEY, ContextMenuKeys } from '@app/Constants'
import { migrate_v0_data_to_v1, getTodoCount, setBadgeText } from './utils/'
import { notify, Notification } from './utils/notification'
import { handle_context_menu } from './utils/context-menu'
import {
  init_time_tracking,
  timeTrackerAlarmHandler,
  timeTrackerSyncHandler,
  TIME_TRACKER_SYNC_ALARM,
} from '@background/time-tracker/'

const { version } = packageInfo

export const WHATS_NEW = ['Todo Notes ✅', 'Rich Text Editor Improvements']
export const WHATS_UP = ['Folder Support', 'Sync Support']

/*
 * ref: https://github.com/mozilla/webextension-polyfill
 */

/*
 * Install Events
 */

browser.runtime.onInstalled.addListener(initialize_install_events)

function initialize_install_events(
  details: browser.Runtime.OnInstalledDetailsType
) {
  // ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onInstalled
  // ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/OnInstalledReason
  // run only if extension is installed or updated
  const BROWSER_UPDATE_REASONS = ['browser_update', 'chrome_update']
  if (BROWSER_UPDATE_REASONS.includes(details.reason)) {
    // do not run init events
    return
  }

  console.log('initing install events ', version)
  // migrating v0.x => v1.x data
  // mostly harmless migration - removing unwanted keys
  // we don't have to wait for migration - fire and forget!!!
  // also we will not repeatedly migrate if we are already in v1.x
  // we will be checking for 'version' key which is present in v.1.x
  migrate_v0_data_to_v1()

  // welcome message
  const welcome_message = {
    id: 'welcome-message',
    title: `Hello from Remindoro - ${version} !`,
    note: `What's New: ${WHATS_NEW[0]}. Welcome to new refreshed Remindoro! You can now set one-time/repeatable reminders (with markdown support) for stuffs that matter to you ...`,
  }

  notify(welcome_message)
}

/*
 * Init Background tasks
 *
 * Important: this file is called only once during initial load
 * repeated tasks are set via timer/alarm setup
 * It is important to fetch fresh data from local storage inside
 * alarm callbacks like 'browser.alarms.onAlarm.addListener'
 * passing data via arguments to the parent function will result in
 * stale closure and will lead to browser storage bugs
 *
 * init_extension_events() - called once, sets up alarm which is called every minute. The callback for alarm listener is called every minute and this needs to have fresh data
 * init_context_menus - called once
 */

init_extension_events()
init_context_menus()
init_time_tracking()

async function getLocalStorageData() {
  const data = await browser.storage.local.get(STORAGE_KEY)

  return data[STORAGE_KEY] as RootState
}

function init_extension_events() {
  init_alarms()
  show_todo_badge()
}

/*
 * Show Todo Badge
 */
async function show_todo_badge() {
  try {
    const remindoroData = await getLocalStorageData()
    const remindoros = remindoroData.remindoros

    const status = getTodoCount(remindoros)
    const text = status >= 1 ? `${status}` : ''
    setBadgeText(text)
  } catch (e) {
    // probably error fetching local storage data
  }
}

/*
 * Show alarms
 */

function init_alarms() {
  // OFFLINE NOTES/Time tracker offline handler ALARM
  browser.alarms.create(ALARM_KEY, {
    delayInMinutes: 0.1,
    periodInMinutes: 1,
  })

  // Timer tracker sync handler alarm
  browser.alarms.create(TIME_TRACKER_SYNC_ALARM, {
    delayInMinutes: 0.5,
    periodInMinutes: 1,
  })

  browser.alarms.onAlarm.addListener(async alarmInfo => {
    // For now, we are using the same 1 minute alarm for all background related tasks
    switch (alarmInfo.name) {
      case ALARM_KEY: {
        offlineNotesAlarmHandler()
        await timeTrackerAlarmHandler()

        return
      }

      case TIME_TRACKER_SYNC_ALARM: {
        await timeTrackerSyncHandler()

        return
      }

      default:
        return
    }
  })
}

/*
 * Alarm handler for remindoros
 */

// listen for the alarm
// and dig the remindoros from local chrome extension storage and check if we need to show any notifications
// IMPORTANT: fetch data FRESH from the local storage on alarm callback
// passing data as argument will result in stale closure and will reset the data to initial data
// when the browser was opened!!!
async function offlineNotesAlarmHandler() {
  // here we can handle alarm
  try {
    const remindoroData = await getLocalStorageData()

    let showNotification: boolean | undefined =
      remindoroData.settings.notificationsEnabled

    // edge case: if we don't have the config defined by default we will show notification
    if (showNotification === undefined) {
      showNotification = true
    }

    // handle notifications
    const notification = new Notification(
      remindoroData.remindoros,
      showNotification
    )
    const updatedRemindoros = notification.scan()
    // let us notify
    notification.notify()
    // and update stuffs to store
    // IMPORTANT: we are not emitting event to the open popup
    // to indicate that remindoro time are updated in background
    // for now, we are allowing people to focus in the open popup
    notification.updateStore(updatedRemindoros)
  } catch (e) {
    // some error fetching remindoro data
  }
}

/*
 * Init context menus
 */

browser.contextMenus.onClicked.addListener(handle_context_menu)

function init_context_menus() {
  // creating a page context menu
  // POLYFILL/PROMISES not supported
  browser.contextMenus.create(
    {
      id: ContextMenuKeys.SAVE_LINK,
      contexts: ['page', 'link'],
      title: 'Add to Remindoro',
    },
    () => {
      console.log('context menu created for "Add to Page" ')
    }
  )

  // creating a highlight context menu
  browser.contextMenus.create(
    {
      id: ContextMenuKeys.SAVE_HIGHLIGHT,
      contexts: ['selection'],
      title: 'Save Text to Remindoro',
    },
    () => {
      console.log('context menu created for "Save Text" ')
    }
  )
}
