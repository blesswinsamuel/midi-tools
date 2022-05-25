import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import { WebMidi, Event, ControlChangeMessageEvent, NoteMessageEvent, MessageEvent } from 'webmidi'
import MidiDeviceSelector from '../components/MidiDeviceSelector'
import { Button, Checkbox, ControlGroup, FormGroup, NumericInput } from '@blueprintjs/core'

const eventTypes: { [key: string]: (e: any) => string } = {
  activesensing: (e: any) => '',
  clock: (e: any) => '',
  controlchange: (e: ControlChangeMessageEvent) => [e.controller.number, e.controller.name, e.value].join(' '),
  noteon: (e: NoteMessageEvent) => [e.note.name + e.note.octave, e.rawValue].join(' '),
  noteoff: (e: NoteMessageEvent) => [e.note.name + e.note.octave, e.rawValue].join(' '),
  sysex: (e: MessageEvent) =>
    Array.from(e.message.rawData.values())
      .map((x) => x.toString(16).padStart(2, '0').toUpperCase())
      .join(' '),
}

export default function MidiMonitor() {
  const [logs, setLogs] = useState('')
  const [tempo, setTempo] = useLocalStorageState('midi:monitor:tempo', 100)
  const [deviceId, setDeviceId] = useLocalStorageState('midi:monitor:device', '')
  const [selectedEventTypes, setEventTypes] = useLocalStorageState('midi:monitor:eventTypes', ['noteon'])
  const [selectedChannels, setChannels] = useLocalStorageState('midi:monitor:channels', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])

  const device = WebMidi.getInputById(deviceId)

  const initTime = useRef<any>(null)
  const clear = () => {
    setLogs('')
    initTime.current = null
  }

  useEffect(() => {
    const listener = (e: { type: keyof Event; timestamp: number; channel: { toString: () => string } }) => {
      const getMessage = eventTypes[e.type as any] as any
      if (!getMessage) {
        console.warn(`No getMessage function for ${e.type}`)
      }
      if (initTime.current === null) {
        initTime.current = e.timestamp
      }
      const clockTime = (e.timestamp - initTime.current) / ((60 * 1000) / tempo)
      setLogs((l) =>
        [
          l,
          [
            clockTime.toFixed(2).padStart(8, ' '),
            e.type.padEnd(16, ' '),
            (e.channel ? '#' + e.channel.toString() : '').padStart(2, '0'),
            getMessage ? getMessage(e) : '',
          ].join(' '),
        ]
          .filter((x) => x)
          .join('\n')
      )
    }
    const options = {
      channels: selectedChannels,
    }
    if (device) {
      selectedEventTypes.forEach((eventType: any) => {
        device.addListener(eventType, listener, options)
      })
      return () => {
        selectedEventTypes.forEach((eventType: any) => {
          device.removeListener(eventType, listener, options)
        })
      }
    }
  }, [selectedEventTypes, selectedChannels, device, tempo])

  const logRef = useRef<HTMLPreElement>(null)
  useLayoutEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])
  return (
    <div>
      <FormGroup>
        <ControlGroup>
          <MidiDeviceSelector mode="input" label="Input" value={deviceId} onChange={(v: any) => setDeviceId(v)} />
          <NumericInput
            leftIcon="time"
            // rightElement={<Tag minimal>bpm</Tag>}
            placeholder="Tempo"
            value={tempo}
            min={32}
            max={240}
            onChange={(e: { target: { value: any } }) => setTempo(e.target.value)}
          />
          <Button onClick={clear}>Clear</Button>
        </ControlGroup>
      </FormGroup>
      <FormGroup label="Event Types">
        {Object.keys(eventTypes).map((eventType) => (
          <Checkbox
            key={eventType}
            inline={true}
            checked={selectedEventTypes.includes(eventType)}
            onChange={(e) => {
              if ((e.target as HTMLInputElement).checked) {
                setEventTypes((t: any) => [...t, eventType])
              } else {
                setEventTypes((t: any[]) => t.filter((e: string) => e !== eventType))
              }
            }}
          >
            {eventType}
          </Checkbox>
        ))}
      </FormGroup>
      <FormGroup label="Channels">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((channel) => (
          <Checkbox
            key={channel}
            inline={true}
            checked={selectedChannels.includes(channel)}
            onChange={(e) => {
              if ((e.target as HTMLInputElement).checked) {
                setChannels((ch: any) => [...ch, channel])
              } else {
                setChannels((ch: any[]) => ch.filter((e: number) => e !== channel))
              }
            }}
          >
            {channel}
          </Checkbox>
        ))}
      </FormGroup>
      <pre ref={logRef} className="bg-black bg-opacity-20 overflow-y-scroll h-[500px]">
        <code className="py-4 block">{logs}</code>
      </pre>
    </div>
  )
}
