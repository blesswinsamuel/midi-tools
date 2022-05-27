import React, { useEffect, useState } from 'react'
import { Input, NoteMessageEvent, MessageEvent, ControlChangeMessageEvent } from 'webmidi'
import { classNames } from '../../components/classNames'

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
      className={classNames('h-14 relative', {
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
          {/* <span className="opacity-50">{note}</span>
          <br />
          <kbd>{hotkey}</kbd> */}
        </div>
      </div>
    </div>
  )
}

function SustainPedal({ pressed }: { pressed: boolean }) {
  return (
    <div className="flex justify-center">
      <div className={classNames(pressed ? 'bg-gray-700' : 'bg-gray-900', 'w-10', 'h-10')}></div>
    </div>
  )
}

function PitchBend({ value }: { value: number }) {
  return (
    <div className="bg-gray-900 w-4 h-14 relative">
      <div
        className={classNames('bg-gray-700 w-full', 'absolute')}
        style={{ top: (1 - Math.max(value, 0)) * 50 + '%', bottom: (1 + Math.min(value, 0)) * 50 + '%' }}
      ></div>
    </div>
  )
}

function ModWheel({ value }: { value: number }) {
  return (
    <div className="bg-gray-900 w-4 h-14 relative">
      <div className={classNames('bg-gray-700 w-full', 'absolute', 'bottom-0')} style={{ height: value * 100 + '%' }}></div>
    </div>
  )
}

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const octaves = [0, 1, 2, 3, 4, 5, 6, 7]

function PianoKeys({ keys }: { keys: { [key: number]: boolean } }) {
  return (
    <div className="flex flex-1">
      {octaves.flatMap((octave) =>
        noteNames.map((noteName, noteIdx) => (
          <PianoKey key={`${noteName}${octave}`} note={`${noteName}${octave}`} pressed={keys[11 + 12 * octave + (noteIdx + 1)]} />
        ))
      )}
    </div>
  )
}

export default function KeyboardVisualizer({ input }: { input: Input }) {
  const [keys, setKeys] = useState<{ [key: number]: boolean }>(() => ({}))
  const [pitchBend, setPitchBend] = useState(0)
  const [modWheel, setModWheel] = useState(0)
  const [sustainPedal, setSustainPedal] = useState(false)
  useEffect(() => {
    if (!input) return
    const noteOn = (e: NoteMessageEvent) => setKeys((keys) => Object.assign({}, keys, { [e.note.number]: true }))
    const noteOff = (e: NoteMessageEvent) => setKeys((keys) => Object.assign({}, keys, { [e.note.number]: false }))
    const pitchBend = (e: MessageEvent) => setPitchBend((e.rawValue || 0) / 8192 - 1)
    const modWheel = (e: ControlChangeMessageEvent) => setModWheel((e.rawValue || 0) / 127)
    const sustainPedal = (e: ControlChangeMessageEvent) => setSustainPedal(e.rawValue ? true : false)
    const controlChange = (e: ControlChangeMessageEvent) => {
      if (e.controller.number === 1) modWheel(e)
      else if (e.controller.number === 64) sustainPedal(e)
    }
    // const controlChangeDebug = (e: ControlChangeMessageEvent) => console.log(e)
    const options = { channels: undefined }
    input.addListener('noteon', noteOn, options)
    input.addListener('noteoff', noteOff, options)
    input.addListener('pitchbend', pitchBend, options)
    input.addListener('controlchange', controlChange, options)
    // input.addListener('controlchange', controlChangeDebug, options)
    // input.addListener('controlchange-controller1', modWheel, options)
    // input.addListener('controlchange-controller64', sustainPedal, options)
    return () => {
      input.removeListener('noteon', noteOn, options)
      input.removeListener('noteoff', noteOff, options)
      input.removeListener('pitchbend', pitchBend, options)
      input.removeListener('controlchange', controlChange, options)
      // input.removeListener('controlchange', controlChangeDebug, options)
      // input.removeListener('controlchange-controller1', modWheel, options)
      // input.removeListener('controlchange-controller64', sustainPedal, options)
    }
  }, [input])

  // useEffect(() => {
  //   setKeys({ 50: true, 54: true })
  // }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        <PitchBend value={pitchBend} />
        <ModWheel value={modWheel} />
        <PianoKeys keys={keys} />
      </div>
      <SustainPedal pressed={sustainPedal} />
    </div>
  )
}
