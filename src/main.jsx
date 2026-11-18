import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { initTheme } from './utils/theme.js';
import './styles/animations.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css'
import App from './App.jsx'

initTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
