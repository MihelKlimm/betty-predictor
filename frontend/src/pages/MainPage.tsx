import React, { useEffect, useState } from 'react'
import { MatchCard } from '../components/MatchCard'
import { useStore } from '../store'
import { matchesApi } from '../services/api'
import '../styles/MainPage.css'

export const MainPage: React.FC = () => {
  const { activeMatches, setActiveMatches, user } = useStore()
  const [localMatches, setLocalMatches] = useState(activeMatches)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'finished'>('all')

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const { data } = await matchesApi.getActive()
        setActiveMatches(data)
        setLocalMatches(data)
      } catch (error) {
        console.error('Error loading matches:', error)
      }
    }

    const interval = setInterval(loadMatches, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [setActiveMatches])

  const filteredMatches = localMatches.filter((match) => {
    if (filter === 'all') return true
    return match.status === filter
  })

  return (
    <div className="main-page">
      <div className="page-header">
        <h1>⚽ World Cup 2026</h1>
        <div className="user-stats">
          <span className="stat">Points: <strong>{user?.points || 0}</strong></span>
          <span className="stat">Predictions: <strong>{user?.predictions_count || 0}</strong></span>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`tab ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`tab ${filter === 'live' ? 'active' : ''}`}
          onClick={() => setFilter('live')}
        >
          🔴 Live
        </button>
        <button
          className={`tab ${filter === 'finished' ? 'active' : ''}`}
          onClick={() => setFilter('finished')}
        >
          Finished
        </button>
      </div>

      <div className="matches-list">
        {filteredMatches.length === 0 ? (
          <div className="empty-state">
            <p>No matches found for this filter</p>
          </div>
        ) : (
          filteredMatches.map((match) => <MatchCard key={match.id} match={match} />)
        )}
      </div>
    </div>
  )
}
