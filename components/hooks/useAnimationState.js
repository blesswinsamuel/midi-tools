import { useCallback, useEffect, useRef, useState } from 'react'

export default function useAnimationState(initialState) {
  const prevStateRef = useRef(initialState)
  const animationFrameRef = useRef(null)
  const [state, setState] = useState(initialState)

  const refSetState = useCallback(
    newState => {
      const onFrame = () => {
        if (newState !== prevStateRef.current) {
          setState(newState)
          prevStateRef.current = newState
        }
      }
      const loop = () => {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = requestAnimationFrame(onFrame)
      }
      loop()
    },
    [animationFrameRef, prevStateRef, setState],
  )

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [animationFrameRef])

  return [state, refSetState]
}
