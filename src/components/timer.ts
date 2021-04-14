import WebMidi from 'webmidi'
import TimerWorker from './TimerWorker?worker'

// https://github.com/cwilso/metronome/blob/master/js/metronome.js
function timer() {
  const lookahead = 25.0

  let scheduleAheadTime = 100.0 // should be something like 100
  let nextNoteTime = 0.0
  let bpm: number
  let ppq: number
  let timeSignature: [number, number]
  type State = { clock: number; beat: number; bar: number; playing: boolean }
  type Options = { bpm: number; ppq: number; timeSignature: [number, number] }
  type Listener = (time: number, state: State) => void
  let state: State = {
    bar: 0,
    beat: 0,
    clock: 0,
    playing: false,
  }
  let listeners: Listener[] = []

  function setOptions(options: Options) {
    bpm = options.bpm
    ppq = options.ppq
    timeSignature = options.timeSignature
  }

  function nextNote() {
    // Advance current note and time by a 16th note...
    const millisPerBeat = (60.0 / bpm) * 1000
    nextNoteTime += (1 / ppq) * millisPerBeat // Add beat length to last beat time

    state = { ...state }
    state.clock += 1 // Advance the beat number, wrap to zero
    if (state.clock >= ppq) {
      state.beat += 1
      state.clock = 0
    }
    if (state.beat > timeSignature[0]) {
      // this.beat[0]
      state.bar += 1
      state.beat = 1
    }
  }

  function scheduleNote(time: number, state: State) {
    // push the note on the queue, even if we're not playing.
    // notesInQueue.push({ note: beat, time: time })

    // do stuff
    listeners.forEach((listener) => listener(time, state))
  }

  function start() {
    if (state.playing) return
    state = { bar: 1, beat: 1, clock: 0, playing: true }
    nextNoteTime = WebMidi.time
    timerWorker.postMessage({ action: 'start', interval: lookahead })
  }

  function stop() {
    state = { bar: 1, beat: 1, clock: 0, playing: false }
    timerWorker.postMessage({ action: 'stop' })
    scheduleNote(nextNoteTime, state)
  }

  function reset() {
    state = { ...state, bar: 1, beat: 1, clock: 0 }
  }

  function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < WebMidi.time + scheduleAheadTime) {
      scheduleNote(nextNoteTime, state)
      nextNote()
    }
  }

  const subscribe = function (listener: Listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }

  const timerWorker = new TimerWorker()

  timerWorker.onmessage = function (e) {
    if (e.data === 'tick') {
      // console.log('tick!')
      scheduler()
    } else {
      console.log('unknown message: ' + e.data)
    }
  }
  return { start, stop, reset, setOptions, subscribe }
}

export default timer
