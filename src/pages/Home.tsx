import { Section, SectionCard } from '@blueprintjs/core'
import React from 'react'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import MidiDevices from '../main-components/MidiDevices'
import MidiMonitor from '../main-components/MidiMonitor'
import MidiRouter from '../main-components/MidiRouter'
import MidiTransmitter from '../main-components/MidiTransmitter/MidiTransmitter'
import MidiVisualizer from '../main-components/MidiVisualizer/MidiVisualizer'

export default function Home() {
  const [midiRouterOpen, setMidiRouterOpen] = useLocalStorageState('midi-router-open', true)
  const [devicesOpen, setDevicesOpen] = useLocalStorageState('devices-open', true)
  const [keyboardVisualizerOpen, setKeyboardVisualizerOpen] = useLocalStorageState('keyboard-visualizer-open', true)
  const [midiMonitorOpen, setMidiMonitorOpen] = useLocalStorageState('midi-monitor-open', true)
  const [midiSynthOpen, setMidiSynthOpen] = useLocalStorageState('midi-synth-open', true)
  const [midiTransmitterOpen, setMidiTransmitterOpen] = useLocalStorageState('midi-transmitter-open', true)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
      <Section collapsible title="Connected MIDI Devices" collapseProps={{ isOpen: devicesOpen, onToggle: () => setDevicesOpen((v) => !v) }}>
        <SectionCard>
          <MidiDevices />
        </SectionCard>
      </Section>
      <Section collapsible title="MIDI Router" collapseProps={{ isOpen: midiRouterOpen, onToggle: () => setMidiRouterOpen((v) => !v) }}>
        <SectionCard>
          <MidiRouter />
        </SectionCard>
      </Section>
      <Section collapsible title="MIDI Visualizer" collapseProps={{ isOpen: keyboardVisualizerOpen, onToggle: () => setKeyboardVisualizerOpen((v) => !v) }}>
        <SectionCard>
          <MidiVisualizer />
        </SectionCard>
      </Section>
      <Section collapsible title="MIDI Synth" collapseProps={{ isOpen: midiSynthOpen, onToggle: () => setMidiSynthOpen((v) => !v) }}>
        <SectionCard>{/* <MidiSynth /> */}</SectionCard>
      </Section>
      <Section collapsible title="MIDI Monitor" collapseProps={{ isOpen: midiMonitorOpen, onToggle: () => setMidiMonitorOpen((v) => !v) }}>
        <SectionCard>
          <MidiMonitor />
        </SectionCard>
      </Section>
      <Section collapsible title="MIDI Transmitter" collapseProps={{ isOpen: midiTransmitterOpen, onToggle: () => setMidiTransmitterOpen((v) => !v) }}>
        <SectionCard>
          <MidiTransmitter />
        </SectionCard>
      </Section>
    </div>
  )
}
