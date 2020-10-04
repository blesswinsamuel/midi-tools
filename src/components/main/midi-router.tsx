import React, { useEffect } from 'react'
import { InputEventChannelBase } from 'webmidi'
import MidiDeviceSelector from '../MidiDeviceSelector'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { useWebMidiDevice } from '../WebMidi'

export default function MidiRouter() {
  const [inDevice, setInDevice] = useLocalStorageState(
    'router:indevice',
    undefined
  )
  const [outDevice, setOutDevice] = useLocalStorageState(
    'router:outdevice',
    undefined
  )
  const deviceIn = useWebMidiDevice('input', inDevice)
  const deviceOut = useWebMidiDevice('output', outDevice)

  useEffect(() => {
    if (!deviceIn || !deviceOut) return
    const listener = (e: InputEventChannelBase<any>) => {
      deviceOut.send(e.data[0], Array.from(e.data.slice(1)))
    }
    deviceIn.addListener('midimessage', undefined, listener)
    return () => {
      if (!deviceIn) return
      deviceIn.removeListener('midimessage', undefined, listener)
    }
  }, [deviceIn, deviceOut])

  return (
    <div>
      <MidiDeviceSelector
        mode="input"
        label="Input"
        value={inDevice}
        onChange={setInDevice}
      />
      <MidiDeviceSelector
        mode="output"
        label="Output"
        value={outDevice}
        onChange={setOutDevice}
      />
    </div>
  )
}
