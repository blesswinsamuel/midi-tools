import React, { useEffect, useRef } from 'react'
import MidiDeviceSelector from '../MidiDeviceSelector'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { useWebMidiDevice } from '../WebMidi'
import MidiPiano from '../MidiPiano'

export default function MidiInstrument() {
  const [inDevice, setInDevice] = useLocalStorageState(
    'instrument:input',
    undefined
  )
  const deviceIn = useWebMidiDevice('input', inDevice)

  return (
    <div>
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
