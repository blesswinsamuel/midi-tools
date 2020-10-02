import React from 'react'
import Select from './Select'
import WebMidi from 'webmidi'
import useWebMidiDevices from './hooks/useWebMidiDevices'

type MidiDeviceSelectorProps = {
  label: string
  mode?: 'input' | 'output'
  value: any
  onChange: any
}

export default function MidiDeviceSelector({
  label,
  mode,
  value,
  onChange,
}: MidiDeviceSelectorProps) {
  useWebMidiDevices()
  const options = (() => {
    switch (mode) {
      case 'input':
        return WebMidi.inputs
      case 'output':
        return WebMidi.outputs
    }
  })()
  return (
    <Select
      value={value}
      onChange={event => onChange(event.currentTarget.value)}
      options={[{ id: '', name: `Select ${label}...` }, ...options]}
      valueKey={opt => opt.id}
      labelKey={opt => opt.name}
    />
  )
}
