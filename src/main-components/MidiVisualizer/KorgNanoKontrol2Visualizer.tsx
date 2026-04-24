import React from 'react'
import { useEffect } from 'react'
import { ControlChangeMessageEvent, Input } from 'webmidi'
import useAnimationState from '../../components/hooks/useAnimationState'
import Knob from '../../components/Knob'

function MixerSlider({ inputController, controllerNumber }: { inputController: false | Input; controllerNumber: number }) {
  const [value, setValue] = useAnimationState(0)
  useEffect(() => {
    if (!inputController) return
    const listener = (e: ControlChangeMessageEvent) => {
      if (e.controller.number === controllerNumber) {
        setValue(e.rawValue as number)
      }
    }
    const options = { channels: undefined }
    inputController.addListener('controlchange', listener, options)
    return () => {
      inputController.removeListener('controlchange', listener, options)
    }
  }, [inputController, controllerNumber, setValue])
  return (
    <div className="flex justify-center h-24">
      <input
        type="range"
        min={0}
        max={127}
        step={1}
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        className="appearance-none w-1 h-full cursor-pointer rounded-full [writing-mode:vertical-lr] [direction:rtl]"
        style={{ WebkitAppearance: 'slider-vertical' }}
      />
    </div>
  )
}

function MixerKnob({ inputController, controllerNumber }: { inputController: false | Input; controllerNumber: number }) {
  const [value, setValue] = useAnimationState(0)
  useEffect(() => {
    if (!inputController) return
    const listener = (e: ControlChangeMessageEvent) => {
      if (e.controller.number === controllerNumber) {
        setValue(e.rawValue as number)
      }
    }
    const options = { channels: undefined }
    inputController.addListener('controlchange', listener, options)
    return () => {
      inputController.removeListener('controlchange', listener, options)
    }
  }, [inputController, controllerNumber, setValue])
  return <Knob min={0} max={127} stepSize={1} value={value} onChange={setValue} />
}

export default function KorgNanoKontrolVisualizer({ inputController }: { inputController: false | Input }) {
  return (
    <div className="flex gap-8 m-3">
      {Array.of(0, 1, 2, 3, 4, 5, 6, 7).map((n) => (
        <div key={n} className="flex flex-col gap-3">
          <MixerKnob inputController={inputController} controllerNumber={n + 16} />
          <MixerSlider inputController={inputController} controllerNumber={n} />
        </div>
      ))}
    </div>
  )
}
