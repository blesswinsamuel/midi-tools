import React, { useState } from 'react'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import WebMidi from 'webmidi'
import MidiDeviceSelector from '../components/MidiDeviceSelector'
import Select from '../components/Select'
import { Button, InputGroup, NumericInput } from '@blueprintjs/core'

const options = [
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

export const handleFormSubmit = func => event => {
  event.preventDefault()
  return func()
}

export default function MidiTransmitter() {
  const [deviceId, setDeviceId] = useLocalStorageState(
    'midi:transmitter:device',
    ''
  )
  const [method, setMethod] = useLocalStorageState(
    'midi:transmitter:method',
    ''
  )

  const device = WebMidi.getOutputById(deviceId)

  console.log(device)

  return (
    <div>
      <div>
        <MidiDeviceSelector
          mode="output"
          label="Output"
          value={deviceId}
          onChange={v => setDeviceId(v)}
        />
      </div>
      <Select
        options={['', ...options]}
        value={method}
        onChange={event => setMethod(event.currentTarget.value)}
      />
      {renderMethod(method, device)}
    </div>
  )
}

const methods = {
  playNote: {
    fields: [
      'note',
      'channel',
      'options.duration',
      'options.rawVelocity',
      'options.release',
      'options.time',
      'options.velocity',
    ],
    doIt: (device, state) =>
      device.playNote(state.note, state.channel, state.options),
  },
  send: {
    fields: ['status', 'data', 'timestamp'],
    doIt: (device, state) =>
      device.send(state.status, state.data, state.timestamp),
  },
  sendActiveSensing: {
    fields: ['options.time'],
    doIt: (device, state) => device.sendActiveSensing(state.options),
  },
  sendChannelAftertouch: {
    fields: ['pressure', 'channel', 'options.time'],
    doIt: (device, state) =>
      device.sendChannelAftertouch(
        state.pressure,
        state.channel,
        state.options
      ),
  },
  sendChannelMode: {
    fields: ['command', 'value', 'channel', 'options.time'],
    doIt: (device, state) =>
      device.sendChannelMode(
        state.command,
        state.value,
        state.channel,
        state.options
      ),
  },
  sendClock: {
    fields: ['options.time'],
    doIt: (device, state) => device.sendClock(state.options),
  },
  sendControlChange: {
    fields: ['controller', 'value', 'channel', 'options.time'],
    doIt: (device, state) =>
      device.sendControlChange(
        state.controller,
        state.value,
        state.channel,
        state.options
      ),
  },
  sendPitchBend: {
    fields: ['bend', 'channel', 'options.time'],
    doIt: (device, state) =>
      device.sendPitchBend(state.bend, state.channel, state.options),
  },
  sendProgramChange: {
    fields: ['program', 'channel', 'options.time'],
    doIt: (device, state) =>
      device.sendProgramChange(state.program, state.channel, state.options),
  },
  sendReset: {
    fields: ['options.time'],
    doIt: (device, state) => device.sendReset(state.options),
  },
  sendSysex: {
    fields: ['manufacturer', 'data', 'options.time'],
    doIt: (device, state) =>
      device.sendSysex(state.manufacturer, state.data, state.options),
  },
  stopNote: {
    fields: [
      'note',
      'channel',
      'options.rawVelocity',
      'options.time',
      'options.velocity',
    ],
    doIt: (device, state) =>
      device.stopNote(state.note, state.channel, state.options),
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
}

const renderMethod = (method, device) => {
  const [state, setState] = useState({})
  const m = methods[method]
  if (!m) {
    return <div>Not implemented</div>
  }

  const getState = field =>
    field.split('.').reduce((prev, curr) => prev && prev[curr], state) || ''
  const setFieldState = (field, newFieldValue) => {
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

  const getField = field => {
    const fieldType = fieldTypes[field]
    if (!fieldType) {
      return <div>Field type unknown for field {field}</div>
    }
    switch (fieldType) {
      case 'stringOrNumberOrArray':
        return (
          <InputGroup
            id={field}
            value={getState(field)}
            onChange={e => setFieldState(field, e.target.value.split(','))}
          />
        )
      case 'numberOrArray':
        return (
          <InputGroup
            id={field}
            value={getState(field)}
            onChange={e =>
              setFieldState(
                field,
                e.target.value.split(',').map(v => (!isNaN(v) ? +v : v))
              )
            }
          />
        )
      case 'stringOrNumber':
        return (
          <InputGroup
            id={field}
            value={getState(field)}
            onChange={e =>
              setFieldState(
                field,
                !isNaN(e.target.value) ? +e.target.value : e.target.value
              )
            }
          />
        )
      case 'number':
        return (
          <NumericInput
            id={field}
            value={getState(field)}
            onChange={e => setFieldState(field, e.target.value)}
            // min={0}
            // max={127}
          />
        )
      case 'array':
      case 'boolean':
      case 'string':
        return (
          <InputGroup
            id={field}
            value={getState(field)}
            onChange={e => setFieldState(field, e.target.value)}
          />
        )
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
          m.doIt(device, state)
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
      <table>
        <tbody>
          {m.fields.map(field => {
            return (
              <tr key={field}>
                <td>
                  <label htmlFor={field}>{field}</label>
                </td>
                <td>{getField(field)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Button type="submit">Send</Button>
    </form>
  )
}
