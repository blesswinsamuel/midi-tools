// https://github.com/cwilso/metronome/blob/master/js/metronomeworker.js
// @ts-ignore
let timerID = null

self.onmessage = (e) => {
  if (e.data.action === 'start') {
    console.log('starting')
    timerID = setInterval(() => {
      postMessage('tick')
    }, e.data.interval)
  } else if (e.data.action === 'stop') {
    console.log('stopping')
    clearInterval(timerID)
    timerID = null
  }
}
