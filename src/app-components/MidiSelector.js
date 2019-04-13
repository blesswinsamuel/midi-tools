import React from 'react'
import Select from '../components/Select'

export default function MidiSelector({ label, options, value, onChange }) {
  return (
    <Select
      value={value}
      onChange={event => onChange(event.currentTarget.value)}
    >
      {[{ id: '', name: `Select ${label}...` }, ...options].map(option => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </Select>
  )
}
