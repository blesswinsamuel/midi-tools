import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SelectProps<T> = {
  id?: string
  options: T[]
  value?: string
  onValueChange?: (value: string) => void
  valueKey?: (x: T) => string | number
  labelKey?: (x: T) => string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function Select<T>({
  id,
  options,
  value,
  onValueChange,
  valueKey = x => String(x),
  labelKey = x => String(x),
  placeholder,
  className,
  disabled,
}: SelectProps<T>) {
  return (
    <ShadcnSelect value={value} onValueChange={(v) => onValueChange?.(v ?? '')} disabled={disabled}>
      <SelectTrigger id={id} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={String(valueKey(option))} value={String(valueKey(option))}>
            {labelKey(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadcnSelect>
  )
}
