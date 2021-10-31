import React, { createRef } from 'react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import {
  StyledEngineProvider,
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
    .MuiCalendarPicker-root > div {
      margin-bottom: 0;
    }

    .MuiCalendarPicker-root {
      & .MuiIconButton-edgeStart, .MuiIconButton-edgeEnd {
        color: ${props => props.theme.primary}; 
      }

      & .MuiIconButton-sizeSmall {
      color: ${props => props.theme.primary}; 
      }
    }

    /*  
     * AM / PM button customization
     */
    & .MuiDialogContent-root {
      & button.MuiIconButton-root.MuiIconButton-sizeMedium {
        color: ${props => props.theme.textColor};
        /* hack to fix - https://github.com/mui-org/material-ui/issues/25422#issuecomment-916304719 */
        bottom: 4rem;
      }
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
    .SnackbarContainer-root {
      
      & .SnackbarItem-variantSuccess {
        background: ${props => props.theme.success};
        & .SnackbarItem-message {
          color: ${props => props.theme.contrastTextColor};
        }

        & .SnackbarItem-action {
          & button {
            color: ${props => props.theme.contrastTextColor};
          }
        }
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
