import React from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { Provider } from 'react-redux'
import { MemoryRouter as Router } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import dayjs from 'dayjs'
import DayjsUtils from '@date-io/dayjs'
import DayjsRelativeTime from 'dayjs/plugin/relativeTime'
// main app css
import './css/index.css'

import Routes from '@app/Routes/'
import { useTheme } from '@app/Hooks/'
import { store } from '@app/Store/'
import Header from '@app/Components/Header/'
import Footer from '@app/Components/Footer/'

// configure dayjs to use relative time comparison
// ref: https://day.js.org/docs/en/plugin/relative-time
dayjs.extend(DayjsRelativeTime)

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
    <MuiPickersUtilsProvider utils={DayjsUtils}>
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
    </MuiPickersUtilsProvider>
  )
}

/*
 * AppStore - App + Store !!!
 *
 * NOTE: Wrapping App with Redux Store provider
 *
 * we are wrapping here, so that we can access store inside 'App'
 */

const AppStore = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

export default AppStore
