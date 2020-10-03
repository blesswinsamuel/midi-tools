import React, { useEffect, useRef } from 'react'
import Tone from 'tone'
import WebMidi, { InputEventChannelBase } from 'webmidi'
import MidiDeviceSelector from '../MidiDeviceSelector'
import useLocalStorageState from '../hooks/useLocalStorageState'

export default function MidiRouter() {
  const synth = useRef(null)
  if (synth.current === null) {
    synth.current = new Tone.PolySynth(10, Tone.Synth).toMaster()
  }

  const [inDevice, setInDevice] = useLocalStorageState(
    'router:indevice',
    undefined
  )
  const [outDevice, setOutDevice] = useLocalStorageState(
    'router:outdevice',
    undefined
  )

  useEffect(() => {
    const deviceIn = WebMidi.getInputById(inDevice)
    const deviceOut = WebMidi.getOutputById(outDevice)

    if (!deviceIn || !deviceOut) return
    const listener = (e: InputEventChannelBase<any>) => {
      deviceOut.send(e.data[0], Array.from(e.data.slice(1)))
    }
    deviceIn.addListener('midimessage', undefined, listener)
    return () => {
      if (!deviceIn) return
      deviceIn.removeListener('midimessage', undefined, listener)
    }
  }, [inDevice, outDevice])

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
