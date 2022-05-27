import React, { useRef, useState } from 'react'
import { PolySynth, ToneAudioNode } from 'tone'
import { Input, Output } from 'webmidi'
import { Button, ButtonGroup, Divider, HTMLTable, Tab, Tabs } from '@blueprintjs/core'
import { useWebMidiDevices } from '../components/WebMidi'
import useLocalStorageState from '../components/hooks/useLocalStorageState'

function DeviceTable({ devices }: { devices: (Input | Output)[] }) {
  return (
    <HTMLTable condensed bordered>
      <thead>
        <tr>
          <th>Connection</th>
          <th>ID</th>
          <th>Manufacturer</th>
          <th>Name</th>
          <th>State</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((input) => (
          <tr key={input.id}>
            <td>{input.connection}</td>
            <td>{input.id}</td>
            <td>{input.manufacturer}</td>
            <td>{input.name}</td>
            <td>{input.state}</td>
            <td>{input.type}</td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  )
}

export default function MidiDevices() {
  const [showInputs, setShowInputs] = useLocalStorageState('midi-devices:inputs', true)
  const [showOutputs, setShowOutputs] = useLocalStorageState('midi-devices:outputs', true)
  const synth = useRef<ToneAudioNode | null>(null)
  if (synth.current === null) {
    synth.current = new PolySynth().toDestination()
  }

  const { inputs, outputs } = useWebMidiDevices()
  const devices = [...inputs, ...outputs]
  const filteredDevices = devices.filter((device) => {
    if (!showInputs && !showOutputs) return true
    if (device.type === 'input' && showInputs) return true
    if (device.type === 'output' && showOutputs) return true
  })
  return (
    <div>
      <ButtonGroup>
        <Button onClick={() => setShowInputs((v) => !v)} active={showInputs}>
          Inputs
        </Button>
        <Button onClick={() => setShowOutputs((v) => !v)} active={showOutputs}>
          Outputs
        </Button>
      </ButtonGroup>
      <p></p>
      <DeviceTable devices={filteredDevices} />
    </div>
  )
}
