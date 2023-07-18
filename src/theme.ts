import { createTheme, Theme } from '@mui/material/styles'

const theme: Theme = createTheme({
  palette: {
    primary: {
      dark: '#9b937e',
      light: '#fedc81',
      main: '#ffb900',
    },
    secondary: {
      light: '#c8b8ff',
      main: '#3602E6',
    },

    success: {
      main: '#84d27a',
    },
    error: {
      main: '#ff8662',
    },

    common: {
      black: '#000',
      white: '#fff',
    },
    grey: {
      100: '#f4f4f4',
      200: '#e0e0e0',
      300: '#cbcbcb',
      400: '#bfbfbf',
      500: '#708090',
      600: '#666666',
      800: '#2b2821',
    },
  },

  typography: {
    fontFamily: ['"Nunito Sans"', 'sans-serif'].join(','),
    fontWeightRegular: 400,
    fontWeightBold: 1, // 700,
  },
})

theme.shadows[6] =
  '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.05)'

export { theme }
