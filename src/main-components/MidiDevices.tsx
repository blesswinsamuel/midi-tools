import React from 'react'
import { Input, Output } from 'webmidi'
import { useWebMidiDevices } from '../components/WebMidi'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

function DeviceTable({ devices }: { devices: (Input | Output)[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Connection</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Manufacturer</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {devices.map((input) => (
          <TableRow key={input.id}>
            <TableCell>{input.connection}</TableCell>
            <TableCell>{input.id}</TableCell>
            <TableCell>{input.manufacturer}</TableCell>
            <TableCell>{input.name}</TableCell>
            <TableCell>{input.state}</TableCell>
            <TableCell>{input.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function MidiDevices() {
  const [showInputs, setShowInputs] = useLocalStorageState('midi-devices:inputs', true)
  const [showOutputs, setShowOutputs] = useLocalStorageState('midi-devices:outputs', true)

  const { inputs, outputs } = useWebMidiDevices()
  const devices = [...inputs, ...outputs]
  const filteredDevices = devices.filter((device) => {
    if (!showInputs && !showOutputs) return true
    if (device.type === 'input' && showInputs) return true
    if (device.type === 'output' && showOutputs) return true
  })
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        <Button
          variant={showInputs ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowInputs((v: boolean) => !v)}
        >
          Inputs
        </Button>
        <Button
          variant={showOutputs ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowOutputs((v: boolean) => !v)}
        >
          Outputs
        </Button>
      </div>
      <DeviceTable devices={filteredDevices} />
    </div>
  )
}
