import React from 'react'
import './styles/App.css'
import { useTelegram } from './hooks/useTelegram'
import { MainPage } from './pages/MainPage'
import { Navigation } from './components/Navigation'
import { LandingPage } from './pages/LandingPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AboutPage } from './pages/AboutPage'

type Page = 'start' | 'matches' | 'leaderboard' | 'about'

function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('start')
  const { tg } = useTelegram()

  React.useEffect(() => {
    if (tg) {
      tg.MainButton.hide()
      tg.expand()
    }
  }, [tg])

  const handleStart = () => setCurrentPage('matches')

  if (currentPage === 'start') {
    return <LandingPage onStart={handleStart} />
  }

  return (
    <div className="app">
      <div className="app-content">
        {currentPage === 'matches' && <MainPage />}
        {currentPage === 'leaderboard' && <LeaderboardPage />}
        {currentPage === 'about' && <AboutPage />}
      </div>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}

export default App
