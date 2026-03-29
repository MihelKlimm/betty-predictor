import React from 'react'
import '../styles/App.css'

type Page = 'landing' | 'champions' | 'about' | 'matches' | 'leaderboard'

interface NavigationProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${currentPage === 'landing' ? 'active' : ''}`}
        onClick={() => onPageChange('landing')}
        title="Home"
      >
        <span className="icon">🏠</span>
        <span className="label">Home</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'champions' ? 'active' : ''}`}
        onClick={() => onPageChange('champions')}
        title="Champions"
      >
        <span className="icon">🏆</span>
        <span className="label">Champions</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'about' ? 'active' : ''}`}
        onClick={() => onPageChange('about')}
        title="About"
      >
        <span className="icon">ℹ️</span>
        <span className="label">About</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'matches' ? 'active' : ''}`}
        onClick={() => onPageChange('matches')}
        title="Predictions"
      >
        <span className="icon">⚽</span>
        <span className="label">Matches</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'leaderboard' ? 'active' : ''}`}
        onClick={() => onPageChange('leaderboard')}
        title="Leaderboard"
      >
        <span className="icon">🥇</span>
        <span className="label">Leaderboard</span>
      </button>
    </nav>
  )
}
