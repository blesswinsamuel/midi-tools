import React, { useEffect, useRef, useState } from 'react'
import { WebMidi, NoteMessageEvent } from 'webmidi'
import MidiDeviceSelector from '../../components/MidiDeviceSelector'
import useLocalStorageState from '../../components/hooks/useLocalStorageState'
import * as Tone from 'tone'
import { Button, FormGroup } from '@blueprintjs/core'

type Devices = { input?: string; inputController?: string }

type DeviceSelectorProps = {
  setDeviceIds: (v: any) => void
  deviceIds: Devices
}

export default function MidiSynth() {
  const [started, setStarted] = useState(false)
  const synth = useRef<Tone.PolySynth | null>(null)

  const [deviceIds, setDeviceIds] = useLocalStorageState<Devices>('instrument:devices', {})
  const devices = {
    input: deviceIds?.input ? WebMidi.getInputById(deviceIds.input) : undefined,
    inputController: deviceIds?.inputController ? WebMidi.getInputById(deviceIds.inputController) : undefined,
  }

  const startTone = async () => {
    await Tone.start()
    setStarted(true)
    console.log('Tone.js started')
    if (synth.current) return
    synth.current = new Tone.PolySynth(undefined, {
      envelope: {
        attack: 0.005,
        attackCurve: 'linear',
        decay: 0.1,
        decayCurve: 'exponential',
        release: 1,
        releaseCurve: 'exponential',
        sustain: 0.3,
      },
      oscillator: {
        partialCount: 0,
        phase: 0,
        type: 'triangle',
      },
    }).toDestination()
  }

  const stopSynth = () => {
    console.log('Synth disposed')
    synth.current?.dispose()
    synth.current = null
    setStarted(false)
  }

  useEffect(() => {
    return stopSynth
  }, [])

  useEffect(() => {
    if (!devices.input) return
    if (!started) return
    const noteonListener = (e: NoteMessageEvent) => {
      if (!synth.current) return
      const note = e.note.name + e.note.octave
      const velocity = (e.value || 0) as number
      synth.current.triggerAttack(note, undefined, velocity)
    }
    const noteoffListener = (e: NoteMessageEvent) => {
      if (!synth.current) return
      const note = e.note.name + e.note.octave
      synth.current.triggerRelease(note)
    }
    const options = { channels: undefined }
    devices.input.addListener('noteon', noteonListener, options)
    devices.input.addListener('noteoff', noteoffListener, options)
    // devices.input.addListener('pitchbend', listener, options)
    return () => {
      if (!devices.input) return
      devices.input.removeListener('noteon', noteonListener, options)
      devices.input.removeListener('noteoff', noteoffListener, options)
    }
  }, [started, devices.input])

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <MidiDeviceSelector
        mode="input"
        label="Input"
        value={deviceIds.input}
        onChange={(v) => {
          setDeviceIds((d: Devices) => ({ ...d, input: v }))
        }}
      />
      <MidiDeviceSelector
        mode="input"
        label="Input Controller"
        value={deviceIds.inputController}
        onChange={(v) => {
          setDeviceIds((d: Devices) => ({ ...d, inputController: v }))
        }}
      />
      <FormGroup label="‎">
        <Button onClick={!started ? startTone : stopSynth}>{!started ? 'Start' : 'Stop'}</Button>
      </FormGroup>
    </div>
  )
}
