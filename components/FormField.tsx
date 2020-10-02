import React from 'react'

export default function FormField({ label, labelFor, children }) {
  return (
    <div>
      <label htmlFor={labelFor}>{label}</label>
      {children}
    </div>
  )
}