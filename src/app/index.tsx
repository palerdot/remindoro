import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import { MemoryRouter as Router } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
// main app css
import './css/index.css'

import Routes from '@app/Routes/'
import { useTheme } from '@app/Hooks/'
import { store } from '@app/Store/'
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
      <Router>
        <Holder>
          <CssBaseline />
          <Header />
          <Container>
            <Routes />
          </Container>
          <Footer />
        </Holder>
      </Router>
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
