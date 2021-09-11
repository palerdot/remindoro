export enum Theme {
  Main = 'main',
}

export interface ThemeInterface {
  background: string
  backgroundLight: string
  primary: string
  primaryDark: string
  primaryLight: string
  highlight: string
  border: string
  borderDark: string
  textColor: string
  textHighlightColor: string
  contrastTextColor: string
  success: string
  danger: string
}

type Themes = {
  [key in Theme]: ThemeInterface
}

export const themes: Themes = {
  [Theme.Main]: {
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
    textColor: '#ffffff',
    textHighlightColor: '#e2affe',
    contrastTextColor: '#000000',
    success: 'lightgreen',
    danger: '#FF5050',
  },
}

export const defaultTheme = themes[Theme.Main]

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
