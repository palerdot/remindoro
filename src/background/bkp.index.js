import {
  find as _find,
  findKey as _findKey,
  findIndex as _findIndex,
} from 'lodash'
// import moment from "moment";

// import modular components from utils
import {
  calculate_remindoro_id,
  Notification,
  strip_html,
  isValidUrl,
  chrome_notify,
  is_chrome_error,
  handle_sync_local_storage,
} from '../common/utils.js'
// import { browser } from 'webextension-polyfill-ts'
import * as browser from 'webextension-polyfill'

// browser bg/event related tasks
browser.runtime.onInstalled.addListener(initializeInstallEvents)

function initializeInstallEvents() {
  console.log('event page install event !')
  // BUGFIX: converting storage.sync to local due to storage space constraints
  // if we detect there are some data in chrome.storage.sync, we will transfer it to chrome.storage.local
  // defined in utils storage
  handle_sync_local_storage()

  const REMINDORO_VERSION = process.env.REMINDORO_VERSION

  // init_chrome_events();
  // create_context_menus()
  // show the welcome message
  const welcome_msg = {
    title: `Hello from Remindoro - ${REMINDORO_VERSION} !`,
    message:
      'You can now set one-time/repeatable reminders for stuffs that matter to you ...',
  }

  chrome_notify(welcome_msg)
}

// create context menus
create_context_menus()
// init events
init_extension_events()

function init_extension_events() {
  // START: EXTENSION EVENTS

  // chrome handle alarm events
  // CREATE an alarm
  browser.alarms.create('remindoro-scan', {
    delayInMinutes: 0.1,
    periodInMinutes: 1,
  })

  // listen for the alarm
  // and dig the remindoros from local chrome extension storage and check if we need to show any notifications
  browser.alarms.onAlarm.addListener(() => {
    browser.storage.local
      .get('REMINDORO')
      .then(data => {
        // get the  remindoro data
        const remindoro_data = data['REMINDORO']
        const remindoros = remindoro_data && remindoro_data['remindoros']

        // scan the remindoro and check if we need to update the time and notify it
        Notification.scan(remindoros)
        console.log(
          'EVENT PAGE: STORE DATA About to be saved to browser ',
          remindoro_data
        )
        // save the store data to local storage
        return browser.storage.local.set({ REMINDORO: remindoro_data })
      })
      .then(() => {
        console.log('EVENT PAGE: STORE DATA saved to browser')
        // TODO: notification to be shown !!??
        const chrome_error = is_chrome_error()

        if (chrome_error) {
          // notifications ALREADY shown in is_chrome_error module
          // do not proceed
          return
        }
      })
  })

  // handle browser context menu clicks
  browser.contextMenus.onClicked.addListener((menu_details, tab_details) => {
    let to_add = {}
    browser.storage.local
      .get('REMINDORO')
      .then(data => {
        // get the  remindoro data
        let remindoro_data = data['REMINDORO']
        const remindoros = remindoro_data['remindoros']

        // before adding we need to check if the link we are trying to save is already there
        const is_link_present = check_remindoro_link(
          menu_details,
          tab_details,
          remindoros
        )

        if (is_link_present) {
          // we have notified
          // update the remindoros which we got
          remindoro_data['remindoros'] = is_link_present
        } else {
          // link is not already there
          // we need to add it
          to_add = handleContextMenuClick(menu_details, tab_details, remindoros)

          // push the remindoros to add
          remindoros.push(to_add)
          // update the remindoros
          remindoro_data['remindoros'] = remindoros
        }

        // save the store data to local storage
        return browser.storage.local.set({ REMINDORO: remindoro_data })
      })
      .then(() => {
        console.log('EVENT PAGE: NEW REMINDORO saved to browser')

        const chrome_error = is_chrome_error()

        if (chrome_error) {
          // notifications ALREADY shown in is_chrome_error module
          // do not proceed
          return
        }

        chrome_notify({
          title: 'Added Successfully',
          message: to_add.title,
        })
      })
  })

  // handle when a "Read Now" button is clicked on notification
  browser.notifications.onButtonClicked.addListener(
    (notification_id, button_index) => {
      // getting the remindoro id from the notificatin id
      const ro_id = _findKey(Notification.notification_ids, (n_id, key) => {
        return n_id == notification_id
      })
      // getting remindoros from the storage
      browser.storage.local.get('REMINDORO').then(data => {
        // get the  remindoro data
        const remindoro_data = data['REMINDORO']
        const remindoros = remindoro_data['remindoros']

        // finding the remindoro matching the id
        const ro = _find(remindoros, r => r.id == ro_id)

        if (isValidUrl(ro.note)) {
          // if valid url; opening the link in new tab
          browser.tabs.create({ url: ro.note })
        }
        // either way we need to close the notification
        browser.notifications.clear(notification_id)
      })
    }
  )
  // END: EXTENSION EVENTS
}

