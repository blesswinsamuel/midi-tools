import React from 'react'
import Select from '../components/Select'
import WebMidi from 'webmidi'
import useWebMidiDevices from '../hooks/useWebMidiDevices'

export default function MidiDeviceSelector({
  label,
  input,
  output,
  value,
  onChange,
}) {
  useWebMidiDevices()
  if (!input && !output) {
    return <div>Either input or output should be true</div>
  }
  const options = (() => {
    if (input) return WebMidi.inputs
    if (output) return WebMidi.outputs
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
