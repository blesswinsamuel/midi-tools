import React, { useEffect, useState } from 'react'
import { Input, NoteMessageEvent } from 'webmidi'
import { classNames } from '../../components/classNames'
import useLocalStorageState from '../../components/hooks/useLocalStorageState'
import MidiDeviceSelector from '../../components/MidiDeviceSelector'
import { useWebMidiDevice } from '../../components/WebMidi'

interface IPianoKeyProps {
  note: string
  hotkey?: string
  pressed: boolean
}

function PianoKey({ hotkey, note, pressed }: IPianoKeyProps) {
  const isBlack = /#/.test(note)
  const isWhite = !isBlack
  const isPressed = pressed
  return (
    <div
      className={classNames('h-28 relative', {
        'z-0 flex-1': isWhite,
        'z-10': isBlack,
      })}
    >
      <div
        className={classNames(
          'relative shadow-inset border border-opacity-50',
          {
            'h-full border-gray-300': isWhite,
            'absolute h-3/5 w-3 -mx-1.5 border-gray-700': isBlack,
          },
          !isPressed && {
            'bg-white text-black': isWhite,
            'bg-black text-white': isBlack,
          },
          isPressed && {
            'bg-gray-400 text-black': isWhite,
            'bg-gray-500 text-white': isBlack,
          }
        )}
      >
        <div
          className={classNames('absolute bottom-1 left-0 right-0 text-center cursor-default select-none', {
            'text-[0.5rem]': isWhite,
            'text-[0.3rem]': isBlack,
          })}
        >
          <span className="opacity-50">{note}</span>
          <br />
          <kbd>{hotkey}</kbd>
        </div>
      </div>
    </div>
  )
}

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const octaves = [0, 1, 2, 3, 4, 5, 6, 7]

export default function KeyboardVisualizer({ input }: { input: Input }) {
  const [keys, setKeys] = useState<{ [key: number]: boolean }>(() => ({}))
  useEffect(() => {
    if (!input) return
    const noteOn = (e: NoteMessageEvent) => setKeys((keys) => Object.assign({}, keys, { [e.note.number]: true }))
    const noteOff = (e: NoteMessageEvent) => setKeys((keys) => Object.assign({}, keys, { [e.note.number]: false }))
    const options = { channels: undefined }
    input.addListener('noteon', noteOn, options)
    input.addListener('noteoff', noteOff, options)
    return () => {
      input.removeListener('noteon', noteOn, options)
      input.removeListener('noteoff', noteOff, options)
    }
  }, [input])

  // useEffect(() => {
  //   setKeys({ 50: true, 54: true })
  // }, [])

  return (
    <div className="flex">
      {octaves.flatMap((octave) =>
        noteNames.map((noteName, noteIdx) => (
          <PianoKey key={`${noteName}${octave}`} note={`${noteName}${octave}`} pressed={keys[11 + 12 * octave + (noteIdx + 1)]} />
        ))
      )}
    </div>
  )
}
