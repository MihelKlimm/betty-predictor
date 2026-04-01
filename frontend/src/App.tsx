import React from 'react'
import './styles/App.css'
import { useTelegram } from './hooks/useTelegram'
import { MainPage } from './pages/MainPage'
import { Navigation } from './components/Navigation'
import { LandingPage } from './pages/LandingPage'
import { ChampionsPage } from './pages/ChampionsPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AboutPage } from './pages/AboutPage'

type Page = 'matches' | 'champions' | 'leaderboard' | 'about' | 'landing'

function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('matches')
  const { tg } = useTelegram()

  React.useEffect(() => {
    if (tg) {
      tg.MainButton.hide()
      tg.expand()
    }
  }, [tg])

  return (
    <div className="app">
      <div className="app-content">
        {currentPage === 'matches' && <MainPage />}
        {currentPage === 'champions' && <ChampionsPage />}
        {currentPage === 'leaderboard' && <LeaderboardPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'landing' && <LandingPage />}
      </div>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}

export default App
