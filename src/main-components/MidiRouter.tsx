import React, { useEffect, useState } from 'react'
import { MessageEvent } from 'webmidi'
import MidiDeviceSelector from '../components/MidiDeviceSelector'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import { useWebMidiDevice } from '../components/WebMidi'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function MidiRouter() {
  const [inDevice, setInDevice] = useLocalStorageState<string | undefined>('router:indevice', undefined)
  const [outDevice, setOutDevice] = useLocalStorageState<string | undefined>('router:outdevice', undefined)
  const deviceIn = useWebMidiDevice('input', inDevice)
  const deviceOut = useWebMidiDevice('output', outDevice)
  const [transpose, setTranspose] = useState(0)

  useEffect(() => {
    if (!deviceIn || !deviceOut) return
    const listener = (e: MessageEvent) => {
      // https://www.midi.org/specifications-old/item/table-2-expanded-messages-list-status-bytes
      const rawData = e.message.rawData
      if (rawData[0] >= 0x80 && rawData[0] <= 0x9f) {
        rawData[1] += transpose
      }
      deviceOut.send(rawData)
    }
    deviceIn.addListener('midimessage', listener)
    return () => {
      if (!deviceIn) return
      deviceIn.removeListener('midimessage', listener)
    }
  }, [deviceIn, deviceOut, transpose])

  return (
    <div className="flex gap-3 flex-wrap items-end">
      <MidiDeviceSelector mode="input" label="Input" value={inDevice} onChange={setInDevice} />
      <MidiDeviceSelector mode="output" label="Output" value={outDevice} onChange={setOutDevice} />
      <div className="flex flex-col gap-1.5">
        <Label>Transpose</Label>
        <div className="flex">
          <Button variant="outline" size="sm" className="rounded-r-none" onClick={() => setTranspose((t) => t - 1)}>-</Button>
          <Button variant="ghost" size="sm" className="rounded-none px-3 min-w-8" onClick={() => setTranspose(0)}>{transpose}</Button>
          <Button variant="outline" size="sm" className="rounded-l-none" onClick={() => setTranspose((t) => t + 1)}>+</Button>
        </div>
      </div>
    </div>
  )
}
