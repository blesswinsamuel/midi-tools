import { Card, ControlGroup, Divider, Slider } from '@blueprintjs/core'
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
  return <Slider min={0} max={127} stepSize={1} labelStepSize={16} onChange={(v) => setValue(v)} value={value} vertical />
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
    <ControlGroup style={{ display: 'flex', columnGap: '32px', margin: '12px' }}>
      {Array.of(0, 1, 2, 3, 4, 5, 6, 7).map((n) => (
        <div key={n} style={{ display: 'flex', flexDirection: 'column', rowGap: '12px' }}>
          <MixerKnob inputController={inputController} controllerNumber={n + 16} />
          <MixerSlider inputController={inputController} controllerNumber={n} />
        </div>
      ))}
    </ControlGroup>
  )
}
