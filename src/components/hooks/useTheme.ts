import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) ?? 'system'
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  // Keep in sync when system preference changes
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setThemeState('system') // re-trigger resolvedTheme recalc
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  function setTheme(next: Theme) {
    localStorage.setItem('theme', next)
    setThemeState(next)
  }

  return { theme, resolvedTheme, setTheme }
}
