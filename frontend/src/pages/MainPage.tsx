import React from 'react'
import { MatchCard } from '../components/MatchCard'
import { WEEK1_MATCHES } from '../data/matches'
import '../styles/MainPage.css'

const STORAGE_KEY = 'betty_predictions_v2'

function loadPredictions(): Record<number, { outcome: string; score: string }> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function savePredictions(preds: Record<number, { outcome: string; score: string }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preds))
}

export const MainPage: React.FC = () => {
  const [predictions, setPredictions] = React.useState(loadPredictions)

  const handlePredict = (matchId: number, outcome: string, score: string) => {
    const updated = { ...predictions, [matchId]: { outcome, score } }
    setPredictions(updated)
    savePredictions(updated)
  }

  const completedCount = Object.keys(predictions).length

  return (
    <div className="main-page">
      <div className="page-header">
        <h1>Week 1</h1>
        <p className="page-subtitle">June 11–17, 2026</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(completedCount / WEEK1_MATCHES.length) * 100}%` }}
          />
        </div>
        <p className="progress-text">{completedCount} / {WEEK1_MATCHES.length} predicted</p>
      </div>

      <div className="matches-list">
        {WEEK1_MATCHES.map(match => (
          <MatchCard
            key={match.id}
            match={match}
            prediction={predictions[match.id] || null}
            onPredict={handlePredict}
          />
        ))}
      </div>
    </div>
  )
}
