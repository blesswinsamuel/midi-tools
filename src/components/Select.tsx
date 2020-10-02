import { HTMLSelect } from '@blueprintjs/core'
import React from 'react'

export default function Select({
  options,
  valueKey = x => x,
  labelKey = x => x,
  ...props
}) {
  return (
    <span>
      <HTMLSelect {...props}>
        {options.map(option => (
          <option key={valueKey(option)} value={valueKey(option)}>
            {labelKey(option)}
          </option>
        ))}
      </HTMLSelect>
    </span>
  )
}
