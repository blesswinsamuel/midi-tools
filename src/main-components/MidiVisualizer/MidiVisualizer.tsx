import { FormGroup } from '@blueprintjs/core'
import React from 'react'
import useLocalStorageState from '../../components/hooks/useLocalStorageState'
import MidiDeviceSelector from '../../components/MidiDeviceSelector'
import Select from '../../components/Select'
import { useWebMidiDevice } from '../../components/WebMidi'
import KeyboardVisualizer from './KeyboardVisualizer'
import KorgNanoKontrolVisualizer from './KorgNanoKontrol2Visualizer'

export default function MidiVisualizer() {
  const [inDevice, setInDevice] = useLocalStorageState<string | undefined>('instrument:input', undefined)
  const [deviceType, setDeviceType] = useLocalStorageState<string | undefined>('instrument:type', 'piano')
  const deviceIn = useWebMidiDevice('input', inDevice)

  const deviceTypes = [
    { id: 'piano', name: 'Piano' },
    { id: 'korg-nanokontrol2', name: 'Korg NanoKontrol2' },
  ]

  return (
    <div className="space-y-3">
      <div style={{ display: 'flex', gap: '12px' }}>
        <MidiDeviceSelector mode="input" label="Input" value={inDevice} onChange={setInDevice} />
        <FormGroup label="Device Type" labelFor="device-type">
          <Select
            value={deviceType}
            onChange={(event) => setDeviceType(event.currentTarget.value)}
            options={[{ id: '', name: `Select device type...` }, ...deviceTypes]}
            valueKey={(opt) => opt.id}
            labelKey={(opt) => opt.name}
          />
        </FormGroup>
      </div>
      {deviceType === 'piano' && <KeyboardVisualizer input={deviceIn} />}
      {deviceType === 'korg-nanokontrol2' && <KorgNanoKontrolVisualizer inputController={deviceIn} />}
    </div>
  )
}
