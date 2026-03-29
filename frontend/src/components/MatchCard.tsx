import React, { useEffect } from 'react'
import { Match } from '../types'
import { predictionsApi } from '../services/api'
import { useStore } from '../store'
import '../styles/MatchCard.css'

interface MatchCardProps {
  match: Match
}

type PredictionType = '1' | 'X' | '2'

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const [prediction, setPrediction] = React.useState<PredictionType | null>(null)
  const [predictedScore, setPredictedScore] = React.useState<{ home: number; away: number } | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showScoreInput, setShowScoreInput] = React.useState(false)
  const { addPrediction } = useStore()

  const handlePrediction = async (type: PredictionType) => {
    setPrediction(type)
  }

  const submitPrediction = async () => {
    if (!prediction) return

    try {
      setIsLoading(true)
      const { data } = await predictionsApi.create({
        match_id: match.id,
        prediction_type: prediction,
        predicted_score: predictedScore || undefined,
      })
      addPrediction(data)
      setPrediction(null)
      setPredictedScore(null)
      setShowScoreInput(false)
    } catch (error) {
      console.error('Error creating prediction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isMatchFinished = match.status === 'finished'
  const isMatchLive = match.status === 'live'

  return (
    <div className={`match-card ${isMatchFinished ? 'finished' : ''} ${isMatchLive ? 'live' : ''}`}>
      <div className="match-header">
        <span className="match-date">{new Date(match.date).toLocaleDateString()}</span>
        <span className={`match-status ${match.status}`}>{match.status.toUpperCase()}</span>
      </div>

      <div className="match-body">
        <div className="match-details">
          <div className="team home-team">
            <div className="team-name">{match.home_team}</div>
            {isMatchFinished && <div className="team-score">{match.home_score}</div>}
          </div>

          <div className="match-vs">
            {isMatchFinished ? (
              <div className="final-score">
                {match.home_score} - {match.away_score}
              </div>
            ) : (
              <div className="vs">VS</div>
            )}
          </div>

          <div className="team away-team">
            <div className="team-name">{match.away_team}</div>
            {isMatchFinished && <div className="team-score">{match.away_score}</div>}
          </div>
        </div>

        {!isMatchFinished && !prediction && (
          <div className="prediction-buttons">
            <button className="btn btn-1" onClick={() => handlePrediction('1')} disabled={isLoading}>
              WIN 1
            </button>
            <button className="btn btn-x" onClick={() => handlePrediction('X')} disabled={isLoading}>
              DRAW
            </button>
            <button className="btn btn-2" onClick={() => handlePrediction('2')} disabled={isLoading}>
              WIN 2
            </button>
          </div>
        )}

        {prediction && !isMatchFinished && (
          <div className="prediction-form">
            <div className="selected-prediction">
              <p>You predicted: <strong>{prediction === '1' ? 'HOME WIN' : prediction === '2' ? 'AWAY WIN' : 'DRAW'}</strong></p>
            </div>

            <div className="score-input-section">
              <label>
                <input
                  type="checkbox"
                  checked={showScoreInput}
                  onChange={(e) => setShowScoreInput(e.target.checked)}
                />
                Predict exact score (+3 points)
              </label>

              {showScoreInput && (
                <div className="score-inputs">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Home goals"
                    value={predictedScore?.home || ''}
                    onChange={(e) =>
                      setPredictedScore({
                        home: parseInt(e.target.value) || 0,
                        away: predictedScore?.away || 0,
                      })
                    }
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    placeholder="Away goals"
                    value={predictedScore?.away || ''}
                    onChange={(e) =>
                      setPredictedScore({
                        home: predictedScore?.home || 0,
                        away: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div className="prediction-actions">
              <button 
                className="btn btn-primary" 
                onClick={submitPrediction} 
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Prediction'}
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setPrediction(null)
                  setPredictedScore(null)
                  setShowScoreInput(false)
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
