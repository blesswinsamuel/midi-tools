import { Intent, OverlayToaster, Position } from '@blueprintjs/core'
import React from 'react'

const ToasterContext = React.createContext<OverlayToaster | null>(null)

export const useToaster = () => {
  const toaster = React.useContext(ToasterContext)
  if (!toaster) {
    throw new Error('useToaster must be used within a ToasterProvider')
  }
  if (typeof window === 'undefined') {
    return {
      toaster: {
        show: () => {},
      },
      successToast: () => {},
      errorToast: () => {},
    }
  }
  const successToast = (message: string) =>
    toaster.show({
      icon: 'tick',
      intent: Intent.SUCCESS,
      message: message,
    })

  const errorToast = (message: string, onRetry: () => void) =>
    toaster.show({
      icon: 'warning-sign',
      intent: Intent.DANGER,
      action: onRetry && {
        onClick: () => onRetry(),
        text: 'Retry',
      },
      message: message,
    })

  return {
    toaster,
    successToast,
    errorToast,
  }
}

export const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
  const toaster = React.useRef<OverlayToaster>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    if (toaster.current) {
      setIsMounted(true)
    }
  }, [])

  return (
    <>
      <OverlayToaster position={Position.BOTTOM} className="!fixed" ref={toaster} />
      {isMounted && <ToasterContext.Provider value={toaster.current}>{children}</ToasterContext.Provider>}
    </>
  )
}
