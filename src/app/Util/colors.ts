export enum Theme {
  Day = 'Day',
  Classic = 'Classic',
  Neon = 'Neon',
}

export interface ThemeInterface {
  background: string
  backgroundLight: string
  primary: string
  primaryDark: string
  primaryLight: string
  highlight: string
  highlightTextColor: string
  border: string
  borderDark: string
  textColor: string

  /* grey: text color -> contrast color */
  greyOne: string

  contrastTextColor: string
  success: string
  danger: string
}

type Themes = {
  [key in Theme]: ThemeInterface
}

export const themes: Themes = {
  /* DAY THEME */
  [Theme.Day]: {
    background: '#F1F3F6',
    backgroundLight: '#FFFFFF',

    border: '#D1D3D7',
    borderDark: '#eceef1',
    primary: '#494DF3',
    // primaryDark: '#4b4ff3',
    primaryDark: '#b9bbfa',
    primaryLight: '#4e52f2',

    highlight: '#5155f2',
    highlightTextColor: '#FFFFFF',
    textColor: '#0C152E',
    contrastTextColor: '#FFFFFF',

    greyOne: '#686E7E',

    success: 'lightgreen',
    danger: '#FF5050',
  },

  /* CLASSIC THEME */
  [Theme.Classic]: {
    // background: '#3C0078',
    background: '#263238',
    // border: '#5A5A5A',
    // borderDark: '#344750', // middle of background/backgroundLight
    borderDark: '#3f535c', // middle of background/backgroundLight
    backgroundLight: '#1F333C',
    // backgroundLight: '#546e7a',
    border: '#314651', // middle of backgroundLight/primary
    primary: '#4A5F69',
    primaryDark: '#546e7a',
    // primaryLight: '#00ceea',
    primaryLight: '#00b0ff',
    highlight: '#18ffff',
    highlightTextColor: '#FFFFFF',
    textColor: '#ffffff',

    /* grey: text color -> contrast color */
    greyOne: '#DEDEDE',

    contrastTextColor: '#000000',
    success: 'lightgreen',
    danger: '#FF5050',
  },

  /* NEON THEME */
  [Theme.Neon]: {
    // background: '#3C0078',
    background: '#271332',
    // border: '#5A5A5A',
    borderDark: '#360e4e', // middle of background/backgroundLight
    backgroundLight: '#400a60',
    border: '#641190', // middle of backgroundLight/primary
    primary: '#8117b8',
    primaryDark: '#5F0098',
    primaryLight: '#A33EDA',
    highlight: '#c55ffc',
    highlightTextColor: '#FFFFFF',
    textColor: '#ffffff',

    /* grey: text color -> contrast color */
    greyOne: '#DEDEDE',

    contrastTextColor: '#000000',
    success: 'lightgreen',
    danger: '#FF5050',
  },
}

export const defaultTheme = themes[Theme.Classic]

export const colors: ThemeInterface = defaultTheme

/*  

// shades
background: #3C0078
primary: #8117b8
primaryDark: #5F0098
primaryLight: #A33EDA
highlight: #c55ffc

*/

/*  

$remindoro_color: #FF3000;

$theme_color: #263238;
$theme_shade_1: #546e7a;
$theme_shade_2: #455a64;
$theme_shade_3: #37474f;
$theme_shade_4: #263238;

// $theme_color: #282828;
$text_color: white;
// $border_color: #555;
$border_color: #455a64;
// $input_highlight_color: #9e9e9e;
$input_highlight_color: #cfd8dc;

// $bg_color: #282828;
$bg_color: #263238;
// $bg_color: #3e2723;

// $modal_bg: #424242;
$modal_bg: #263238;
$modal_text_color: white;

// $placeholder_color: #555;
$placeholder_color: #455a64;

*/
