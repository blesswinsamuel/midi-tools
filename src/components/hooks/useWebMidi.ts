import {useEffect, useState} from 'react'
import WebMidi from 'webmidi'

export default function useWebMidi() {
    const [webMidiEnabled, setWebMidiEnabled] = useState(false)
    const [webMidiError, setWebMidiError] = useState(null)

    useEffect(() => {
        if (WebMidi.enabled) {
            setWebMidiEnabled(true)
            return
        }
        WebMidi.enable(function(err) {
            if (err) {
                setWebMidiError(err)
            } else {
                setWebMidiEnabled(true)
            }
        })
    }, [setWebMidiEnabled, setWebMidiError])

    return [webMidiEnabled, webMidiError]
}
