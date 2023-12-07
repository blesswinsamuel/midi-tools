import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { WakeLockProvider } from './components/WakeLock'
import { WebMidiProvider } from './components/WebMidi'
import Home from './pages/Home'

const Analytics = () => {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const goatcounter = (window as any).goatcounter
    if (!goatcounter.count) return
    goatcounter.count({ path: pathname + search })
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
      {/* <Route path="/midi-player" element={<MidiPlayer />} /> */}
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}

export default App
