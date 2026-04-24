import { Loader2Icon } from 'lucide-react'
import React from 'react'

const AppSpinner: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex justify-center h-[50vh]">
      <div className="flex flex-col justify-center items-center gap-3">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        <div>{children}</div>
      </div>
    </div>
  )
}

export default AppSpinner
