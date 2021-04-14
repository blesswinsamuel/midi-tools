// https://github.com/cwilso/metronome/blob/master/js/metronomeworker.js
let timerID: number | null = null

// eslint-disable-next-line no-restricted-globals
self.onmessage = (
  e: MessageEvent<{ action: 'start'; interval: number } | { action: 'stop' }>
) => {
  if (e.data.action === 'start') {
    console.log('starting')
    timerID = setInterval(() => {
      // @ts-ignore
      postMessage('tick')
    }, e.data.interval)
  } else if (e.data.action === 'stop') {
    console.log('stopping')
    if (timerID !== null) {
      clearInterval(timerID)
      timerID = null
    }
  }
}

export {}
