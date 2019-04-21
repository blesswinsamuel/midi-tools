import Synth from './pages/Synth'
import MidiMonitor from './pages/MidiMonitor'
import MidiTransmitter from './pages/MidiTransmitter'
import MidiInstrument from './pages/MidiInstrument'
import { Route, Switch } from 'react-router-dom'
import React from 'react'
import useWebMidi from './hooks/useWebMidi'
import Spinner from './components/Spinner'
import Error from './components/Error'

export default function Routes() {
  const [webMidiEnabled, webMidiError] = useWebMidi()

  if (webMidiError !== null) {
    return (
      <Error error={`Error initializing Web MIDI: ${webMidiError.message}`} />
    )
  }
  if (!webMidiEnabled) {
    return <Spinner>Enabling WebMidi</Spinner>
  }

  return (
    <Switch>
      <Route path="/synth" component={Synth} />
      <Route path="/monitor" component={MidiMonitor} />
      <Route path="/transmitter" component={MidiTransmitter} />
      <Route path="/player" component={MidiInstrument} />
    </Switch>
  )
}
