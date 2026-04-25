import { useState } from 'react'
import useLocalStorageState from '../../components/hooks/useLocalStorageState'
import { WebMidi, type Output } from 'webmidi'
import MidiDeviceSelector from '../../components/MidiDeviceSelector'
import Select from '../../components/Select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import PsrS910 from './PsrS910'

const options = [
  'PSR S910 Controller',
  'playNote',
  'send',
  'sendActiveSensing',
  'sendChannelAftertouch',
  'sendChannelMode',
  'sendClock',
  'sendContinue',
  'sendControlChange',
  'sendKeyAftertouch',
  'sendPitchBend',
  'sendProgramChange',
  'sendReset',
  'sendSongPosition',
  'sendSongSelect',
  'sendStart',
  'sendStop',
  'sendSysex',
  'sendTimecodeQuarterFrame',
  'sendTuningRequest',
  'setMasterTuning',
  'setModulationRange',
  'setNonRegisteredParameter',
  'setPitchBendRange',
  'setRegisteredParameter',
  'setTuningBank',
  'setTuningProgram',
  'stopNote',
]

const methods: {
  [key: string]: {
    fields: (keyof typeof fieldTypes)[]
    // biome-ignore lint/suspicious/noExplicitAny: doIt receives dynamically structured MIDI state
    doIt: (device: Output, state: any) => void
  }
} = {
  playNote: {
    fields: ['note', 'channel', 'options.duration', 'options.rawVelocity', 'options.release', 'options.time', 'options.velocity'],
    doIt: (device, state) => device.playNote(state.note, state.options),
  },
  send: {
    fields: ['status', 'data', 'timestamp'],
    doIt: (device, state) => device.send(state.status, state.data, state.timestamp),
  },
  sendActiveSensing: {
    fields: ['options.time'],
    doIt: (device, state) => device.sendActiveSensing(state.options),
  },
  sendChannelAftertouch: {
    fields: ['pressure', 'channel', 'options.time'],
    doIt: (device, state) => device.sendChannelAftertouch(state.pressure, state.options),
  },
  sendChannelMode: {
    fields: ['command', 'value', 'channel', 'options.time'],
    doIt: (device, state) => device.sendChannelMode(state.command, state.value, state.options),
  },
  sendClock: {
    fields: ['options.time'],
    doIt: (device, state) => device.sendClock(state.options),
  },
  sendControlChange: {
    fields: ['controller', 'value', 'channel', 'options.time'],
    doIt: (device, state) => device.sendControlChange(state.controller, state.value, state.options),
  },
  sendPitchBend: {
    fields: ['bend', 'channel', 'options.time'],
    doIt: (device, state) => device.sendPitchBend(state.bend, state.options),
  },
  sendProgramChange: {
    fields: ['program', 'channel', 'options.time'],
    doIt: (device, state) => device.sendProgramChange(state.program, state.options),
  },
  sendReset: {
    fields: ['options.time'],
    doIt: (device, state) => device.sendReset(state.options),
  },
  sendSysex: {
    fields: ['manufacturer', 'data', 'options.time'],
    doIt: (device, state) => device.sendSysex(state.manufacturer, state.data, state.options),
  },
  stopNote: {
    fields: ['note', 'channel', 'options.rawVelocity', 'options.time', 'options.velocity'],
    doIt: (device, state) => device.stopNote(state.note, state.options),
  },
}

const fieldTypes = {
  note: 'stringOrNumberOrArray',
  command: 'stringOrNumber',
  value: 'number',
  bend: 'number',
  controller: 'stringOrNumber',
  manufacturer: 'numberOrArray',
  status: 'number',
  pressure: 'number',
  data: 'array',
  timestamp: 'string',
  channel: 'stringOrNumberOrArray',
  'options.duration': 'number',
  'options.rawVelocity': 'boolean',
  'options.release': 'number',
  'options.time': 'string',
  'options.velocity': 'number',
  program: 'string', // check if this is right
}

