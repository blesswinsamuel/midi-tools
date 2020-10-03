import { HTMLSelect, IHTMLSelectProps } from '@blueprintjs/core'
import React from 'react'

type SelectProps = Omit<IHTMLSelectProps, 'options'> & {
  options: any[]
  valueKey?: (x: any) => any
  labelKey?: (x: any) => any
}

export default function Select({
  options,
  valueKey = x => x,
  labelKey = x => x,
  ...props
}: SelectProps) {
  return (
    <HTMLSelect {...props}>
      {options.map(option => (
        <option key={valueKey(option)} value={valueKey(option)}>
          {labelKey(option)}
        </option>
      ))}
    </HTMLSelect>
  )
}
