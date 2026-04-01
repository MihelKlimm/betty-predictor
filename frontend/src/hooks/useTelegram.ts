import { useEffect, useState } from 'react'
import WebApp from '@twa-dev/sdk'

export const useTelegram = () => {
  const [tg, setTg] = useState(WebApp)

  useEffect(() => {
    setTg(WebApp)
    WebApp.ready()
    WebApp.setHeaderColor('#ffd90f')
    WebApp.setBackgroundColor('#ffd90f')
  }, [])

  return {
    tg,
    user: WebApp.initData && WebApp.initDataUnsafe?.user,
    userId: WebApp.initDataUnsafe?.user?.id,
    initData: WebApp.initData,
  }
}

export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const colorScheme = WebApp.colorScheme
    setIsDark(colorScheme === 'dark')
  }, [])

  return { isDark }
}
