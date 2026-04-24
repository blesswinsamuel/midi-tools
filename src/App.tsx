import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { WakeLockProvider } from './components/WakeLock'
import { WebMidiProvider } from './components/WebMidi'
import Home from './pages/Home'
import { ToasterProvider } from './components/Toaster'

const App: React.FC = () => {
  return (
    <ToasterProvider>
      <BrowserRouter>
        <WebMidiProvider>
          <WakeLockProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </WakeLockProvider>
        </WebMidiProvider>
      </BrowserRouter>
    </ToasterProvider>
  )
}

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/midi-player" element={<MidiPlayer />} /> */}
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}

export default App
