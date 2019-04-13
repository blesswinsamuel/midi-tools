import React from 'react'
import Synth from './pages/Synth'
import Error from './components/Error'
import Spinner from './components/Spinner'
import useWebMidi from './hooks/useWebMidi'
import Layout from './components/Layout'
import NavBar, { NavItem } from './components/NavBar'

export default function App() {
  return (
    <Layout>
      <NavBar>
        <NavItem link="/synth">Synth</NavItem>
        <NavItem link="/synth">MIDI Monitor</NavItem>
        <NavItem link="/synth">MIDI Player</NavItem>
      </NavBar>
      <Midi />
    </Layout>
  )
}

function Midi() {
  const [webMidiEnabled, webMidiError] = useWebMidi()

  if (webMidiError !== null) {
    return (
      <Error error={`Error initializing Web MIDI: ${webMidiError.message}`} />
    )
  }
  if (!webMidiEnabled) {
    return <Spinner>Enabling WebMidi</Spinner>
  }

  return <Synth />
}
