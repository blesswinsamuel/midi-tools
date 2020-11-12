import React from 'react'

type FormFieldProps = {
  label: string
  labelFor: string
}

const FormField: React.FC<FormFieldProps> = ({ label, labelFor, children }) => {
  return (
    <div>
      <label htmlFor={labelFor}>{label}</label>
      {children}
    </div>
  )
}

export default FormField
