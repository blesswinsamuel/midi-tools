import React, { useEffect, useRef } from 'react'
import Tone from 'tone'
import WebMidi from 'webmidi'
import MidiDeviceSelector from '../components/MidiDeviceSelector'
import useLocalStorageState from '../components/hooks/useLocalStorageState'

function DeviceSelector({ setDeviceIds, deviceIds }) {
  return (
    <>
      <MidiDeviceSelector
        mode="input"
        label="Input"
        value={deviceIds.input}
        onChange={v => {
          setDeviceIds(d => ({ ...d, input: v }))
        }}
      />
      <MidiDeviceSelector
        mode="input"
        label="Input Controller"
        value={deviceIds.inputController}
        onChange={v => {
          setDeviceIds(d => ({ ...d, inputController: v }))
        }}
      />
    </>
  )
}

//create a synth and connect it to the master output (your speakers)
export default function Synth() {
  const synth = useRef(null)
  if (synth.current === null) {
    synth.current = new Tone.PolySynth(10, Tone.Synth).toMaster()
  }

  const [deviceIds, setDeviceIds] = useLocalStorageState(
    'instrument:devices',
    {}
  )
  const devices = {
    input: WebMidi.getInputById(deviceIds.input),
    inputController: WebMidi.getInputById(deviceIds.inputController),
  }

  useEffect(() => {
    if (!devices.input) return
    const listener = e => {
      const note = e.note.name + e.note.octave
      if (e.rawVelocity > 0) {
        synth.current.triggerAttack(note, undefined, e.velocity)
      } else {
        synth.current.triggerRelease(note)
      }
    }
    devices.input.addListener('noteon', 'all', listener)
    devices.input.addListener('noteoff', 'all', listener)
    return () => {
      if (!devices.input) return
      devices.input.removeListener('noteon', 'all', listener)
      devices.input.removeListener('noteoff', 'all', listener)
    }
  }, [devices.input])

  return (
    <div>
      <DeviceSelector deviceIds={deviceIds} setDeviceIds={setDeviceIds} />
    </div>
  )
}
