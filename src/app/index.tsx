import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import CssBaseline from '@material-ui/core/CssBaseline'

// main app css
import './css/index.css'

import Header from '@app/Components/Header/'
import Footer from '@app/Components/Footer/'
import { colors } from '@app/Util/colors'

const Holder = styled.div`
  display: flex;
  flex-direction: column;

  /* inherits width/height of html body dimensions */
  width: 100%;
  height: 100%;
`

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-grow: 1;
`

function App() {
  return (
    <ThemeProvider theme={colors}>
      <Holder>
        <CssBaseline />
        <Header />
        <Container>{'porumai ... wait and hope'}</Container>
        <Footer />
      </Holder>
    </ThemeProvider>
  )
}

export default App
