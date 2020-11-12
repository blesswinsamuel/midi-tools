import { Spinner } from '@blueprintjs/core'
import React from 'react'

const AppSpinner: React.FC<{}> = ({ children }) => {
  return <Spinner className="app-spinner">{children}</Spinner>
}

export default AppSpinner
