import React from 'react'
import ReactDOM from 'react-dom'
import { isEmpty as _isEmpty } from 'lodash'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {
  sortRemindoros,
  addRemindoroWithDetails,
  updateRemindoros,
} from './redux/actions'

import remindoroReducer from './redux/reducers'
import { calculate_remindoro_id, is_chrome_error } from './js/utils'

import './js/general-initializer.js'

import App from './Components/App'

// sniff if we are running as a chrome extension
let is_chrome_extension = chrome && chrome.storage

// defining the store
// we will initialize after getting initial data from chrome
let store = false

// subscription for handling store changes
let subscription = false

// main app object
let REMINDORO = {
  // count of total remindoros; used for generating unique ids by auto incrementing
  id_counter: 0,

  initialize: function(chrome_local_data) {
    let initial_data = chrome_local_data && chrome_local_data['REMINDORO']

    // not added in version 0.1.0
    let is_empty_remindoros =
      initial_data &&
      initial_data.remindoros &&
      initial_data.remindoros.length == 0

    if (is_empty_remindoros) {
      // if no data is found in chrome's local storage; let us populate with some initial remindoros
      initial_data.remindoros = get_initial_remindoros()
    }

    // JUST INSTALLED! if no initial data which means may be just installed
    // setting default state
    if (!initial_data) {
      initial_data = {
        current_tab: 'home',
        current_selected_remindoro: false,
        remindoros: get_initial_remindoros(),
      }
    }

    let ros =
      initial_data && initial_data.remindoros ? initial_data.remindoros : []

    // update the  total remindoros
    this.id_counter = calculate_remindoro_id(ros)

    store = createStore(remindoroReducer, initial_data)
    // add subscription to store changes
    subscription = store.subscribe(REMINDORO.handleSubscription)
    // starting the app
    this.start()
  },

  start: function() {
    // render app
    try {
      this.renderApp()
    } catch (e) {
      handleError(e)
    }
  },

  renderApp: function() {
    let id_counter = this.id_counter

    ReactDOM.render(
      <Provider store={store}>
        <App id_counter={id_counter} />
      </Provider>,
      document.getElementById('remindoro-app')
    )
  },

  // handle store changes
  handleSubscription: function() {
    if (!is_chrome_extension) {
      // do not sync with chrome storage
      return
    }
    // save the store data to local storage
    chrome.storage.local.set({ REMINDORO: store.getState() }, function() {
      console.log('STORE DATA saved to CHROME')
      var chrome_error = is_chrome_error()

      if (chrome_error) {
        // notifications ALREADY shown in is_chrome_error module
        // do not proceed
        return
      }
    })
  },

  handleContextMenuClick: function(menu_details, tab_details) {
    var remindoro_details = {}
    // we will be handling two types of context menus
    // page/link action => adding the page url as note, title as title
    // highlighted action => title - url as title, highlighted text as body
    var context_id = menu_details.menuItemId,
      page_action = context_id == 'remindoro-page-context-menu',
      highlight_action = context_id == 'remindoro-highlight-context-menu'

    if (page_action) {
      // page/link action
      // title => page title
      // note => url of the page
      var title = tab_details.title,
        note = tab_details.url
    } else if (highlight_action) {
      // highlight action
      // title => page title - url
      // note => highlighted text
      var title = tab_details.title + ' - ' + tab_details.url,
        note = menu_details.selectionText || ''
    }

    // save the  remindoro details
    remindoro_details = {
      title: title,
      note: note,
    }

    // dispatching an action to add Remindoro with details
    let current_state = store.getState(),
      current_remindoros = current_state['remindoros']

    const add_id = calculate_remindoro_id(current_remindoros)

    store.dispatch(addRemindoroWithDetails(add_id, remindoro_details))
    // add a chrome notification
  },
}

function handleError(e) {
  Materialize.toast('Error ' + e.message, 13000)
  Materialize.toast(
    'Please notify the error through browser extension site or to - palerdot@gmail.com',
    13000
  )
}

// if there are no remindoros saved, we will populate with a default set
function get_initial_remindoros() {
  var from_time = 45 * 60 * 1000 // 45 minutes in milliseconds

  return [
    {
      id: calculate_remindoro_id([]),
      title: 'Take a Walk',
      type: 'note',
      note:
        "Taking a walk for every 45 minutes is good for your health. Avoid continous sitting for long hours. Remember, 'Sitting is the new Smoking'. &nbsp;<div><br></div><div>NOTE: This is a default sample remindoro shown if no entries are saved. You can edit, save, delete and do whatever you want with this note. Enjoy!</div>",
      list: [],
      created: Date.now(),
      updated: Date.now(),
      reminder: {
        time: Date.now() + from_time,
        is_repeat: true, // status if the alarm is recurring
        repeat: {
          interval: 'minutes',
          time: '45',
        },
      },
    },
  ]
}

try {
  if (is_chrome_extension) {
    // we are dealing with a chrome extension; init normally
    chrome.contextMenus.onClicked.addListener(function(
      menu_details,
      tab_details
    ) {
      console.log('processed in background page')
      REMINDORO.handleContextMenuClick(menu_details, tab_details)
    })
    // get current locally stored item from chrome
    // our data is within the key called "REMINDORO" // caps
    chrome.storage.local.get('REMINDORO', REMINDORO.initialize.bind(REMINDORO))

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('porumai! runtime message ', request, sender, sendResponse)
      if (!_isEmpty(request.updated_remindoros)) {
        // if there are any updated remindoros, changing only those remindoros
        // dispatching an action to update changed remindoros
        console.log('UPDATING REMINDOROS ', request.updated_remindoros)
        store.dispatch(updateRemindoros(request.updated_remindoros))
      }
    })
  } else {
    // we are probably running in the browser, we will initialize differently
    REMINDORO.initialize({})
  }
} catch (e) {
  handleError(e)
}
