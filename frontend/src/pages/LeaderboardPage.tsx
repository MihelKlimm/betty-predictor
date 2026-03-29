import React, { useEffect, useState } from 'react'
import { leaderboardApi } from '../services/api'
import { LeaderboardEntry } from '../types'
import '../styles/LeaderboardPage.css'

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [week, setWeek] = useState<number | undefined>()

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setIsLoading(true)
        const { data } = await leaderboardApi.getWeekly(week)
        setLeaderboard(data)
      } catch (error) {
        console.error('Error loading leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLeaderboard()
  }, [week])

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return '  '
  }

  if (isLoading) {
    return (
      <div className="leaderboard-page loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <h1>🏆 Leaderboard</h1>
      </div>

      <div className="leaderboard-table">
        <div className="table-header">
          <div className="col rank">Rank</div>
          <div className="col player">Player</div>
          <div className="col points">Points</div>
          <div className="col stats">Stats</div>
        </div>

        <div className="table-body">
          {leaderboard.map((entry) => (
            <div key={entry.user_id} className="table-row">
              <div className="col rank">
                <span className="medal">{getMedalEmoji(entry.rank)}</span>
                <span className="number">#{entry.rank}</span>
              </div>
              <div className="col player">
                <span className="name">{entry.username}</span>
              </div>
              <div className="col points">
                <span className="points-value">{entry.points}</span>
              </div>
              <div className="col stats">
                <span className="stat">
                  ✓ {entry.correct_predictions}
                </span>
                <span className="stat">
                  ✓✓ {entry.correct_scores}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {leaderboard.length === 0 && (
        <div className="empty-state">
          <p>No predictions yet</p>
        </div>
      )}
    </div>
  )
}
