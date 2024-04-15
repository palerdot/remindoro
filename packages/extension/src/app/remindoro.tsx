import React from 'react'
import { createRoot } from 'react-dom/client'
import { isEmpty } from 'lodash-es'

import App, {type InitialState} from './main'
import { loadFromStorage } from './Util/BrowserStorage'

/*
 * IMPORTANT: This file is intentionally lightweight/barebones
 * All the important logic is present in ts/tsx files
 * Any app related logic to be added to '@app/index.tsx'
 */

const Remindoro = {
  init: (initialState: InitialState) => {
    const container = document.getElementById('remindoro-app')
    const root = createRoot(container as HTMLElement)
    root.render(<App initialState={initialState} />)
  },
}

// load current state from browser storage
loadFromStorage({
  onSuccess: browserState => {
    const initialState = isEmpty(browserState) ? undefined : browserState
    // init the app once we get the current state
    Remindoro.init(initialState)
  },
  onError: () => {},
})
