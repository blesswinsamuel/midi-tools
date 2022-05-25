import React, { useRef } from 'react'
import { PolySynth, ToneAudioNode } from 'tone'
import { Input, Output } from 'webmidi'
import { HTMLTable, Tab, Tabs } from '@blueprintjs/core'
import { useWebMidiDevices } from '../../components/WebMidi'

function DeviceTable({ devices }: { devices: (Input | Output)[] }) {
  return (
    <HTMLTable>
      <thead>
        <tr>
          {/* <th>Connection</th> */}
          <th>ID</th>
          <th>Manufacturer</th>
          <th>Name</th>
          {/* <th>State</th> */}
          {/* <th>Type</th> */}
        </tr>
      </thead>
      <tbody>
        {devices.map((input) => (
          <tr key={input.id}>
            {/* <td>{input.connection}</td> */}
            <td>{input.id}</td>
            <td>{input.manufacturer}</td>
            <td>{input.name}</td>
            {/* <td>{input.state}</td> */}
            {/* <td>{input.type}</td> */}
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  )
}

export default function MidiDevices() {
  const synth = useRef<ToneAudioNode | null>(null)
  if (synth.current === null) {
    synth.current = new PolySynth().toDestination()
  }

  const { inputs, outputs } = useWebMidiDevices()

  return (
    <Tabs id="midi-devices">
      <Tab id="in" title="Inputs" panel={<DeviceTable devices={inputs} />} />
      <Tab id="out" title="Outputs" panel={<DeviceTable devices={outputs} />} />
    </Tabs>
  )
}
