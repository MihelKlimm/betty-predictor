import React from 'react'
import './styles/App.css'
import { useStore } from './store'
import { useTelegram } from './hooks/useTelegram'
import { userApi, matchesApi } from './services/api'
import { LandingPage } from './pages/LandingPage'
import { MainPage } from './pages/MainPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { ChampionsPage } from './pages/ChampionsPage'
import { AboutPage } from './pages/AboutPage'
import { Navigation } from './components/Navigation'

type Page = 'landing' | 'champions' | 'about' | 'matches' | 'leaderboard'

function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('landing')
  const { tg, userId, user: tgUser } = useTelegram()
  const { user, setUser, setActiveMatches, isLoading, setIsLoading } = useStore()

  React.useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true)
        
        // Register or get user
        if (tgUser && userId) {
          try {
            // Try to get user first
            const { data } = await userApi.getMe()
            setUser(data)
          } catch (error) {
            console.error('Get user failed, registering new user:', error)
            // Register new user (including name fields)
            try {
              const { data } = await userApi.register({
                tg_id: String(userId),
                first_name: tgUser.first_name || 'TelegramUser',
                last_name: tgUser.last_name,
                username: tgUser.username,
              })
              setUser(data)
            } catch (regError) {
              console.error('Registration failed:', regError)
              // Create a temporary user object so app isn't stuck
              setUser({
                id: String(userId),
                tg_id: String(userId),
                username: tgUser.username,
                points: 0,
                predictions_count: 0,
              } as any)
            }
          }

          // Store token
          localStorage.setItem('tg_token', tgUser.id?.toString() || '')
        } else {
          // No Telegram user - create a test user for development
          console.log('No Telegram user detected, using test mode')
          setUser({
            id: 'test_user',
            tg_id: 'test_123',
            username: 'TestUser',
            points: 0,
            predictions_count: 0,
          } as any)
        }

        // Load active matches
        try {
          const { data: matches } = await matchesApi.getActive()
          setActiveMatches(matches)
        } catch (matchError) {
          console.error('Error loading matches:', matchError)
          setActiveMatches([])
        }
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [tgUser, userId, setUser, setActiveMatches, setIsLoading])

  React.useEffect(() => {
    if (tg) {
      tg.MainButton.hide()
    }
  }, [tg])

  if (isLoading || !user) {
    return (
      <div className="app loading">
        <div className="spinner"></div>
        <p>Loading Betty...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app-content">
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'champions' && <ChampionsPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'matches' && <MainPage />}
        {currentPage === 'leaderboard' && <LeaderboardPage />}
      </div>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}

export default App
