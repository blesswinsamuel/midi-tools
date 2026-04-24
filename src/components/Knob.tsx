import React, { useCallback, useEffect, useRef, useState } from 'react'

export default function Knob({ max, min, onChange, value, stepSize }: any) {
  const [isPinching, setPinching] = useState(false)
  const prevValue = useRef(value)
  const divRef = useRef<any>(null)
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

  const pct = (value - min) / (max - min)
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - pct)

  return (
    <div ref={divRef} style={{ position: 'relative', cursor: 'grab', width: 40, height: 40 }} onMouseDown={handleMouseDown}>
      <svg width={40} height={40} viewBox="0 0 40 40">
        <circle cx={20} cy={20} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={3} />
        <circle
          cx={20} cy={20} r={radius}
          fill="none"
          stroke={isPinching ? 'hsl(var(--primary))' : 'currentColor'}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          textAlign: 'center',
          fontSize: '9px',
        }}
      >
        {value}
      </div>
    </div>
  )
}
