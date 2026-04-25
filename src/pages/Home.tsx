import React from 'react'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import MidiDevices from '../main-components/MidiDevices'
import MidiMonitor from '../main-components/MidiMonitor'
import MidiRouter from '../main-components/MidiRouter'
import MidiTransmitter from '../main-components/MidiTransmitter/MidiTransmitter'
import MidiVisualizer from '../main-components/MidiVisualizer/MidiVisualizer'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import MidiSynth from '@/main-components/MidiSynth/MidiSynth'

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <Card className="gap-0 py-0">
        <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors rounded-none">
          {title}
          <ChevronDownIcon className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pt-2 pb-4">{children}</div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export default function Home() {
  const [midiRouterOpen, setMidiRouterOpen] = useLocalStorageState('midi-router-open', true)
  const [devicesOpen, setDevicesOpen] = useLocalStorageState('devices-open', true)
  const [keyboardVisualizerOpen, setKeyboardVisualizerOpen] = useLocalStorageState('keyboard-visualizer-open', true)
  const [midiMonitorOpen, setMidiMonitorOpen] = useLocalStorageState('midi-monitor-open', true)
  const [midiSynthOpen, setMidiSynthOpen] = useLocalStorageState('midi-synth-open', true)
  const [midiTransmitterOpen, setMidiTransmitterOpen] = useLocalStorageState('midi-transmitter-open', true)
  return (
    <div className="flex flex-col gap-2.5">
      <Section title="Connected MIDI Devices" open={devicesOpen} onToggle={() => setDevicesOpen((v: boolean) => !v)}>
        <MidiDevices />
      </Section>
      <Section title="MIDI Router" open={midiRouterOpen} onToggle={() => setMidiRouterOpen((v: boolean) => !v)}>
        <MidiRouter />
      </Section>
      <Section title="MIDI Visualizer" open={keyboardVisualizerOpen} onToggle={() => setKeyboardVisualizerOpen((v: boolean) => !v)}>
        <MidiVisualizer />
      </Section>
      <Section title="MIDI Synth" open={midiSynthOpen} onToggle={() => setMidiSynthOpen((v: boolean) => !v)}>
        <MidiSynth />
      </Section>
      <Section title="MIDI Monitor" open={midiMonitorOpen} onToggle={() => setMidiMonitorOpen((v: boolean) => !v)}>
        <MidiMonitor />
      </Section>
      <Section title="MIDI Transmitter" open={midiTransmitterOpen} onToggle={() => setMidiTransmitterOpen((v: boolean) => !v)}>
        <MidiTransmitter />
      </Section>
    </div>
  )
}
