import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ControlChangeMessageEvent, Event, MessageEvent, NoteMessageEvent, WebMidi } from 'webmidi'
import MidiDeviceSelector from '../components/MidiDeviceSelector'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const eventTypes: { [key: string]: (e: any) => string } = {
  activesensing: (e: any) => '',
  clock: (e: any) => '',
  controlchange: (e: ControlChangeMessageEvent) => [e.controller.number, e.controller.name, e.value].join(' '),
  noteon: (e: NoteMessageEvent) => [e.note.identifier, e.rawValue].join(' '),
  noteoff: (e: NoteMessageEvent) => [e.note.identifier, e.rawValue].join(' '),
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
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap items-end">
        <MidiDeviceSelector mode="input" label="Input" value={deviceId} onChange={(v: any) => setDeviceId(v)} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tempo">Tempo</Label>
          <Input
            id="tempo"
            type="number"
            placeholder="Tempo"
            value={tempo}
            min={32}
            max={240}
            onChange={(e) => setTempo(+e.target.value)}
            className="w-24"
          />
        </div>
        <Button variant="outline" size="sm" onClick={clear}>Clear</Button>
      </div>
      <div className="flex flex-col gap-1">
        <Label>Event Types</Label>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {Object.keys(eventTypes).map((eventType) => (
            <label key={eventType} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <Checkbox
                checked={selectedEventTypes.includes(eventType)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setEventTypes((t: any) => [...t, eventType])
                  } else {
                    setEventTypes((t: any[]) => t.filter((e: string) => e !== eventType))
                  }
                }}
              />
              {eventType}
            </label>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Label>Channels</Label>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((channel) => (
            <label key={channel} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <Checkbox
                checked={selectedChannels.includes(channel)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setChannels((ch: any) => [...ch, channel])
                  } else {
                    setChannels((ch: any[]) => ch.filter((e: number) => e !== channel))
                  }
                }}
              />
              {channel}
            </label>
          ))}
        </div>
      </div>
      <pre ref={logRef} className="bg-black/20 overflow-y-scroll h-[500px]">
        <code className="py-4 block">{logs}</code>
      </pre>
    </div>
  )
}
