enum Theme {
  Main = 'main',
}

export interface ThemeInterface {
  primary: string
}

export type Themes = {
  [key in Theme]: ThemeInterface
}

const themes: Themes = {
  [Theme.Main]: {
    primary: '#263238',
  },
}

export const defaultTheme = themes[Theme.Main]

export const colors: ThemeInterface = defaultTheme

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
