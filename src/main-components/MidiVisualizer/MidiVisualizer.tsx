import useLocalStorageState from '../../components/hooks/useLocalStorageState'
import MidiDeviceSelector from '../../components/MidiDeviceSelector'
import Select from '../../components/Select'
import { useWebMidiDevice } from '../../components/WebMidi'
import KeyboardVisualizer from './KeyboardVisualizer'
import KorgNanoKontrolVisualizer from './KorgNanoKontrol2Visualizer'
import { Label } from '@/components/ui/label'

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
      <div className="flex gap-3 flex-wrap items-end">
        <MidiDeviceSelector mode="input" label="Input" value={inDevice} onChange={setInDevice} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="device-type">Device Type</Label>
          <Select
            id="device-type"
            value={deviceType}
            onValueChange={(v) => setDeviceType(v)}
            options={[{ id: '', name: `Select device type...` }, ...deviceTypes]}
            valueKey={(opt) => opt.id}
            labelKey={(opt) => opt.name}
          />
        </div>
      </div>
      {deviceType === 'piano' && <KeyboardVisualizer input={deviceIn} />}
      {deviceType === 'korg-nanokontrol2' && <KorgNanoKontrolVisualizer inputController={deviceIn} />}
    </div>
  )
}
