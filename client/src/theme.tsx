import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#556cd6', // Blue
    },
    secondary: {
      main: '#19857b', // Teal
    },
    error: {
      main: red.A400, // Red
    },
  },
})

export default theme
