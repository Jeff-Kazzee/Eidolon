import { useEffect, useState } from 'react'
import type {} from './types/electron'

function App() {
  const [platform, setPlatform] = useState<string>('')
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    // Get platform info from Electron
    if (window.electronAPI) {
      setPlatform(window.electronAPI.platform)
      window.electronAPI.getVersion()
        .then(setVersion)
        .catch((err: Error) => {
          console.error('Failed to get app version:', err)
          setVersion('unknown')
        })
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">E</span>
          <span className="logo-text">Eidolon</span>
        </div>
      </header>

      <main className="app-main">
        <div className="welcome">
          <h1>Welcome to Eidolon</h1>
          <p className="subtitle">Your AI-powered creative assistant</p>

          <div className="info-card">
            <h2>Getting Started</h2>
            <p>
              Eidolon combines AI chat, a writer's studio with version control,
              and image generation - all in one desktop app.
            </p>
            <ul>
              <li>Chat with AI models via OpenRouter</li>
              <li>Write and edit with AI-assisted review</li>
              <li>Generate images from text prompts</li>
            </ul>
          </div>

          <div className="system-info">
            <p>
              Platform: <code>{platform || 'Loading...'}</code>
            </p>
            <p>
              Version: <code>{version || '0.1.0'}</code>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
