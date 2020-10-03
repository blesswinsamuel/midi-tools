import { Card, Divider, H5 } from '@blueprintjs/core'
import MidiRouter from './midi-router'
import MidiDevices from './midi-devices'

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
