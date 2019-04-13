import {useEffect, useState} from 'react'
import WebMidi from 'webmidi'

export default function useWebMidiDevices() {
    const [devices, setDevices] = useState([])

    useEffect(() => {
        const listener = e => {
            console.log(`${e.port.type} ${e.type} - ${e.port.name}`, e)
            setDevices(() => [...WebMidi.inputs, ...WebMidi.outputs])
        }
        WebMidi.addListener('connected', listener)
        WebMidi.addListener('disconnected', listener)
        return () => {
            if (!WebMidi.enabled) return
            WebMidi.removeListener('connected', listener)
            WebMidi.removeListener('disconnected', listener)
        }
    }, [])

    const inputs = devices.filter(d => d.type === 'input')
    const outputs = devices.filter(d => d.type === 'output')
    return [inputs, outputs]
}
