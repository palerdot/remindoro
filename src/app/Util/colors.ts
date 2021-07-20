export interface ThemeInterface {
  primary: string
}

const themes = {
  main: {
    primary: '#263238',
  },
}

export const colors: ThemeInterface = themes['main']
