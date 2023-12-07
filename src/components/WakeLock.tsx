import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

type WakeLockContextState = {
  wakeLockEnabled: boolean
  requestWakeLock: () => void
  releaseWakeLock: () => void
}

const WakeLockContext = createContext<WakeLockContextState>({
  wakeLockEnabled: false,
  requestWakeLock: () => {},
  releaseWakeLock: () => {},
})

export const WakeLockProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { wakeLockEnabled, requestWakeLock, releaseWakeLock } = useRequestWakeLock()

  return <WakeLockContext.Provider value={{ wakeLockEnabled, requestWakeLock, releaseWakeLock }}>{children}</WakeLockContext.Provider>
}

function useRequestWakeLock() {
  // The wake lock sentinel.
  const [wakeLockEnabled, setWakeLockEnabled] = useState(false)
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const wakeLockUserRequestedRef = useRef(true)

  const requestWakeLock = useCallback(async () => {
    try {
      if (!('wakeLock' in navigator)) return

      const wakeLock = await navigator.wakeLock.request('screen')
      setWakeLock(wakeLock)
      wakeLockRef.current = wakeLock
      wakeLockUserRequestedRef.current = true
      setWakeLockEnabled(true)
      console.log(`Requested WakeLock (wakelock released: ${wakeLock.released})`)
    } catch (err: any) {
      // the wake lock request fails - usually system related, such as low battery
      console.error(`${err.name}, ${err.message}`)
    }
  }, [])

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockUserRequestedRef.current = false
      wakeLockRef.current.release()
    }
  }, [])

  // // request wakelock on initial mount
  // useEffect(() => {
  //   requestWakeLock()
  // }, [requestWakeLock])

  // request wakelock on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (wakeLockUserRequestedRef.current && document.visibilityState === 'visible') {
        requestWakeLock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [wakeLock, wakeLockEnabled, requestWakeLock])

  // Listen for wakelock release
  useEffect(() => {
    if (wakeLock) {
      const listener = () => {
        wakeLockRef.current = null
        setWakeLock(null)
        setWakeLockEnabled(false)
        console.log(`WakeLock released (wakelock released: ${wakeLock.released})`)
      }
      wakeLock.addEventListener('release', listener)
      return () => wakeLock.removeEventListener('release', listener)
    }
  }, [wakeLock])

  return { wakeLockEnabled, requestWakeLock, releaseWakeLock, wakeLock }
}

export function useWakeLock() {
  return useContext(WakeLockContext)
}
