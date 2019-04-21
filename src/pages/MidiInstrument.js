import React, { useCallback, useEffect, useRef } from 'react'
import timer from './timer'
import useLocalStorageState from '../hooks/useLocalStorageState'
import WebMidi from 'webmidi'
import MidiSelector from '../app-components/MidiSelector'
import useAnimationState from '../hooks/useAnimationState'
import Knob from '../components/Knob'
import Button from '../components/Button'
import NumericInput from '../components/NumericInput'
import Input from '../components/Input'
import Slider from '../components/Slider'

const ButtonGroup = 'div'
const ControlGroup = 'div'
const Card = 'div'
const Tag = 'div'
const Divider = 'div'

function DeviceSelector({ setDeviceIds, deviceIds }) {
  return (
    <ControlGroup fill={true} vertical={false}>
      <MidiSelector
        label="Input"
        options={WebMidi.inputs}
        value={deviceIds.input}
        onChange={v => {
          setDeviceIds(d => ({ ...d, input: v }))
        }}
      />
      <MidiSelector
        label="Input Controller"
        options={WebMidi.inputs}
        value={deviceIds.inputController}
        onChange={v => {
          setDeviceIds(d => ({ ...d, inputController: v }))
        }}
      />
      <MidiSelector
        label="Output Controller"
        options={WebMidi.outputs}
        value={deviceIds.outputController}
        onChange={v => {
          setDeviceIds(d => ({ ...d, outputController: v }))
        }}
      />
      <MidiSelector
        label="Output"
        options={WebMidi.outputs}
        value={deviceIds.output}
        onChange={v => {
          setDeviceIds(d => ({ ...d, output: v }))
        }}
      />
    </ControlGroup>
  )
}

function TempoTapper(setTempo, start) {
  let taps = []
  let lastTimer = null
  let autoTapTimer = null
  let maxBufferLength = 16
  let timeSignature

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
      autoTapTimer = setTimeout(() => {
        setTempo(t)
        start()
      }, (60.0 / t) * 1000)
    }
    if (taps.length > barLength) {
      setTempo(calculateTempo())
      start()
    }
    clearInterval(lastTimer)
    lastTimer = setTimeout(resetTaps, 2000)
  }

  function setOptions(options) {
    timeSignature = options.timeSignature
  }

  return { tap, setOptions }
}

function Transport({ timer, outputController, inputController }) {
  const [transportState, setTransportState] = useAnimationState({
    bar: 1,
    beat: 1,
    clock: 0,
    playing: false,
  })

  useEffect(() => {
    const lightBlink = (controller, time) => {
      if (!outputController) return
      outputController.sendControlChange(controller, 127, 1, { time })
      outputController.sendControlChange(controller, 0, 1, { time: time + 60 })
    }
    const enablePlayingLight = (playing, time) => {
      if (!outputController) return
      outputController.sendControlChange(41, playing ? 127 : 0, 1, { time })
    }
    enablePlayingLight(false)
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
    inputController.addListener('controlchange', 'all', e => {
      // console.log('CTRLR:', e.controller, e.value)
      if (e.controller.number === 41 && e.value === 127)
        // Play
        play()
      if (e.controller.number === 42 && e.value === 127)
        // Stop
        stop()
      if (e.controller.number === 46 && e.value === 127)
        // Cycle (used as reset)
        reset()
    })
    return () => {
      inputController.removeListener('controlchange', 'all')
    }
  }, [inputController])

  const play = () => timer.start()
  const stop = () => timer.stop()
  const reset = () => timer.reset()

  return (
    <>
      <br />
      <Tag
        large
        style={{ fontSize: '2em', padding: '.3em' }}
      >
        <strong>
          {[
            transportState.bar.toString().padStart(3, '\xa0'),
            transportState.beat.toString().padStart(1, '0'),
            transportState.clock.toString().padStart(2, '0'),
          ].join(' : ')}
        </strong>
      </Tag>
      <br />
      <br />
      <ButtonGroup>
        <Button
          icon="play"
          onClick={play}
          intent={transportState.playing ? 'intent-success' : undefined}
          active={transportState.playing}
        >
          Play
        </Button>
        <Button icon="stop" onClick={stop}>
          Stop
        </Button>
        <Button icon="warning-sign" onClick={reset}>
          Reset
        </Button>
      </ButtonGroup>
    </>
  )
}

function usePlayer(timer, output, tempo, ppq) {
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
        output.playNote(
          WebMidi.noteNameToNumber(noteName) + delta,
          parseInt(channelNo),
          {
            rawVelocity: true,
            velocity: velocity,
            duration: (((length / ppq) * 60) / tempo) * 1000,
            time: time,
          }
        )
      if (beat % 2 === 0)
        output &&
          output.playNote(
            WebMidi.noteNameToNumber('D2') + delta,
            parseInt(channelNo),
            {
              rawVelocity: true,
              velocity: velocity,
              duration: (((length / ppq) * 60) / tempo) * 1000,
              time: time,
            }
          )
    })
  }, [timer, output, tempo, ppq])
}

