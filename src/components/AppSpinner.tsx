import { Spinner } from '@blueprintjs/core'
import React from 'react'

const AppSpinner: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '50vh' }}>
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <Spinner />
        <div>{children}</div>
      </div>
    </div>
  )
}

export default AppSpinner
