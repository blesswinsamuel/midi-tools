import Select from './Select'

type MidiChannelSelectorProps = {
  label: string
  mode?: 'input' | 'output'
  value: string | undefined
  onChange: (v: string | undefined) => void
}

export default function MidiChannelSelector({ value, onChange }: MidiChannelSelectorProps) {
  const options = ['all', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v === 'all' ? undefined : v)}
      options={[{ id: '', name: `Ch` }, ...options.map((o) => ({ id: o, name: o }))]}
      valueKey={(opt) => opt.id}
      labelKey={(opt) => String(opt.name)}
    />
  )
}
