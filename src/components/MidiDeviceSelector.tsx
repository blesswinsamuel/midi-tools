import React, { useRef } from 'react'
import { useWebMidiDevices } from './WebMidi'
import Select from './Select'
import { FormGroup } from '@blueprintjs/core'

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
    // titleCase(mode + ' device')
    <FormGroup label={label} labelFor={id.current}>
      <Select
        id={id.current}
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        options={[{ id: '', name: `Select ${label}...` }, ...options]}
        valueKey={(opt) => opt.id}
        labelKey={(opt) => opt.name}
      />
    </FormGroup>
  )
}
// function titleCase(str: string) {
//   return str.replace(/(^|\s)\S/g, function (t) {
//     return t.toUpperCase()
//   })
// }
