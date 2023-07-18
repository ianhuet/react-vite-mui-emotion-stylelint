import React from 'react'

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { createRoot } from 'react-dom/client'

import { App } from './App.tsx'
import { theme } from './theme'

import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </React.StrictMode>,
)
