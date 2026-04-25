import React, { useCallback, useEffect, useRef } from 'react'
import Timer from '../components/timer'
import useLocalStorageState from '../components/hooks/useLocalStorageState'
import { WebMidi, Input, Output, ControlChangeMessageEvent, Utilities } from 'webmidi'
import MidiDeviceSelector from '../components/MidiDeviceSelector'
import useAnimationState from '../components/hooks/useAnimationState'
import Knob from '../components/Knob'
import { Button } from '@/components/ui/button'
import { Input as InputField } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

function TempoTapper(setTempo: (v: number) => void, start: () => void) {
  let taps: number[] = []
  let lastTimer: number | undefined = undefined
  let autoTapTimer: number | undefined = undefined
  let maxBufferLength = 16
  let timeSignature: [number, number]

  function calculateTempo() {
    const durations = []
    for (let i = 1; i < taps.length; i++) {
      durations.push(taps[i] - taps[i - 1])
    }
    const avgDuration = durations.reduce((a, b) => a + b) / durations.length
    const tempo = (60.0 / avgDuration) * 1000
    return Math.round(tempo)
  }

  function resetTaps() {
    taps = []
  }

  function tap() {
    clearInterval(autoTapTimer)
    taps = [...taps, WebMidi.time]
    taps = taps.slice(Math.max(0, taps.length - maxBufferLength))
    // console.log(taps)

    const [barLength] = timeSignature
    if (taps.length === barLength) {
      const t = calculateTempo()
      autoTapTimer = setTimeout(
        () => {
          setTempo(t)
          start()
        },
        (60.0 / t) * 1000
      )
    }
    if (taps.length > barLength) {
      setTempo(calculateTempo())
      start()
    }
    clearInterval(lastTimer)
    lastTimer = setTimeout(resetTaps, 2000)
  }

  function setOptions(options: any) {
    timeSignature = options.timeSignature
  }

  return { tap, setOptions }
}

function Transport({
  timer,
  outputController,
  inputController,
}: {
  timer: ReturnType<typeof Timer>
  outputController: false | Output
  inputController: false | Input
}) {
  const [transportState, setTransportState] = useAnimationState({
    bar: 1,
    beat: 1,
    clock: 0,
    playing: false,
  })

  useEffect(() => {
    const lightBlink = (controller: number, time: number) => {
      if (!outputController) return
      outputController.sendControlChange(controller, 127, { time, channels: 1 })
      outputController.sendControlChange(controller, 0, {
        time: time + 60,
        channels: 1,
      })
    }
    const enablePlayingLight = (playing: boolean, time: number | undefined) => {
      if (!outputController) return
      outputController.sendControlChange(41, playing ? 127 : 0, {
        time,
        channels: 1,
      })
    }
    enablePlayingLight(false, undefined)
    return timer.subscribe((time, { bar, beat, clock, playing }) => {
      enablePlayingLight(playing, time)
      if (!playing) {
        lightBlink(42, time)
      }
      if (clock === 0) {
        lightBlink(45, time)
        if (beat === 1) {
          lightBlink(46, time)
        }
      }
      setTransportState({ bar, beat, clock, playing })
    })
  }, [timer, setTransportState, outputController])

  useEffect(() => {
    if (!inputController) return
    const listener = (e: ControlChangeMessageEvent) => {
      // console.log('CTRLR:', e.controller, e.value)
      if (e.controller.number === 41 && e.value === 127)
        // Play
        timer.start()
      if (e.controller.number === 42 && e.value === 127)
        // Stop
        timer.stop()
      if (e.controller.number === 46 && e.value === 127)
        // Cycle (used as reset)
        timer.reset()
    }
    const options = { channels: undefined }
    inputController.addListener('controlchange', listener, options)
    return () => {
      inputController.removeListener('controlchange', listener, options)
    }
  }, [inputController, timer])

  const play = () => timer.start()
  const stop = () => timer.stop()
  const reset = () => timer.reset()

  return (
    <>
      <br />
      <span className="font-mono text-3xl font-bold tracking-widest">
        {[
          transportState.bar.toString().padStart(3, '\xa0'),
          transportState.beat.toString().padStart(1, '0'),
          transportState.clock.toString().padStart(2, '0'),
        ].join(' : ')}
      </span>
      <br />
      <br />
      <div className="flex gap-1">
        <Button variant={transportState.playing ? 'default' : 'outline'} onClick={play}>
          ▶ Play
        </Button>
        <Button variant="outline" onClick={stop}>
          ■ Stop
        </Button>
        <Button variant="outline" onClick={reset}>
          ↺ Reset
        </Button>
      </div>
    </>
  )
}

