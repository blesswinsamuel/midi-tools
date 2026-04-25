import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SelectProps<T> = {
  id?: string
  options: T[]
  value?: string
  onValueChange?: (value: string) => void
  valueKey?: (x: T) => string | number
  labelKey?: (x: T) => string
  placeholder?: string
  disabled?: boolean
}

export default function Select<T>({
  id,
  options,
  value,
  onValueChange,
  valueKey = (x) => String(x),
  labelKey = (x) => String(x),
  placeholder,
  disabled,
}: SelectProps<T>) {
  // Map options to { label, value } items. Empty string values become null,
  // which base-ui uses for the "no selection" state — its label is shown in the
  // trigger when nothing is selected (acts as a built-in placeholder).
  const items = options.map((opt) => {
    const v = String(valueKey(opt))
    return { label: labelKey(opt), value: v === '' ? null : v }
  })

  return (
    <ShadcnSelect items={items} value={value || null} onValueChange={(v) => onValueChange?.(v ?? '')} disabled={disabled}>
      <SelectTrigger id={id} className="w-full min-w-60 max-w-96">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {items.map((item) => (
          <SelectItem key={item.value ?? '__empty__'} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  )
}
