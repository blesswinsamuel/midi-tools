import { Intent, Spinner } from '@blueprintjs/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function Knob({ max, min, onChange, value, stepSize }: any) {
  const [isPinching, setPinching] = useState(false)
  const prevValue = useRef(value)
  const divRef = useRef<any>()
  const xyRef = useRef({ x: 0, y: 0 })

  const getXY = useCallback(
    (e: any) => {
      const { left, top, width, height } = divRef.current.getBoundingClientRect()
      const x = e.pageX - (left + width / 2)
      const y = top + height / 2 - e.pageY
      return { x, y }
    },
    [divRef]
  )

  const handleMouseDown: React.MouseEventHandler = (e) => {
    e.preventDefault()

    xyRef.current = getXY(e)

    setPinching(true)
  }

  useEffect(() => {
    const handleMouseUp = () => {
      setPinching(false)
    }

    const handleMouseMove: any = (e: any) => {
      if (isPinching) {
        const { x, y } = getXY(e)

        const dx = x - xyRef.current.x
        const dy = y - xyRef.current.y

        xyRef.current = { x, y }

        let newValue = prevValue.current + dx + dy

        if (newValue < min) {
          newValue = min
        }

        if (newValue > max) {
          newValue = max
        }

        onChange(newValue)
        prevValue.current = newValue
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [getXY, onChange, isPinching, prevValue, min, max])

  return (
    <div ref={divRef} style={{ position: 'relative', cursor: 'grab' }} onMouseDown={handleMouseDown}>
      <Spinner value={(value - min) / (max - min)} intent={isPinching ? Intent.PRIMARY : Intent.NONE} size={40} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          textAlign: 'center',
        }}
      >
        {value}
      </div>
    </div>
  )
}
