import React from 'react'
import { useWebMidiDevices } from './WebMidi'
import Select from './Select'

type MidiDeviceSelectorProps = {
  label: string
  mode: 'input' | 'output'
  value?: string
  onChange: (v: string) => void
}

export default function MidiDeviceSelector({
  label,
  mode,
  value,
  onChange,
}: MidiDeviceSelectorProps) {
  const devices = useWebMidiDevices()
  const options =
    devices[
      { input: 'inputs', output: 'outputs' }[mode] as 'inputs' | 'outputs'
    ]
  return (
    <Select
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      options={[{ id: '', name: `Select ${label}...` }, ...options]}
      valueKey={(opt) => opt.id}
      labelKey={(opt) => opt.name}
    />
  )
}
