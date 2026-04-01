import React from 'react'
import './LandingPage.css'

interface StartPageProps {
  onStart: () => void
}

export const LandingPage: React.FC<StartPageProps> = ({ onStart }) => {
  return (
    <div className="start-page">
      <div className="start-content">
        <img src="/betty-logo.png" alt="Betty" className="start-logo" />
        <h1 className="start-title">Betty</h1>
        <p className="start-subtitle">World Cup 2026 Predictions</p>
        <p className="start-slogan">Sniff the score &mdash; get TONn of emotions!</p>
        <button className="start-btn" onClick={onStart}>
          Start Game
        </button>
      </div>
    </div>
  )
}
