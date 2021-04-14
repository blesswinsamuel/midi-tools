import React from 'react'
import MidiDeviceSelector from '../../components/MidiDeviceSelector'
import useLocalStorageState from '../../components/hooks/useLocalStorageState'
import { useWebMidiDevice } from '../../components/WebMidi'
import MidiPiano from '../../components/MidiPiano'

export default function MidiInstrument() {
  const [inDevice, setInDevice] = useLocalStorageState<string | undefined>(
    'instrument:input',
    undefined
  )
  const deviceIn = useWebMidiDevice('input', inDevice)

  return (
    <div className="space-y-3">
      <MidiDeviceSelector
        mode="input"
        label="Input"
        value={inDevice}
        onChange={setInDevice}
      />
      <MidiPiano input={deviceIn} />
    </div>
  )
}
