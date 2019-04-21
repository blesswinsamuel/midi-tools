import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useLocalStorageState from '../hooks/useLocalStorageState'
import WebMidi from 'webmidi'
import MidiSelector from '../app-components/MidiSelector'
import Button from '../components/Button'
import Checkbox from '../components/Checkbox'
import NumericInput from '../components/NumericInput'
import Pre from '../components/Pre'

const eventTypes = {
  activesensing: e => '',
  clock: e => '',
  controlchange: e =>
    [e.controller.number, e.controller.name, e.value].join(' '),
  noteon: e => [e.note.name + e.note.octave, e.rawVelocity].join(' '),
  noteoff: e => [e.note.name + e.note.octave, e.rawVelocity].join(' '),
}

export default function MidiMonitor() {
  const [logs, setLogs] = useState('')
  const [tempo, setTempo] = useLocalStorageState('midi:monitor:tempo', 100)
  const [deviceId, setDeviceId] = useLocalStorageState('midi:monitor:device', '')
  const [selectedEventTypes, setEventTypes] = useLocalStorageState(
    'midi:monitor:eventTypes',
    ['noteon']
  )
  const [selectedChannels, setChannels] = useLocalStorageState(
    'midi:monitor:channels',
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  )

  const device = WebMidi.getInputById(deviceId)

  const initTime = useRef(null)
  const clear = () => {
    setLogs('')
    initTime.current = null
  }

  useEffect(() => {
    const listener = e => {
      const getMessage = eventTypes[e.type]
      if (!getMessage) {
        console.warn(`No getMessage function for ${e.type}`)
      }
      if (initTime.current === null) {
        initTime.current = e.timestamp
      }
      const clockTime = (e.timestamp - initTime.current) / ((60 * 1000) / tempo)
      setLogs(l =>
        [
          l,
          [
            clockTime.toFixed(2).padStart(8, ' '),
            e.type.padEnd(16, ' '),
            (e.channel ? '#' + e.channel.toString() : '').padStart(2, '0'),
            getMessage ? getMessage(e) : '',
          ].join(' '),
        ]
          .filter(x => x)
          .join('\n')
      )
    }
    if (device) {
      selectedEventTypes.forEach(eventType => {
        device.addListener(eventType, selectedChannels, listener)
      })
      return () => {
        selectedEventTypes.forEach(eventType => {
          device.removeListener(eventType, selectedChannels, listener)
        })
      }
    }
  }, [selectedEventTypes, selectedChannels, device])

  const logRef = useRef()
  useLayoutEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])
  return (
    <div>
      <div>
        <MidiSelector
          label="Input"
          options={WebMidi.inputs}
          value={deviceId}
          onChange={v => setDeviceId(v)}
        />
        <NumericInput
          leftIcon="time"
          // rightElement={<Tag minimal>bpm</Tag>}
          placeholder="Tempo"
          value={tempo}
          min={32}
          max={240}
          onChange={e => setTempo(e.target.value)}
        />
        <Button onClick={clear}>Clear</Button>
      </div>
      <div>
        {Object.keys(eventTypes).map(eventType => (
          <Checkbox
            key={eventType}
            inline
            checked={selectedEventTypes.includes(eventType)}
            onChange={e => {
              if (e.target.checked) {
                setEventTypes(t => [...t, eventType])
              } else {
                setEventTypes(t => t.filter(e => e !== eventType))
              }
            }}
          >
            {eventType}
          </Checkbox>
        ))}
      </div>
      <div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
          channel => (
            <Checkbox
              key={channel}
              inline
              checked={selectedChannels.includes(channel)}
              onChange={e => {
                if (e.target.checked) {
                  setChannels(ch => [...ch, channel])
                } else {
                  setChannels(ch => ch.filter(e => e !== channel))
                }
              }}
            >
              {channel}
            </Checkbox>
          )
        )}
      </div>
      <Pre ref={logRef} style={{ height: '400px', overflowY: 'scroll' }}>
        <code>{logs}</code>
      </Pre>
    </div>
  )
}
