import React from 'react'
import '../styles/App.css'

type Page = 'start' | 'matches' | 'leaderboard' | 'about'

interface NavigationProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${currentPage === 'matches' ? 'active' : ''}`}
        onClick={() => onPageChange('matches')}
      >
        <span className="icon">&#9917;</span>
        <span className="label">Matches</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'leaderboard' ? 'active' : ''}`}
        onClick={() => onPageChange('leaderboard')}
      >
        <span className="icon">&#129351;</span>
        <span className="label">Leaderboard</span>
      </button>
      <button
        className={`nav-button ${currentPage === 'about' ? 'active' : ''}`}
        onClick={() => onPageChange('about')}
      >
        <span className="icon">&#8505;&#65039;</span>
        <span className="label">About</span>
      </button>
    </nav>
  )
}
