import React, { useEffect, useState } from 'react'
import { InputEventBase } from 'webmidi'
import MidiDeviceSelector from '../MidiDeviceSelector'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { useWebMidiDevice } from '../WebMidi'
import { Button, ButtonGroup } from '@blueprintjs/core'

export default function MidiRouter() {
  const [inDevice, setInDevice] = useLocalStorageState<string | undefined>(
    'router:indevice',
    undefined
  )
  const [outDevice, setOutDevice] = useLocalStorageState<string | undefined>(
    'router:outdevice',
    undefined
  )
  const deviceIn = useWebMidiDevice('input', inDevice)
  const deviceOut = useWebMidiDevice('output', outDevice)
  const [transpose, setTranspose] = useState(0)

  useEffect(() => {
    if (!deviceIn || !deviceOut) return
    const listener = (e: InputEventBase<'midimessage'>) => {
      // https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
      const data = Array.from(e.data.slice(1))
      if (e.data[0] >= 0x80 && e.data[0] <= 0x9f) {
        data[0] += transpose
      }
      deviceOut.send(e.data[0], data)
    }
    deviceIn.addListener('midimessage', undefined, listener)
    return () => {
      if (!deviceIn) return
      deviceIn.removeListener('midimessage', undefined, listener)
    }
  }, [deviceIn, deviceOut, transpose])

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
      <span> </span>
      <ButtonGroup>
        <Button text="-" onClick={() => setTranspose((t) => t - 1)} />
        <Button text={transpose} minimal onClick={() => setTranspose(0)} />
        <Button text="+" onClick={() => setTranspose((t) => t + 1)} />
      </ButtonGroup>
    </div>
  )
}
