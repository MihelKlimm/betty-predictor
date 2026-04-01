import React from 'react'
import './LandingPage.css'

export const LandingPage: React.FC = () => {
  const handleLaunch = () => {
    const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'betty_worldcup2026_bot'
    const url = `https://t.me/${botUsername}/app`
    window.open(url, '_blank')
  }

  return (
    <div className="landing-page">
      <div className="landing-content">
        <img src="/betty-logo.png" alt="Betty - Miniature Schnauzer" className="logo" />
        
        <h1>World Cup 2026</h1>
        
        <p className="slogan">Sniff the score - get TONn of emotions!</p>
        
        <button className="launch-btn" onClick={handleLaunch}>
          Launch App
        </button>
      </div>
    </div>
  )
}
