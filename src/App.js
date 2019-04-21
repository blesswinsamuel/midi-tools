import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Synth from './pages/Synth'
import Error from './components/Error'
import Spinner from './components/Spinner'
import useWebMidi from './hooks/useWebMidi'
import Layout from './components/Layout'
import MidiMonitor from './pages/MidiMonitor'
import MidiTransmitter from './pages/MidiTransmitter'
import MidiInstrument from './pages/MidiInstrument'

export default function App() {
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
    <Router>
      <Layout>
        <Switch>
          <Route path="/synth" component={Synth} />
          <Route path="/monitor" component={MidiMonitor} />
          <Route path="/transmitter" component={MidiTransmitter} />
          <Route path="/player" component={MidiInstrument} />
        </Switch>
      </Layout>
    </Router>
  )
}
