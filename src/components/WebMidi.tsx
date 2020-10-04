import { createContext, useContext, useEffect, useState } from 'react'
import WebMidi, { Input, Output, WebMidiEvents } from 'webmidi'
import { Position, Toaster } from '@blueprintjs/core'
import AppError from './AppError'
import AppSpinner from './AppSpinner'

type WebMidiContextState = {
  inputs: Input[]
  outputs: Output[]
}

const WebMidiContext = createContext<WebMidiContextState>({
  inputs: [],
  outputs: [],
})

export function WebMidiProvider({ children }) {
  const [webMidiEnabled, webMidiError] = useRequestWebMidi()
  const { inputs, outputs } = useWebMidiDeviceConnectionListeners(
    webMidiEnabled
  )

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

function useRequestWebMidi() {
  const [webMidiEnabled, setWebMidiEnabled] = useState(false)
  const [webMidiError, setWebMidiError] = useState(null)

  useEffect(() => {
    if (WebMidi.enabled) {
      setWebMidiEnabled(true)
      return
    }
    WebMidi.enable(function(err) {
      if (err) {
        setWebMidiError(err)
      } else {
        setWebMidiEnabled(true)
      }
    })
  }, [setWebMidiEnabled, setWebMidiError])

  return [webMidiEnabled, webMidiError]
}

export const AppToaster =
  typeof window !== 'undefined' &&
  Toaster.create({
    position: Position.TOP_RIGHT,
  })

function useWebMidiDeviceConnectionListeners(webMidiEnabled: boolean) {
  const [inputs, setInputs] = useState([])
  const [outputs, setOutputs] = useState([])

  useEffect(() => {
    if (!webMidiEnabled) return
    const listener = (e: WebMidiEvents['connected' | 'disconnected']) => {
      AppToaster.show({ message: `${e.port.type} ${e.type} - ${e.port.name}` })
      console.log(`${e.port.type} ${e.type} - ${e.port.name}`, e)
      setInputs([...WebMidi.inputs])
      setOutputs([...WebMidi.outputs])
    }
    WebMidi.addListener('connected', listener)
    WebMidi.addListener('disconnected', listener)
    return () => {
      if (!webMidiEnabled) return
      WebMidi.removeListener('connected', listener)
      WebMidi.removeListener('disconnected', listener)
    }
  }, [webMidiEnabled])

  return { inputs, outputs }
}

export function useWebMidiDevices() {
  return useContext(WebMidiContext)
}
