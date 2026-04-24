import { toast } from 'sonner'
import React from 'react'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

export const useToaster = () => {
  const successToast = (message: string) => toast.success(message)

  const errorToast = (message: string, onRetry: () => void) =>
    toast.error(message, {
      action: onRetry
        ? {
            label: 'Retry',
            onClick: () => onRetry(),
          }
        : undefined,
    })

  return {
    toaster: {
      show: (opts: { message: string; intent?: string }) => toast(opts.message),
    },
    successToast,
    errorToast,
  }
}

export const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SonnerToaster position="bottom-center" />
      {children}
    </>
  )
}