// creates context menus for different use cases => normal one, for links, highlighted text
function create_context_menus() {
  // creating a page context menu
  // POLYFILL/PROMISES not supported
  browser.contextMenus.create(
    {
      id: 'remindoro-page-context-menu',
      contexts: ['page', 'link'],
      title: 'Add to Remindoro',
    },
    () => {
      console.log('context menu created ? ', arguments)
    }
  )

  // creating a highlight context menu
  browser.contextMenus.create(
    {
      id: 'remindoro-highlight-context-menu',
      contexts: ['selection'],
      title: 'Save Text to Remindoro',
    },
    () => {
      console.log('context menu created ? ', arguments)
    }
  )
}

function handleContextMenuClick(menu_details, tab_details, remindoros) {
  let remindoro_details = {}
  // we will be handling two types of context menus
  // page/link action => adding the page url as note, title as title
  // highlighted action => title - url as title, highlighted text as body
  const context_id = menu_details.menuItemId
  const page_action = context_id === 'remindoro-page-context-menu'
  const highlight_action = context_id === 'remindoro-highlight-context-menu'

  let title = ''
  let note = ''

  if (page_action) {
    // page/link action
    // title => page title
    // note => url of the page
    title = tab_details.title
    note = tab_details.url
  } else if (highlight_action) {
    // highlight action
    // title => page title - url
    // note => highlighted text
    title = tab_details.title + ' - ' + tab_details.url
    note = menu_details.selectionText || ''
  }

  // save the  remindoro details
  remindoro_details = {
    title: title,
    note: note,
  }

  const add_id = calculate_remindoro_id(remindoros)
  // return the new remindoro to be added
  const remindoro_to_add = {
    id: add_id,
    title: remindoro_details.title,
    type: 'note',
    note: remindoro_details.note,
    list: [], // if list contains the list details
    created: Date.now(),
    updated: Date.now(),
    reminder: {
      time: false, // if false no alarm set,
      is_repeat: false, // status if the alarm is recurring
      repeat: {
        interval: false,
        time: false,
      },
    },
  }

  return remindoro_to_add
}

// check if remindoro link already present
function check_remindoro_link(menu_details, tab_details, remindoros) {
  // we will be handling two types of context menus
  // page/link action => adding the page url as note, title as title
  // highlighted action => title - url as title, highlighted text as body
  const context_id = menu_details.menuItemId
  const page_action = context_id === 'remindoro-page-context-menu'
  const highlight_action = context_id === 'remindoro-highlight-context-menu'

  // if not page action we will return false
  if (!page_action) {
    return false
  }

  const title = tab_details.title
  const note = tab_details.url

  // we are getting a page action only here
  // note here we need to check if the url is already present in the existing remindoros
  const already_saved_link = _findIndex(remindoros, ro => {
    const link = strip_html(ro.note)
    return note == link
  })

  if (already_saved_link < 0) {
    // it is not present
    return false
  }

  // it seems the link is already saved we need to update the
  // update the time with the index we have
  remindoros[already_saved_link].updated = Date.now()
  // update the title in case we get a updated title
  remindoros[already_saved_link].title = title

  // notify
  chrome_notify({
    title: 'Updated Successfully!',
    message: note,
  })

  // return the remindoros
  return remindoros
}

/*  

{
  "REMINDORO": {
    "current_tab": "home",
    "remindoros": [
      {
        "id": 3,
        "title": "porumai",
        "type": "note",
        "note": "test",
        "list": [],
        "created": 1627482387671,
        "updated": 1627482392103,
        "reminder": {
          "time": false,
          "is_repeat": false,
          "repeat": {
            "interval": false,
            "time": false
          }
        }
      },
      {
        "id": 2,
        "title": "",
        "type": "note",
        "note": "",
        "list": [],
        "created": 1627482379252,
        "updated": 1627482379252,
        "reminder": {
          "time": false,
          "is_repeat": false,
          "repeat": {
            "interval": false,
            "time": false
          }
        }
      },
      {
        "id": 1,
        "title": "Take a Walk",
        "type": "note",
        "note": "Taking a walk for every 45 minutes is good for your health. Avoid continous sitting for long hours. Remember, 'Sitting is the new Smoking'. &nbsp;<div><br></div><div>NOTE: This is a default sample remindoro shown if no entries are saved. You can edit, save, delete and do whatever you want with this note. Enjoy!</div>",
        "list": [],
        "created": 1627482377767,
        "updated": 1627482377767,
        "reminder": {
          "time": 1627485077767,
          "is_repeat": true,
          "repeat": {
            "interval": "minutes",
            "time": "45"
          }
        }
      }
    ],
    "current_selected_remindoro": false
  }
}

*/

/*  

[] time element for timeago + repeat icon
[] route with remindoro id in path
[] add remindoro -> info page
[] delete remindoro + confirm + toast 
[] data cleanup - 'reminder' + 'repeat' keys cleanup - 'list' key
[] save to browser storage
[] hydrate from browser storage

background task
[] init watch task with key
[] retrieve remindoros
[] calculate next notification time
[] update time

context menus
[] add context menu hooks
[] save to browser storage and notify

*/
