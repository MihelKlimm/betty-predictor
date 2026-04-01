import React from 'react'
import { MatchData, SCORE_OPTIONS } from '../data/matches'
import '../styles/MatchCard.css'

interface MatchCardProps {
  match: MatchData
  prediction: { outcome: string; score: string } | null
  onPredict: (matchId: number, outcome: string, score: string) => void
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, prediction, onPredict }) => {
  const [selectedOutcome, setSelectedOutcome] = React.useState<string | null>(
    prediction?.outcome || null
  )
  const [selectedScore, setSelectedScore] = React.useState<string | null>(
    prediction?.score || null
  )
  const [confirmed, setConfirmed] = React.useState(!!prediction)

  const handleOutcome = (outcome: string) => {
    if (confirmed) return
    setSelectedOutcome(outcome)
    setSelectedScore(null)
  }

  const handleScore = (score: string) => {
    if (confirmed) return
    setSelectedScore(score)
  }

  const handleConfirm = () => {
    if (selectedOutcome && selectedScore) {
      onPredict(match.id, selectedOutcome, selectedScore)
      setConfirmed(true)
    }
  }

  const handleEdit = () => {
    setConfirmed(false)
  }

  // Filter scores based on selected outcome
  const filteredScores = SCORE_OPTIONS.filter(s => {
    const [h, a] = s.split(':').map(Number)
    if (selectedOutcome === '1') return h > a
    if (selectedOutcome === '2') return a > h
    if (selectedOutcome === 'X') return h === a
    return true
  })

  return (
    <div className={`mc ${confirmed ? 'mc--done' : ''}`}>
      <div className="mc__header">
        <span className="mc__group">Group {match.group}</span>
        <span className="mc__date">{match.date}</span>
      </div>
      <div className="mc__venue">{match.venue}</div>

      <div className="mc__teams">
        <div className="mc__team">
          <span className="mc__flag">{match.home.flag}</span>
          <span className="mc__name">{match.home.name}</span>
          <span className="mc__player">{match.home.keyPlayer}</span>
        </div>
        <div className="mc__vs">VS</div>
        <div className="mc__team">
          <span className="mc__flag">{match.away.flag}</span>
          <span className="mc__name">{match.away.name}</span>
          <span className="mc__player">{match.away.keyPlayer}</span>
        </div>
      </div>

      <div className="mc__outcomes">
        <button
          className={`mc__btn mc__btn--w1 ${selectedOutcome === '1' ? 'mc__btn--active' : ''}`}
          onClick={() => handleOutcome('1')}
          disabled={confirmed}
        >
          WIN 1
        </button>
        <button
          className={`mc__btn mc__btn--draw ${selectedOutcome === 'X' ? 'mc__btn--active' : ''}`}
          onClick={() => handleOutcome('X')}
          disabled={confirmed}
        >
          DRAW
        </button>
        <button
          className={`mc__btn mc__btn--w2 ${selectedOutcome === '2' ? 'mc__btn--active' : ''}`}
          onClick={() => handleOutcome('2')}
          disabled={confirmed}
        >
          WIN 2
        </button>
      </div>

      {selectedOutcome && (
        <div className="mc__scores">
          <div className="mc__scores-label">Exact score:</div>
          <div className="mc__scores-grid">
            {filteredScores.map(s => (
              <button
                key={s}
                className={`mc__score ${selectedScore === s ? 'mc__score--active' : ''}`}
                onClick={() => handleScore(s)}
                disabled={confirmed}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedOutcome && selectedScore && !confirmed && (
        <button className="mc__confirm" onClick={handleConfirm}>
          Confirm prediction
        </button>
      )}

      {confirmed && (
        <div className="mc__saved">
          <span className="mc__saved-text">
            {selectedOutcome === '1' ? match.home.name + ' wins' : selectedOutcome === '2' ? match.away.name + ' wins' : 'Draw'} — {selectedScore}
          </span>
          <button className="mc__edit" onClick={handleEdit}>Edit</button>
        </div>
      )}
    </div>
  )
}
