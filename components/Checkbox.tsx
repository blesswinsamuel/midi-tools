import React from 'react'

export default function Checkbox({ children, ...props }) {
  return (
    <label>
      <input type="checkbox" {...props} />
      {children}
    </label>
  )
}
