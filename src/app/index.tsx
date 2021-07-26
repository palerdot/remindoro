import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
// main app css
import './css/index.css'

import { useTheme } from '@app/Hooks/'
import { store } from '@app/Store/'
import AddRemindoro from '@app/Components/AddRemindoro'
import Header from '@app/Components/Header/'
import Footer from '@app/Components/Footer/'

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
  const theme = useTheme()

  return (
    <ThemeProvider theme={theme}>
      <Holder>
        <CssBaseline />
        <Header />
        <Container>
          <div>{'porumai ... wait and hope'}</div>
        </Container>
        <Footer />
        <AddRemindoro />
      </Holder>
    </ThemeProvider>
  )
}

/*
 * NOTE: Wrapping App with Redux Store provider
 *
 * we are wrapping here, so that we can access store inside 'App'
 */

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)
