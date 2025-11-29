import { useState, useEffect, createRef } from 'react'
import styled from '@emotion/styled'
import { MemoryRouter } from 'react-router-dom'
import { css, Global, ThemeProvider } from '@emotion/react'
import {
  StyledEngineProvider,
  ThemeProvider as MUIThemeProvider,
  createTheme,
  type Theme as MUITheme,
} from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Button, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import dayjs from 'dayjs'
import DayjsRelativeTime from 'dayjs/plugin/relativeTime'
import { SLITE_DROPDOWN_CLASS } from 'react-slite'

import type { SnackbarKey } from 'notistack'

import { classNames } from '@app/Constants'
import Routes from '@app/Routes/'
import { useTheme } from '@app/Hooks/'
import Header from '@app/Components/Header/'
import Footer from '@app/Components/Footer/'
import { useHasChangelogHistory } from './Store'
import ChangelogModal from './Screens/Feedback/Changelog/Modal'

// main app css
import './css/index.css'
import { getThemeMode, type ThemeInterface } from './Util/colors'
import { useCurrentTheme } from './Hooks/useTheme'

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
const GlobalStyle = ({ theme }: { theme: MUITheme }) => (
  <Global
    styles={css`
      body {
        background: ${theme.palette.background.default} !important;
        color: ${theme.palette.text.primary} !important;

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
          background: ${theme.palette.primary.main};
        }
        & :hover::-webkit-scrollbar-thumb {
          background: ${theme.palette.grey[500]};
        }

        /* Slite editor dropdown styles */
        .${SLITE_DROPDOWN_CLASS} {
          background-color: ${theme.palette.background.paper};
          color: ${theme.palette.text.primary};
        }

        .${SLITE_DROPDOWN_CLASS} .item {
          background-color: ${theme.palette.background.paper};
          color: ${theme.palette.text.primary};
        }

        .${SLITE_DROPDOWN_CLASS} .item:hover {
          background-color: ${theme.palette.primary.main};
          color: ${theme.palette.primary.contrastText};
        }

        /* select form down icon tweak */
        .select-form .MuiSvgIcon-root {
          color: ${theme.palette.text.primary};
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
          & .MuiIconButton-edgeStart,
          .MuiIconButton-edgeEnd {
            color: ${theme.palette.primary.main};
          }

          & .MuiIconButton-sizeSmall {
            color: ${theme.palette.primary.main};
          }
        }

        /* Color of AM/PM button */
        & .MuiClock-amButton,
        .MuiClock-pmButton {
          color: ${theme.palette.text.primary};
        }

        /*  
          * Outlined text input border customization
          */
        & .MuiOutlinedInput-root:not(.Mui-disabled) {
          &:hover .MuiOutlinedInput-notchedOutline {
            border-color: ${theme.palette.secondary.main};
          }
        }

        /*  
        * Select box customization
        */
        & .MuiSelect-root:not(.Mui-disabled) {
          border: thin solid ${theme.palette.primary.main};

          & .MuiSelect-icon {
            color: ${theme.palette.secondary.main};
          }
        }

        /*  
        * Select menu customization
        */
        & .MuiPopover-root {
          & .MuiPopover-paper {
          border: thin solid ${theme.palette.primary.main};

            & ul.MuiMenu-list li:hover {
              background: ${theme.palette.primary.main};
            }
          }
        }

        /*  
        * Slider customization
        */
        & .MuiSlider-root {
          &.Mui-disabled {
            color: ${theme.palette.background.paper};

            & .MuiSlider-rail, .MuiSlider-track {
              color: ${theme.palette.divider};
            }
          }

          & .MuiSlider-valueLabelOpen {
            background: ${theme.palette.primary.main};
            font-weight: 800;
          }
        }

        & .${classNames.datepickerInput} {
          & label {
            color: ${theme.palette.secondary.main};
          }

          & label.Mui-disabled {
            color: ${theme.palette.primary.main};
          }

          & input {
            color: ${theme.palette.text.primary};
          }

          & .MuiInputAdornment-root .MuiIconButton-root {
            color: ${theme.palette.secondary.main};
          }
        }

        /*  
        * Snackbar notification
        */

        /* success message styling */
        .notistack-MuiContent-success {
          background: ${theme.palette.success.main};
          color: ${theme.palette.success.contrastText};

          & button {
            color: ${theme.palette.success.contrastText};
          }
        }

        /* Error message styling */
        .notistack-MuiContent-error {
          background: ${theme.palette.error.main};
          color: ${theme.palette.error.contrastText};

          & button {
            color: ${theme.palette.error.contrastText};
          }
        }
      }
    `}
  />
)

const Holder = styled.div`
  display: flex;
  flex-direction: column;

  /* inherits width/height of html body dimensions */
  width: 100%;
  height: 100%;

  background: ${props => props.theme.palette.background.paper};
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
  const has_changelog_history = useHasChangelogHistory()
  const [showChangelog, setChangelogStatus] = useState(!has_changelog_history)
  const theme = useTheme()
  const currentTheme = useCurrentTheme()
  // mui v5 default theme
  const muiTheme = createTheme({
    // palette: {
    //   primary: {
    //     main: theme.highlight,
    //     // light: theme.highlight,
    //     // dark: theme.highlight,
    //   },
    //   info: {
    //     main: theme.highlight,
    //     // light: theme.highlight,
    //     // dark: theme.highlight,
    //   },
    //   background: {
    //     default: theme.backgroundLight,
    //     paper: theme.background,
    //   },
    //   text: {
    //     primary: theme.textColor,
    //     secondary: theme.highlight,
    //     disabled: theme.primaryDark,
    //   },
    // },

    // ref: https://zenoo.github.io/mui-theme-creator/
    palette: {
      // mode: 'light',
      mode: getThemeMode(currentTheme),
      primary: {
        // main: '#3f51b5',
        main: theme.primary,
      },
      secondary: {
        // main: '#f50057',
        main: theme.highlight,
      },
      background: {
        // default: '#f1f3f6',
        // paper: '#f1f3f6',
        default: theme.backgroundLight,
        paper: theme.background,
      },
      divider: theme.border,
      success: {
        main: theme.success,
      },
      error: {
        main: theme.danger,
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

  useEffect(() => {
    setChangelogStatus(!has_changelog_history)
  }, [has_changelog_history])

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={muiTheme}>
        <ThemeProvider
          theme={{
            colors: theme,
            palette: muiTheme.palette,
          }}
        >
          <GlobalStyle theme={muiTheme} />
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
              <MemoryRouter>
                <Holder>
                  <CssBaseline />
                  <Header />
                  <Container>
                    <Routes />
                  </Container>
                  <Footer />
                </Holder>
                <ChangelogModal
                  isOpen={showChangelog}
                  closeModal={() => {
                    setChangelogStatus(false)
                  }}
                />
              </MemoryRouter>
            </LocalizationProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </MUIThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
