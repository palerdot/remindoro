import React, { createRef } from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import {
  StyledEngineProvider,
  ThemeProvider as MUIThemeProvider,
  createTheme,
} from '@mui/material/styles'
import { MemoryRouter as Router } from 'react-router-dom'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Button, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import dayjs from 'dayjs'
import DayjsRelativeTime from 'dayjs/plugin/relativeTime'
import { SLITE_DROPDOWN_CLASS } from 'react-slite'

// import type { ThemeInterface } from '@app/Util/colors'
import type { SnackbarKey } from 'notistack'

import { classNames } from '@app/Constants'
import Routes from '@app/Routes/'
import { useTheme } from '@app/Hooks/'
import Header from '@app/Components/Header/'
import Footer from '@app/Components/Footer/'

// main app css
import './css/index.css'
import { ThemeInterface } from './Util/colors'

// declare module '@mui/styles/defaultTheme' {
//   interface DefaultTheme extends Theme {}
// }

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

// global style
const GlobalStyle = createGlobalStyle`
  body {

    background: ${props => props.theme.background} !important;
    color: ${props => props.theme.textColor} !important;

    /* Scroll bar customisations */
    & ::-webkit-scrollbar {
      background: transparent;
      width: 0.25rem;
      height: 0.25rem;
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
    }
    & ::-webkit-scrollbar-thumb {
      background: transparent;
      box-shadow: none !important;
      -webkit-box-shadow: none !important;
    }

    & :hover::-webkit-scrollbar {
      background: ${props => props.theme.primaryDark};
    }
    & :hover::-webkit-scrollbar-thumb {
      background: ${props => props.theme.primaryLight};
    }

    /* Slite editor dropdown styles */
    .${SLITE_DROPDOWN_CLASS} {
      background-color: ${props => props.theme.primary};
      color: ${props => props.theme.textColor};
    }

    .${SLITE_DROPDOWN_CLASS} .item {
      background-color: ${props => props.theme.primary};
      color: ${props => props.theme.textColor};
    }

    .${SLITE_DROPDOWN_CLASS} .item:hover {
      background-color: ${props => props.theme.primaryLight};
      color: ${props => props.theme.textColor};
    }

    /* select form down icon tweak */
    .select-form .MuiSvgIcon-root {
      color: ${props => props.theme.textColor};
    }

    /* 
     * hide the manual input toggle button;  
     *
     * reminder time can be edited only in calender view
     */
    button.PrivateDateTimePickerToolbar-penIcon {
      display: none;
    }

    /*  
     * hide scroll in datepicker
     */

    .MuiPickersLayout-toolbar {
      padding-top: 0;
      padding-bottom: 0;
    }

    .MuiPickersLayout-root > div {
      margin-bottom: 0;
    }

    .MuiPickersLayout-root {
      & .MuiIconButton-edgeStart, .MuiIconButton-edgeEnd {
        color: ${props => props.theme.primary}; 
      }

      & .MuiIconButton-sizeSmall {
      color: ${props => props.theme.primary}; 
      }
    }

    /* Color of AM/PM button */
    & .MuiClock-amButton, .MuiClock-pmButton {
      color: ${props => props.theme.textColor};
    }

    /*  
     * Outlined text input border customization
     */
    & .MuiOutlinedInput-root:not(.Mui-disabled) {
      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: ${props => props.theme.highlight};
      }
    }
    
    /*  
     * Select box customization
     */
    & .MuiSelect-root:not(.Mui-disabled) {
      border: ${props => `thin solid ${props.theme.primaryDark}`};

      & .MuiSelect-icon {
        color: ${props => props.theme.highlight};
      }
    }

    /*  
     * Select menu customization
     */
    & .MuiPopover-root {
      & .MuiPopover-paper {
        border: ${props => `thin solid ${props.theme.primaryDark}`};

        & ul.MuiMenu-list li:hover {
          background: ${props => props.theme.primaryDark};
        }
      }
    }

    /*  
     * Slider customization
     */
    & .MuiSlider-root {
      &.Mui-disabled {
        color: ${props => props.theme.backgroundLight};
      }
      

      & .MuiSlider-valueLabelOpen {
        background: ${props => props.theme.primaryLight};
        font-weight: 800;
      }
    }

    & .${classNames.datepickerInput} {
      & label {
        color: ${props => props.theme.highlight};
      }

      & label.Mui-disabled {
        color: ${props => props.theme.primaryDark};
      }

      & input {
        color: ${props => props.theme.textColor};
      }

      & .MuiInputAdornment-root .MuiIconButton-root {
        color: ${props => props.theme.highlight};
      }
    }

    /*  
     * Snackbar notification
     */

    /* success message styling */
    .notistack-MuiContent-success {
      background: ${props => props.theme.success};
      color: ${props => props.theme.contrastTextColor};

      & button {
        color: ${props => props.theme.contrastTextColor};
      }
    }

    /* Error message styling */
    .notistack-MuiContent-error {
      color: ${props => props.theme.highlightTextColor};

      & button {
        color: ${props => props.theme.highlightTextColor};
      }
    }
  }
`

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

// ref: https://mui.com/customization/theming/
declare module '@mui/material/styles' {
  interface Theme {
    colors: ThemeInterface
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    colors: ThemeInterface
  }
}

function App() {
  const theme = useTheme()
  // mui v5 default theme
  const muiTheme = createTheme({
    palette: {
      primary: {
        main: theme.highlight,
        // light: theme.highlight,
        // dark: theme.highlight,
      },
      info: {
        main: theme.highlight,
        // light: theme.highlight,
        // dark: theme.highlight,
      },
      background: {
        default: theme.backgroundLight,
        paper: theme.background,
      },
      text: {
        primary: theme.textColor,
        secondary: theme.highlight,
        disabled: theme.primaryDark,
      },
    },
    colors: {
      ...theme,
    },
  })

  // add action to all snackbars
  const notistackRef = createRef<SnackbarProvider>()
  const onClickDismiss = (key: SnackbarKey) => () => {
    notistackRef?.current?.closeSnackbar(key)
  }

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={muiTheme}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
