import { useCallback, useEffect, useRef, useState } from 'react'

export default function useAnimationState<S>(initialState: S): [S, (value: S) => void] {
  const prevStateRef = useRef(initialState)
  const animationFrameRef = useRef<number | null>(null)
  const [state, setState] = useState(initialState)

  const refSetState = useCallback(
    (newState: S) => {
      const onFrame = () => {
        if (newState !== prevStateRef.current) {
          setState(newState)
          prevStateRef.current = newState
        }
      }
      const loop = () => {
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        animationFrameRef.current = requestAnimationFrame(onFrame)
      }
      loop()
    },
    [animationFrameRef, prevStateRef, setState]
  )

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animationFrameRef])

  return [state, refSetState]
}
