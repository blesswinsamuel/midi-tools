import React from 'react'
import { Card, Collapse, H5, Switch } from '@blueprintjs/core'
import MidiRouter from '../main-components/MidiRouter'
import MidiDevices from '../main-components/MidiDevices'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import KeyboardVisualizer from '../main-components/MidiVisualizer/KeyboardVisualizer'
import MidiMonitor from '../main-components/MidiMonitor'
import MidiTransmitter from '../main-components/MidiTransmitter/MidiTransmitter'

export default function Home() {
  const [midiRouterOpen, setMidiRouterOpen] = useLocalStorageState('midi-router-open', true)
  const [devicesOpen, setDevicesOpen] = useLocalStorageState('devices-open', true)
  const [keyboardVisualizerOpen, setKeyboardVisualizerOpen] = useLocalStorageState('keyboard-visualizer-open', true)
  const [midiMonitorOpen, setMidiMonitorOpen] = useLocalStorageState('midi-monitor-open', true)
  const [midiTransmitterOpen, setMidiTransmitterOpen] = useLocalStorageState('midi-transmitter-open', true)
  return (
    <>
      <Card style={{ marginBottom: '10px' }}>
        <H5>
          <Switch checked={devicesOpen} label="Connected MIDI Devices" onChange={() => setDevicesOpen((v) => !v)} alignIndicator="right" large />
        </H5>
        <Collapse isOpen={devicesOpen}>
          <MidiDevices />
        </Collapse>
      </Card>
      <Card style={{ marginBottom: '10px' }}>
        <H5>
          <Switch checked={midiRouterOpen} label="MIDI Router" onChange={() => setMidiRouterOpen((v) => !v)} alignIndicator="right" large />
        </H5>
        <Collapse isOpen={midiRouterOpen}>
          <MidiRouter />
        </Collapse>
      </Card>
      <Card style={{ marginBottom: '10px' }}>
        <H5>
          <Switch checked={keyboardVisualizerOpen} label="MIDI Visualizer" onChange={() => setKeyboardVisualizerOpen((v) => !v)} alignIndicator="right" large />
        </H5>
        <Collapse isOpen={keyboardVisualizerOpen}>
          <KeyboardVisualizer />
        </Collapse>
      </Card>
      <Card style={{ marginBottom: '10px' }}>
        <H5>
          <Switch checked={midiMonitorOpen} label="MIDI Monitor" onChange={() => setMidiMonitorOpen((v) => !v)} alignIndicator="right" large />
        </H5>
        <Collapse isOpen={midiMonitorOpen}>
          <MidiMonitor />
        </Collapse>
      </Card>
      <Card style={{ marginBottom: '10px' }}>
        <H5>
          <Switch checked={midiTransmitterOpen} label="MIDI Transmitter" onChange={() => setMidiTransmitterOpen((v) => !v)} alignIndicator="right" large />
        </H5>
        <Collapse isOpen={midiTransmitterOpen}>
          <MidiTransmitter />
        </Collapse>
      </Card>
    </>
  )
}
