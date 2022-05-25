import { Spinner } from '@blueprintjs/core'
import React from 'react'

const AppSpinner: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Spinner className="app-spinner" />
      {children}
    </div>
  )
}

export default AppSpinner