export const handleFormSubmit = (func: () => void) => (event: { preventDefault(): void }) => {
  event.preventDefault()
  return func()
}

export default function MidiTransmitter() {
  const [deviceId, setDeviceId] = useLocalStorageState('midi:transmitter:device', '')
  const [method, setMethod] = useLocalStorageState('midi:transmitter:method', '')
  const [state, setState] = useState<Record<string, unknown>>({})

  const device = WebMidi.getOutputById(deviceId)

  return (
    <>
      <div className="flex gap-3 flex-wrap items-end">
        <MidiDeviceSelector mode="output" label="Output" value={deviceId} onChange={(v) => setDeviceId(v)} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="event">Event</Label>
          <Select id="event" options={['', ...options]} value={method} onValueChange={(v) => setMethod(v)} />
        </div>
      </div>
      <MethodForm method={method} device={device as Output} state={state} setState={setState} />
    </>
  )
}

function MethodForm({
  method,
  device,
  state,
  setState,
}: {
  method: string
  device: Output
  state: Record<string, unknown>
  setState: (s: Record<string, unknown>) => void
}) {
  if (method === 'PSR S910 Controller') return <PsrS910 device={device} />
  if (!method) return null

  const m = methods[method]
  if (!m) return <p>Not implemented</p>

  const getState = (field: keyof typeof fieldTypes): string => {
    const val = field.split('.').reduce<unknown>((prev, curr) => (prev as Record<string, unknown>)?.[curr], state)
    return String(val ?? '')
  }

  const setFieldState = (field: keyof typeof fieldTypes, newFieldValue: unknown) => {
    const fieldParts = field.split('.')
    const newState = { ...state }
    let last: Record<string, unknown> = newState
    for (let i = 0; i < fieldParts.length; i++) {
      const fieldPart = fieldParts[i]
      if (i === fieldParts.length - 1) {
        last[fieldPart] = newFieldValue
      } else {
        if (!last[fieldPart]) last[fieldPart] = {}
        last = last[fieldPart] as Record<string, unknown>
      }
    }
    setState(newState)
  }

  const getField = (field: keyof typeof fieldTypes) => {
    const fieldType = fieldTypes[field]
    if (!fieldType) return <span>Field type unknown for field {field}</span>
    switch (fieldType) {
      case 'stringOrNumberOrArray':
        return <Input id={field} value={getState(field)} onChange={(e) => setFieldState(field, e.target.value.split(','))} />
      case 'numberOrArray':
        return (
          <Input
            id={field}
            value={getState(field)}
            onChange={(e) =>
              setFieldState(
                field,
                e.target.value.split(',').map((v: string) => (!Number.isNaN(Number(v)) ? +v : v)),
              )
            }
          />
        )
      case 'stringOrNumber':
        return (
          <Input
            id={field}
            value={getState(field)}
            onChange={(e) => setFieldState(field, !Number.isNaN(Number(e.target.value)) ? +e.target.value : e.target.value)}
          />
        )
      case 'number':
        return <Input id={field} type="number" value={getState(field)} onChange={(e) => setFieldState(field, e.target.value)} />
      case 'array':
      case 'boolean':
      case 'string':
        return <Input id={field} value={getState(field)} onChange={(e) => setFieldState(field, e.target.value)} />
      default:
        return <span>Unknown field type {fieldType} for field {field}</span>
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit(() => {
        try {
          console.log(state)
          if (device) m.doIt(device, state)
        } catch (e) {
          console.error(e)
        }
      })}
    >
      <Table>
        <TableBody>
          {m.fields.map((field) => (
            <TableRow key={field}>
              <TableCell className="w-40">
                <Label htmlFor={field}>{field}</Label>
              </TableCell>
              <TableCell>{getField(field)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button type="submit" className="mt-2">Send</Button>
    </form>
  )
}
