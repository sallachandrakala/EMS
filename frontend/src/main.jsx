import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthContext from './context/authContext.jsx'

// Suppress harmless AbortError from media .play() interrupted by .pause()
// (commonly triggered by browser autoplay policies, extensions, or HMR)
window.addEventListener(
  'unhandledrejection',
  (e) => {
    const reason = e.reason
    const name =
      typeof reason === 'object' && reason && 'name' in reason ? reason.name : undefined
    const message =
      typeof reason === 'object' && reason && 'message' in reason
        ? String(reason.message || '')
        : String(reason || '')

    const msg = message.toLowerCase()
    const isPlayPauseAbort =
      name === 'AbortError' &&
      (msg.includes('play() request was interrupted') ||
        (msg.includes('play') && msg.includes('pause')))

    if (isPlayPauseAbort) {
      e.preventDefault()
      e.stopPropagation()
    }
  },
  { capture: true }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContext>
      <App />
    </AuthContext>
  </StrictMode>
)