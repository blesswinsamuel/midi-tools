import React, { useEffect, useRef } from 'react'
import { WebMidi, NoteMessageEvent } from 'webmidi'
import MidiDeviceSelector from '../components/MidiDeviceSelector'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import { PolySynth } from 'tone'

type Devices = { input?: string; inputController?: string }

type DeviceSelectorProps = {
  setDeviceIds: (v: any) => void
  deviceIds: Devices
}

function DeviceSelector({ setDeviceIds, deviceIds }: DeviceSelectorProps) {
  return (
    <>
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
    </>
  )
}

//create a synth and connect it to the master output (your speakers)
export default function MidiSynth() {
  const synth = useRef<PolySynth | null>(null)
  if (synth.current === null) {
    synth.current = new PolySynth().toDestination()
  }

  const [deviceIds, setDeviceIds] = useLocalStorageState<Devices>(
    'instrument:devices',
    {}
  )
  const devices = {
    input: deviceIds?.input ? WebMidi.getInputById(deviceIds.input) : undefined,
    inputController: deviceIds?.inputController
      ? WebMidi.getInputById(deviceIds.inputController)
      : undefined,
  }

  useEffect(() => {
    if (!devices.input) return
    const listener: (event: NoteMessageEvent) => void = (e) => {
      const note = e.note.name + e.note.octave
      const velocity = e.rawValue || 0
      if (velocity > 0) {
        synth.current?.triggerAttack(note, undefined, velocity)
      } else {
        synth.current?.triggerRelease(note)
      }
    }
    const options = { channels: undefined }
    devices.input.addListener('noteon', listener, options)
    devices.input.addListener('noteoff', listener, options)
    return () => {
      if (!devices.input) return
      devices.input.removeListener('noteon', listener, options)
      devices.input.removeListener('noteoff', listener, options)
    }
  }, [devices.input])

  return (
    <div>
      <DeviceSelector deviceIds={deviceIds} setDeviceIds={setDeviceIds} />
    </div>
  )
}
