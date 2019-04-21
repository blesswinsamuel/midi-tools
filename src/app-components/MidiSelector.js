import React from 'react'
import Select from '../components/Select'

export default function MidiSelector({ label, options, value, onChange }) {
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
