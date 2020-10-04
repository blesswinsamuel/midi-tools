import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

type WakeLockContextState = {
  wakeLockEnabled: Boolean
  requestWakeLock: () => void
  releaseWakeLock: () => void
}

const WakeLockContext = createContext<WakeLockContextState>({
  wakeLockEnabled: false,
  requestWakeLock: () => {},
  releaseWakeLock: () => {},
})

export function WakeLockProvider({ children }) {
  const [
    wakeLockEnabled,
    requestWakeLock,
    releaseWakeLock,
  ] = useRequestWakeLock()

  return (
    <WakeLockContext.Provider
      value={{ wakeLockEnabled, requestWakeLock, releaseWakeLock }}
    >
      {children}
    </WakeLockContext.Provider>
  )
}

function useRequestWakeLock() {
  // The wake lock sentinel.
  const [wakeLockEnabled, setWakeLockEnabled] = useState(false)
  const [wakeLock, setWakeLock] = useState(null)
  const wakeLockRef = useRef(null)
  const wakeLockUserRequestedRef = useRef(true)

  const requestWakeLock = useCallback(async () => {
    try {
      if (!('wakeLock' in navigator)) return

      const wakeLock = await navigator.wakeLock.request('screen')
      setWakeLock(wakeLock)
      wakeLockRef.current = wakeLock
      wakeLockUserRequestedRef.current = true
      setWakeLockEnabled(true)
      console.log('Requested WakeLock:', wakeLock.released)
    } catch (err) {
      // the wake lock request fails - usually system related, such low as battery
      console.error(`${err.name}, ${err.message}`)
    }
  }, [])

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockUserRequestedRef.current = false
      wakeLockRef.current.release()
    }
  }, [])

  // request wakelock on initial mount
  useEffect(() => {
    requestWakeLock()
  }, [requestWakeLock])

  // request wakelock on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        wakeLockUserRequestedRef.current &&
        document.visibilityState === 'visible'
      ) {
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
        console.log('Screen Wake Lock released:', wakeLock.released)
      }
      wakeLock.addEventListener('release', listener)
      return () => wakeLock.removeEventListener('release', listener)
    }
  }, [wakeLock])

  return [wakeLockEnabled, requestWakeLock, releaseWakeLock, wakeLock]
}

export function useWakeLock() {
  return useContext(WakeLockContext)
}