function MixerSlider({ inputController, controllerNumber }) {
  const [value, setValue] = useAnimationState(0)
  useEffect(() => {
    if (!inputController) return
    const listener = e => {
      if (e.controller.number === controllerNumber) {
        setValue(e.value)
      }
    }
    inputController.addListener('controlchange', 'all', listener)
    return () => {
      inputController.removeListener('controlchange', 'all', listener)
    }
  }, [inputController])
  return (
    <Slider
      min={0}
      max={127}
      stepSize={1}
      labelStepSize={16}
      onChange={v => setValue(v)}
      value={value}
      vertical
    />
  )
}

function MixerKnob({ inputController, controllerNumber }) {
  const [value, setValue] = useAnimationState(0)
  useEffect(() => {
    if (!inputController) return
    const listener = e => {
      if (e.controller.number === controllerNumber) {
        setValue(e.value)
      }
    }
    inputController.addListener('controlchange', 'all', listener)
    return () => {
      inputController.removeListener('controlchange', 'all', listener)
    }
  }, [inputController])
  return (
    <Knob min={0} max={127} stepSize={1} value={value} onChange={setValue} />
  )
}

function Mixer({ inputController }) {
  return (
    <Card>
      <ControlGroup>
        {Array.of(0, 1, 2, 3, 4, 5, 6, 7)
          .map(n => (
            <div key={n}>
              <MixerKnob
                inputController={inputController}
                controllerNumber={n + 16}
              />
              <Divider />
              <MixerSlider
                inputController={inputController}
                controllerNumber={n}
              />
            </div>
          ))
          .reduce(
            (acc, x) =>
              acc === null ? (
                [x]
              ) : (
                <>
                  {acc}
                  <Divider style={{ margin: '1em' }} />
                  {x}
                </>
              ),
            null
          )}
      </ControlGroup>
    </Card>
  )
}

export default function Instrument() {
  const [deviceIds, setDeviceIds] = useLocalStorageState(
    'midi:instrument:devices',
    {}
  )
  const devices = {
    input: WebMidi.getInputById(deviceIds.input),
    inputController: WebMidi.getInputById(deviceIds.inputController),
    outputController: WebMidi.getOutputById(deviceIds.outputController),
    output: WebMidi.getOutputById(deviceIds.output),
  }
  const [tempo, setTempo] = useLocalStorageState('midi:instrument:tempo', 100)
  const [ppq, setPpq] = useLocalStorageState('midi:instrument:ppq', 96)
  const [timeSignature, setTimeSignature] = useLocalStorageState(
    'midi:instrument:timeSignature',
    [4, 4]
  )
  const { input, inputController, outputController, output } = devices
  const timerRef = useRef(null)
  if (timerRef.current === null) {
    timerRef.current = timer()
  }
  const tempoTapper = useRef(null)
  if (tempoTapper.current === null) {
    tempoTapper.current = TempoTapper(setTempo, () => timerRef.current.start())
  }
  const tapTempo = useCallback(() => tempoTapper.current.tap(), [tempoTapper])

  useEffect(() => {
    timerRef.current.setOptions({ ppq, bpm: tempo, timeSignature })
    tempoTapper.current.setOptions({ timeSignature })
  }, [ppq, tempo, timeSignature])

  useEffect(() => {
    if (!inputController) return
    const listener = e => {
      if (e.controller.number === 45 && e.value === 127) tapTempo()
    }
    inputController.addListener('controlchange', 'all', listener)
    return () => {
      inputController.removeListener('controlchange', 'all', listener)
    }
  }, [tapTempo, inputController])

  usePlayer(timerRef.current, output, tempo, ppq)

  return (
    <div>
      <DeviceSelector deviceIds={deviceIds} setDeviceIds={setDeviceIds} />
      <Divider />
      <ControlGroup>
        <NumericInput
          leftIcon="time"
          rightElement={<Tag minimal>bpm</Tag>}
          placeholder="Tempo"
          value={tempo}
          min={32}
          max={240}
          onValueChange={v => setTempo(v)}
        />
        <Button icon="record" onClick={tapTempo} />
        <NumericInput
          leftIcon="pulse"
          rightElement={<Tag minimal>ppq</Tag>}
          placeholder="Pulse per quarter"
          value={ppq}
          min={1}
          max={1920}
          onValueChange={v => setPpq(v)}
        />
        <Input
          value={timeSignature.join('/')}
          min={1}
          max={12}
          onChange={e =>
            setTimeSignature(
              e.target.value
                .split('/')
                .slice(0, 2)
                .map(i => (i === '' || isNaN(i) ? 0 : parseInt(i)))
            )
          }
        />
      </ControlGroup>
      <Transport
        outputController={outputController}
        inputController={inputController}
        timer={timerRef.current}
      />
      <Divider />
      <Mixer inputController={inputController} />
    </div>
  )
}
