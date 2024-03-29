import React, { useState } from 'react'
import useLocalStorageState from '../../components/hooks/useLocalStorageState'
import { WebMidi, Output } from 'webmidi'
import MidiDeviceSelector from '../../components/MidiDeviceSelector'
import Select from '../../components/Select'
import { Button, FormGroup, HTMLTable, InputGroup, NumericInput } from '@blueprintjs/core'
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

export const handleFormSubmit = (func: any) => (event: any) => {
  event.preventDefault()
  return func()
}

export default function MidiTransmitter() {
  const [deviceId, setDeviceId] = useLocalStorageState('midi:transmitter:device', '')
  const [method, setMethod] = useLocalStorageState('midi:transmitter:method', '')
  const [state, setState] = useState({})

  const device = WebMidi.getOutputById(deviceId)

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <MidiDeviceSelector mode="output" label="Output" value={deviceId} onChange={(v) => setDeviceId(v)} />
        <FormGroup label="Event" labelFor="event">
          <Select id="event" options={['', ...options]} value={method} onChange={(event) => setMethod(event.currentTarget.value)} />
        </FormGroup>
      </div>
      {renderMethod(method, device, state, setState)}
    </div>
  )
}

const renderMethod = (method: string, device: Output, state: any, setState: any) => {
  if (method === 'PSR S910 Controller') {
    return <PsrS910 device={device} />
  }
  if (!method) {
    return <></>
  }
  const m = methods[method]
  if (!m) {
    return <div>Not implemented</div>
  }

  const getState = (field: keyof typeof fieldTypes) => field.split('.').reduce((prev, curr) => prev && prev[curr], state) || ''
  const setFieldState = (field: keyof typeof fieldTypes, newFieldValue: any) => {
    const fieldParts = field.split('.')
    const newState = { ...state }
    let last = newState
    for (let i = 0; i < fieldParts.length; i++) {
      const fieldPart = fieldParts[i]
      if (i === fieldParts.length - 1) {
        last[fieldPart] = newFieldValue
      } else {
        if (!last[fieldPart]) {
          last[fieldPart] = {}
        }
        last = last[fieldPart]
      }
    }
    setState(newState)
  }

  const getField = (field: keyof typeof fieldTypes) => {
    const fieldType = fieldTypes[field]
    if (!fieldType) {
      return <div>Field type unknown for field {field}</div>
    }
    switch (fieldType) {
      case 'stringOrNumberOrArray':
        return <InputGroup id={field} value={getState(field)} onChange={(e: any) => setFieldState(field, e.target.value.split(','))} />
      case 'numberOrArray':
        return (
          <InputGroup
            id={field}
            value={getState(field)}
            onChange={(e: any) =>
              setFieldState(
                field,
                e.target.value.split(',').map((v: any) => (!isNaN(v) ? +v : v))
              )
            }
          />
        )
      case 'stringOrNumber':
        return (
          <InputGroup
            id={field}
            value={getState(field)}
            onChange={(e: any) => setFieldState(field, !isNaN(e.target.value) ? +e.target.value : e.target.value)}
          />
        )
      case 'number':
        return (
          <NumericInput
            id={field}
            value={getState(field)}
            onChange={(e) => setFieldState(field, e.target.value)}
            // min={0}
            // max={127}
          />
        )
      case 'array':
      case 'boolean':
      case 'string':
        return <InputGroup id={field} value={getState(field)} onChange={(e: any) => setFieldState(field, e.target.value)} />
      default:
        return (
          <div>
            Unknown field type {fieldType} for field {field}
          </div>
        )
    }
  }

  return (
    <form
      onSubmit={handleFormSubmit(() => {
        try {
          console.log(state)
          if (device) {
            m.doIt(device, state)
          }
        } catch (e) {
          console.error(e)
          // Toaster.show({
          //   icon: 'warning-sign',
          //   intent: Intent.DANGER,
          //   message: e.message,
          // })
        }
      })}
    >
      <HTMLTable bordered interactive>
        <tbody>
          {m.fields.map((field) => {
            return (
              <tr key={field}>
                <td className="!cursor-default">
                  <label htmlFor={field}>{field}</label>
                </td>
                <td className="!cursor-default">{getField(field)}</td>
              </tr>
            )
          })}
        </tbody>
      </HTMLTable>
      <Button type="submit">Send</Button>
    </form>
  )
}
