import React, { useRef } from 'react'
import { useWebMidiDevices } from './WebMidi'
import Select from './Select'
import { Label } from '@/components/ui/label'

type MidiDeviceSelectorProps = {
  label: string
  mode: 'input' | 'output'
  value?: string
  onChange: (v: string) => void
}

export default function MidiDeviceSelector({ label, mode, value, onChange }: MidiDeviceSelectorProps) {
  const devices = useWebMidiDevices()
  const options = devices[{ input: 'inputs', output: 'outputs' }[mode] as 'inputs' | 'outputs']
  const id = useRef((Math.random() + 1).toString(36).substring(7))
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id.current}>{label}</Label>
      <Select
        id={id.current}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        options={[{ id: '', name: `Select ${label}...` }, ...options]}
        valueKey={(opt) => opt.id}
        labelKey={(opt) => opt.name}
      />
    </div>
  )
}
