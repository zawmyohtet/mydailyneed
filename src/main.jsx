import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBars, faSearch, faTimes, faCloudUploadAlt, faExclamationTriangle,
  faFileCode, faCompress, faExchangeAlt, faFilter, faCode, faLink,
  faCalculator, faFont, faClone, faList, faCodeCompare, faImage,
  faClock, faFingerprint, faPalette, faKey, faMoon, faSun
} from '@fortawesome/free-solid-svg-icons'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

library.add(
  faBars, faSearch, faTimes, faCloudUploadAlt, faExclamationTriangle,
  faFileCode, faCompress, faExchangeAlt, faFilter, faCode, faLink,
  faCalculator, faFont, faClone, faList, faCodeCompare, faImage,
  faClock, faFingerprint, faPalette, faKey, faMoon, faSun
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <HashRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </HashRouter>
    </HelmetProvider>
  </React.StrictMode>
)
