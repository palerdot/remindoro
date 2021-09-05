import { browser } from 'webextension-polyfill-ts'

import type { RootState } from '@app/Store/'

import packageInfo from '@package-info'
import { ALARM_KEY, STORAGE_KEY, ContextMenuKeys } from '@app/Constants'
import { migrate_v0_data_to_v1 } from './utils/'
import { notify, Notification } from './utils/notification'
import { handle_context_menu } from './utils/context-menu'

const { version } = packageInfo

/*
 * ref: https://github.com/Lusito/webextension-polyfill-ts
 * ref: https://github.com/mozilla/webextension-polyfill
 */

/*
 * Install Events
 */

browser.runtime.onInstalled.addListener(initialize_install_events)

function initialize_install_events() {
  console.log('porumai ... initing install events ', version)
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
    note:
      'Welcome to new refreshed Remindoro! You can now set one-time/repeatable reminders (with markdown support) for stuffs that matter to you ...',
  }

  notify(welcome_message)
}

/*
 * Init Background tasks
 */

init_extension_events()

function init_extension_events() {
  init_alarms()
  init_context_menus()
}

/*
 * Init alarms
 */

function init_alarms() {
  console.log('porumai .... wait and hope ... TS background logic')

  // CREATE an alarm
  browser.alarms.create(ALARM_KEY, {
    delayInMinutes: 0.1,
    periodInMinutes: 1,
  })

  // listen for the alarm
  // and dig the remindoros from local chrome extension storage and check if we need to show any notifications
  browser.alarms.onAlarm.addListener(async alarmInfo => {
    // let us make sure we are listening for right alarm
    if (alarmInfo.name !== ALARM_KEY) {
      // do not proceed
      return
    }

    // here we can handle alarm
    try {
      const data = await browser.storage.local.get(STORAGE_KEY)
      // NOTE: here we can fetch 'settings.showNotification' and use it to
      // decide whether to show alarm or not
      const remindoroData = data[STORAGE_KEY] as RootState
      // handle notifications
      const notification = new Notification(remindoroData.remindoros, true)
      const updatedRemindoros = notification.scan()
      // let us notify
      notification.notify()
      // and update stuffs to store
      // IMPORTANT: we are not emitting event to the open popup
      // to indicate that remindoro time are updated in background
      // for now, we are allowing people to focus in the open popup
      notification.updateStore(updatedRemindoros)

      console.log(
        'porumai ... remindoro data for ALARM',
        remindoroData,
        updatedRemindoros
      )
    } catch (e) {
      // some error fetching remindoro data
    }
  })
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
