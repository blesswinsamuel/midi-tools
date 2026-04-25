# MIDI Tools

A browser-based toolkit for working with MIDI devices, built with React and the Web MIDI API.

## Features

- **MIDI Devices** — View all connected MIDI input and output devices
- **MIDI Router** — Route MIDI messages from one device to another, with optional transposition
- **MIDI Visualizer** — Visualize live MIDI input on a piano keyboard or Korg NanoKontrol2 layout
- **MIDI Monitor** — Inspect incoming and outgoing MIDI messages in real time
- **MIDI Transmitter** — Send arbitrary MIDI messages (notes, control changes, sysex, etc.) to any output device

## Requirements

- A browser with [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) support (Chrome / Edge recommended)
- Node.js and [Bun](https://bun.sh) (or npm/yarn)

## Getting Started

```bash
# Install dependencies
bun install

# Start the development server
bun dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
bun run build
```

The output will be in the `dist/` directory.

## Tech Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [WebMidi.js](https://webmidijs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
