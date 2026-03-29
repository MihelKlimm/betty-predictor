import { create } from 'zustand'
import { User, Prediction, Match } from '../types'

interface AppStore {
  // User state
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void

  // Matches state
  activeMatches: Match[]
  setActiveMatches: (matches: Match[]) => void

  // Predictions state
  predictions: Prediction[]
  setPredictions: (predictions: Prediction[]) => void
  addPrediction: (prediction: Prediction) => void

  // UI state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  activeMatches: [],
  setActiveMatches: (activeMatches) => set({ activeMatches }),

  predictions: [],
  setPredictions: (predictions) => set({ predictions }),
  addPrediction: (prediction) => set((state) => ({ 
    predictions: [prediction, ...state.predictions] 
  })),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),
}))
