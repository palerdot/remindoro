import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'

// main app css
import './css/index.css'

import Header from '@app/Components/Header/'
import Footer from '@app/Components/Footer/'

function App() {
  return (
    <div>
      <CssBaseline />
      <Header />
      <div>{'porumai ... wait and hope'}</div>
      <Footer />
    </div>
  )
}

export default App
