import { Classes } from '@blueprintjs/core'
import { useEffect, useState } from 'react'
import { Input, InputEventNoteoff, InputEventNoteon } from 'webmidi'
import { classNames } from './classNames'

interface IPianoKeyProps {
  note: string
  hotkey?: string
  pressed: boolean
}

function PianoKey({ hotkey, note, pressed }: IPianoKeyProps) {
  const classes = classNames('piano-key', {
    'piano-key-pressed': pressed,
    'piano-key-sharp': /\#/.test(note),
  })
  const elevation = classNames(
    pressed ? Classes.ELEVATION_0 : Classes.ELEVATION_2
  )
  return (
    <div className={classes}>
      <div className={elevation}>
        <div className="piano-key-text">
          <span className="piano-key-note">{note}</span>
          <br />
          <kbd className="piano-key-hotkey">{hotkey}</kbd>
        </div>
      </div>
    </div>
  )
}

const noteNames = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]
const octaves = [0, 1, 2, 3, 4, 5, 6, 7]

export default function MidiPiano({ input }: { input: Input }) {
  const [keys, setKeys] = useState<{ [key: number]: boolean }>(() => ({}))
  useEffect(() => {
    if (!input) return
    const noteOn = (e: InputEventNoteon) =>
      setKeys(keys => Object.assign({}, keys, { [e.note.number]: true }))
    const noteOff = (e: InputEventNoteoff) =>
      setKeys(keys => Object.assign({}, keys, { [e.note.number]: false }))
    input.addListener('noteon', 'all', noteOn)
    input.addListener('noteoff', 'all', noteOff)
    return () => {
      input.removeListener('noteon', 'all', noteOn)
      input.removeListener('noteoff', 'all', noteOff)
    }
  }, [input])

  return (
    <div className="midi-piano">
      <div>
        {octaves.map(octave =>
          noteNames.map((noteName, noteIdx) => (
            <PianoKey
              key={`${noteName}${octave}`}
              note={`${noteName}${octave}`}
              pressed={keys[11 + 12 * octave + (noteIdx + 1)]}
            />
          ))
        )}
      </div>
    </div>
  )
}
