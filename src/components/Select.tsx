import { Select as ShadcnSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type SelectProps = {
  id?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[]
  value?: string
  onValueChange?: (value: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueKey?: (x: any) => any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labelKey?: (x: any) => any
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function Select({
  id,
  options,
  value,
  onValueChange,
  valueKey = x => x,
  labelKey = x => x,
  placeholder,
  className,
  disabled,
}: SelectProps) {
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
