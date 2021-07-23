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
