import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import useThrottle from './useThrottle'

const PREFIX = 'midi:'

const ls = {
  getItem(key: string, defaultValue: any) {
    try {
      const token = localStorage.getItem(PREFIX + key)
      return token ? JSON.parse(token) : defaultValue
    } catch (err) {
      console.warn(`Failed to parse ${key}: ${err}`)
      return defaultValue
    }
  },

  saveItem(key: string, value: any) {
    try {
      if (value !== undefined) {
        localStorage.setItem(PREFIX + key, JSON.stringify(value))
      } else {
        localStorage.removeItem(PREFIX + key)
      }
    } catch (err) {
      console.warn(`Failed to save ${key}: ${err}`)
    }
  },
}

function useLocalStorageState<S>(
  key: string,
  initialValue: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const lsState = useMemo(() => ls.getItem(key, initialValue), [
    key,
    initialValue,
  ])
  const [state, setState] = useState(lsState)
  const throttledState = useThrottle(state, 1000)
  useEffect(() => {
    ls.saveItem(key, throttledState)
  }, [key, throttledState])
  return [state, setState]
}

export default useLocalStorageState
