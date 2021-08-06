import React from 'react'
import ReactDOM from 'react-dom'
import { isEmpty } from 'lodash'

import App from './'
import { loadFromStorage } from './Util/BrowserStorage/'

/*
 * IMPORTANT: This file is intentionally lightweight/barebones
 * All the important logic is present in ts/tsx files
 * Any app related logic to be added to '@app/index.tsx'
 */

const Remindoro = {
  init: initialState => {
    ReactDOM.render(
      <React.StrictMode>
        <App initialState={initialState} />
      </React.StrictMode>,
      document.getElementById('remindoro-app')
    )
  },
}

// load current state from browser storage
loadFromStorage({
  onSuccess: browserState => {
    console.log(
      'porumai ... updating state from browser storage ',
      browserState
    )
    const initialState = isEmpty(browserState) ? undefined : browserState
    // init the app once we get the current state
    Remindoro.init(initialState)
  },
  onError: () => {},
})
