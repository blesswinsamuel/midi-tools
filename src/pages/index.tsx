import { Card, H5 } from '@blueprintjs/core'
import MidiRouter from './midi-router'

export default function Home() {
  return (
    <Card>
      <H5>Router</H5>
      <MidiRouter />
    </Card>
  )
}
