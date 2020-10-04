import { Spinner } from '@blueprintjs/core'
import React from 'react'

export default function AppSpinner({ children }) {
  return <Spinner className="app-spinner">{children}</Spinner>
}
