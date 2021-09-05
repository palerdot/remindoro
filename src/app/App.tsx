import React, { createRef } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import {
  StyledEngineProvider,
  Theme,
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from '@mui/material/styles'
import { MemoryRouter as Router } from 'react-router-dom'
import AdapterDateFns from '@mui/lab/AdapterDayjs'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { Button, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import dayjs from 'dayjs'
import DayjsRelativeTime from 'dayjs/plugin/relativeTime'

// import type { ThemeInterface } from '@app/Util/colors'
import type { SnackbarKey } from 'notistack'

import Routes from '@app/Routes/'
import { useTheme } from '@app/Hooks/'
import Header from '@app/Components/Header/'
import Footer from '@app/Components/Footer/'

// main app css
import './css/index.css'

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

// configure dayjs to use relative time comparison
// ref: https://day.js.org/docs/en/plugin/relative-time
const thresholds = [
  { l: 's', r: 1 },
  { l: 'm', r: 1 },
  { l: 'mm', r: 59, d: 'minute' },
  { l: 'h', r: 1 },
  { l: 'hh', r: 23, d: 'hour' },
  { l: 'd', r: 1 },
  { l: 'dd', r: 29, d: 'day' },
  { l: 'M', r: 1 },
  { l: 'MM', r: 11, d: 'month' },
  { l: 'y' },
  { l: 'yy', d: 'year' },
]
// ref: https://day.js.org/docs/en/customization/relative-time
dayjs.extend(DayjsRelativeTime, { thresholds })

const Holder = styled.div`
  display: flex;
  flex-direction: column;

  /* inherits width/height of html body dimensions */
  width: 100%;
  height: 100%;

  background: ${props => props.theme.background};
`

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-grow: 1;

  overflow-y: auto;
  overflow-x: hidden;
`

// mui v5 default theme
const muiTheme = createTheme()

function App() {
  const theme = useTheme()

  // add action to all snackbars
  const notistackRef = createRef<SnackbarProvider>()
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef?.current?.closeSnackbar(key)
  }

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={muiTheme}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            ref={notistackRef}
            anchorOrigin={{
              horizontal: 'center',
              vertical: 'bottom',
            }}
            preventDuplicate={true}
            action={key => (
              <Button onClick={onClickDismiss(key)}>{'Dismiss'}</Button>
            )}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            </LocalizationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </MUIThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