function usePlayer(timer: ReturnType<typeof Timer>, output: false | Output, tempo: number, ppq: number) {
  useEffect(() => {
    return timer.subscribe((time, { bar, beat, clock, playing }) => {
      if (!playing) return
      // if (beat !== 1 || clock !== 0) return
      if (clock !== 0) return

      const noteName = 'C2',
        delta = 0,
        channelNo = '10',
        velocity = 80,
        length = 20
      output &&
        output.playNote(Utilities.toNoteNumber(noteName) + delta, {
          channels: parseInt(channelNo),
          rawAttack: velocity,
          duration: (((length / ppq) * 60) / tempo) * 1000,
          time: time,
        })
      if (beat % 2 === 0)
        output &&
          output.playNote(Utilities.toNoteNumber('D2') + delta, {
            channels: parseInt(channelNo),
            rawAttack: velocity,
            duration: (((length / ppq) * 60) / tempo) * 1000,
            time: time,
          })
    })
  }, [timer, output, tempo, ppq])
}

export default function MidiPlayer() {
  const [deviceIds, setDeviceIds] = useLocalStorageState<{
    input?: string
    inputController?: string
    output?: string
    outputController?: string
  }>('midi:instrument:devices', {})
  const devices = {
    input: WebMidi.getInputById(deviceIds.input || ''),
    inputController: WebMidi.getInputById(deviceIds.inputController || ''),
    outputController: WebMidi.getOutputById(deviceIds.outputController || ''),
    output: WebMidi.getOutputById(deviceIds.output || ''),
  }
  const [tempo, setTempo] = useLocalStorageState('midi:instrument:tempo', 100)
  const [ppq, setPpq] = useLocalStorageState('midi:instrument:ppq', 96)
  const [timeSignature, setTimeSignature] = useLocalStorageState<[number, number]>('midi:instrument:timeSignature', [4, 4])
  const { inputController, outputController, output } = devices
  const timerRef = useRef<ReturnType<typeof Timer> | null>(null)
  if (timerRef.current === null) {
    timerRef.current = Timer()
  }
  const tempoTapper = useRef<ReturnType<typeof TempoTapper> | null>(null)
  if (tempoTapper.current === null) {
    tempoTapper.current = TempoTapper(setTempo, () => timerRef.current!.start())
  }
  const tapTempo = useCallback(() => tempoTapper.current!.tap(), [])

  useEffect(() => {
    timerRef.current!.setOptions({ ppq, bpm: tempo, timeSignature })
    tempoTapper.current!.setOptions({ timeSignature })
  }, [ppq, tempo, timeSignature])

  useEffect(() => {
    if (!inputController) return
    const listener = (e: ControlChangeMessageEvent) => {
      if (e.controller.number === 45 && e.value === 127) tapTempo()
    }
    const options = { channels: undefined }
    inputController.addListener('controlchange', listener, options)
    return () => {
      inputController.removeListener('controlchange', listener, options)
    }
  }, [tapTempo, inputController])

  usePlayer(timerRef.current, output || false, tempo, ppq)
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 flex-wrap">
        <MidiDeviceSelector
          mode="input"
          label="Input"
          value={deviceIds.input}
          onChange={(v) => {
            setDeviceIds((d) => ({ ...d, input: v }))
          }}
        />
        <MidiDeviceSelector
          mode="input"
          label="Input Controller"
          value={deviceIds.inputController}
          onChange={(v) => {
            setDeviceIds((d) => ({ ...d, inputController: v }))
          }}
        />
        <MidiDeviceSelector
          mode="output"
          label="Output Controller"
          value={deviceIds.outputController}
          onChange={(v) => {
            setDeviceIds((d) => ({ ...d, outputController: v }))
          }}
        />
        <MidiDeviceSelector
          mode="output"
          label="Output"
          value={deviceIds.output}
          onChange={(v) => {
            setDeviceIds((d) => ({ ...d, output: v }))
          }}
        />
      </div>
      <hr className="border-border" />
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex items-center gap-1">
          <InputField type="number" placeholder="Tempo" value={tempo} min={32} max={240} onChange={(e) => setTempo(+e.target.value)} className="w-20" />
          <Badge variant="outline">bpm</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={tapTempo}>
          Tap
        </Button>
        <div className="flex items-center gap-1">
          <InputField type="number" placeholder="Pulse per quarter" value={ppq} min={1} max={1920} onChange={(e) => setPpq(+e.target.value)} className="w-20" />
          <Badge variant="outline">ppq</Badge>
        </div>
        <InputField
          value={timeSignature.join('/')}
          onChange={(e) =>
            setTimeSignature(
              e.target.value
                .split('/')
                .slice(0, 2)
                .map((i) => (i === '' || isNaN(i as unknown as number) ? 0 : parseInt(i))) as [number, number]
            )
          }
          className="w-16"
        />
      </div>
      <Transport outputController={outputController || false} inputController={inputController || false} timer={timerRef.current!} />
      <hr className="border-border" />
    </div>
  )
}
