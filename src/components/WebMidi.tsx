import { createContext, useContext, useEffect, useState } from 'react'
import { WebMidi, Input, Output, PortEvent } from 'webmidi'
import { Position, Toaster } from '@blueprintjs/core'
import AppError from './AppError'
import AppSpinner from './AppSpinner'
import React from 'react'

type WebMidiContextState = {
  inputs: Input[]
  outputs: Output[]
}

const WebMidiContext = createContext<WebMidiContextState>({
  inputs: [],
  outputs: [],
})

export const WebMidiProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [webMidiEnabled, webMidiError] = useRequestWebMidi()
  const { inputs, outputs } = useWebMidiDeviceConnectionListeners()

  if (webMidiError !== null) {
    return (
      <AppError
        error={`Error initializing Web MIDI: ${webMidiError.message}`}
      />
    )
  }
  if (!webMidiEnabled) {
    return <AppSpinner>Enabling WebMidi</AppSpinner>
  }

  return (
    <WebMidiContext.Provider value={{ inputs, outputs }}>
      {children}
    </WebMidiContext.Provider>
  )
}

function useRequestWebMidi(): [boolean, Error | null] {
  const [webMidiEnabled, setWebMidiEnabled] = useState(false)
  const [webMidiError, setWebMidiError] = useState<Error | null>(null)

  useEffect(() => {
    if (WebMidi.enabled) {
      setWebMidiEnabled(true)
      return
    }
    ;(async () => {
      try {
        await WebMidi.enable()
        console.log('WebMidi enabled')
        AppToaster.show({ message: `WebMidi enabled` })
        setWebMidiEnabled(true)
      } catch (err) {
        setWebMidiError(err as Error)
      }
    })()
  }, [setWebMidiEnabled, setWebMidiError])

  return [webMidiEnabled, webMidiError]
}

export const AppToaster = Toaster.create({
  position: Position.TOP_RIGHT,
})

function useWebMidiDeviceConnectionListeners() {
  const [inputs, setInputs] = useState<Input[]>([])
  const [outputs, setOutputs] = useState<Output[]>([])

  useEffect(() => {
    const listener = (e: PortEvent) => {
      AppToaster.show({ message: `${e.port.type} ${e.type} - ${e.port.name}` })
      console.log(`${e.port.type} ${e.type} - ${e.port.name}`, e)
      setInputs([...WebMidi.inputs])
      setOutputs([...WebMidi.outputs])
    }
    WebMidi.addListener('connected', listener)
    WebMidi.addListener('disconnected', listener)
    return () => {
      WebMidi.removeListener('connected', listener)
      WebMidi.removeListener('disconnected', listener)
    }
  }, [])

  return { inputs, outputs }
}

export function useWebMidiDevices() {
  return useContext(WebMidiContext)
}

// type InputOrOutputType = 'input' | 'output'
// type InputOrOutputObjectType<T> = T extends 'input'
//   ? Input
//   : T extends 'output'
//   ? Output
//   : never

export function useWebMidiDevice(io: 'input', id?: string): Input
export function useWebMidiDevice(io: 'output', id?: string): Output
//   export function useWebMidiDevice<T extends InputOrOutputType>(
//   io: T,
//   id: string
// ): Input | Output {
export function useWebMidiDevice(
  io: 'input' | 'output',
  id?: string
): Input | Output | undefined {
  const { inputs, outputs } = useWebMidiDevices()
  switch (io) {
    case 'input':
      return inputs.find((d) => d.id === id)
    case 'output':
      return outputs.find((d) => d.id === id)
  }
}
