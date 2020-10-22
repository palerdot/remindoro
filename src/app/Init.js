import React from 'react'
import ReactDOM from 'react-dom'

import App from './'

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
