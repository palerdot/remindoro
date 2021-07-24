import React from 'react'
import ReactDOM from 'react-dom'

import App from './'

/*
 * IMPORTANT: This file is intentionally lightweight/barebones
 * All the important logic is present in ts/tsx files
 * Any app related logic to be added to '@app/index.tsx'
 */

const Remindoro = {
  init: () => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('remindoro-app')
    )
  },
}

Remindoro.init()
