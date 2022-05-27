import React, { useEffect } from 'react'
import { WebMidiProvider } from './components/WebMidi'
import { WakeLockProvider } from './components/WakeLock'
import Layout from './components/Layout'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import MidiPlayer from './pages/MidiPlayer'

const Analytics = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    ;(window as any).goatcounter.count({ path: pathname + search })
  }, [pathname, search])

  return <></>
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <WebMidiProvider>
        <WakeLockProvider>
          <Layout>
            <Analytics />
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
      <Route path="/midi-player" element={<MidiPlayer />} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}

export default App
