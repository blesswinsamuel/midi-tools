import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'normalize.css'
import './main.css'
import './styles/blueprint.css'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
