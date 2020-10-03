import { Card, H5 } from '@blueprintjs/core'
import MidiRouter from '../components/main/midi-router'
import MidiDevices from '../components/main/midi-devices'

export default function Home() {
  return (
    <>
      <Card>
        <H5>Devices</H5>
        <MidiDevices />
      </Card>
      <div style={{ padding: '5px' }} />
      <Card>
        <H5>Router</H5>
        <MidiRouter />
      </Card>
    </>
  )
}
