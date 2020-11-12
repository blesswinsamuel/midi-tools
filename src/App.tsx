import React from 'react'
import { WebMidiProvider } from './components/WebMidi'
import { WakeLockProvider } from './components/WakeLock'
import Layout from './components/Layout'
import './styles/blueprint.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MidiMonitor from './pages/MidiMonitor'
import MidiTransmitter from './pages/MidiTransmitter'
import MidiPlayer from './pages/MidiPlayer'
import MidiSynth from './pages/MidiSynth'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <WebMidiProvider>
        <WakeLockProvider>
          <Layout>
            <AppRoutes />
          </Layout>
        </WakeLockProvider>
      </WebMidiProvider>
    </BrowserRouter>
  )
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/midi-monitor" element={<MidiMonitor />} />
      <Route path="/midi-transmitter" element={<MidiTransmitter />} />
      <Route path="/midi-player" element={<MidiPlayer />} />
      <Route path="/midi-synth" element={<MidiSynth />} />
      {/* <Route path="/about">
      <About />
    </Route>
    <Route path="/:user">
      <User />
    </Route>
    <Route>
      <NoMatch />
    </Route> */}
    </Routes>
  )
}

export default App
