import React, { useState } from 'react'
import Link from 'next/link'
import useWebMidi from './hooks/useWebMidi'
import Spinner from './Spinner'
import Error from './Error'
import { useRouter } from 'next/router'
import { Alignment, Button, Classes, Navbar } from '@blueprintjs/core'

function NavBar({
  menuItems,
}: {
  menuItems: { title: string; href: string }[]
}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const renderMenuItem = ({ href, title }) => {
    return (
      <Link key={href} href={href}>
        <Button
          className="bp3-minimal"
          active={router.pathname == href}
          text={title}
        />
      </Link>
    )
  }

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>MIDI Tools</Navbar.Heading>
        <Navbar.Divider />
        {menuItems.map(menuItem => renderMenuItem(menuItem))}
      </Navbar.Group>
    </Navbar>
  )
}

export default function Layout({ children }) {
  const [webMidiEnabled, webMidiError] = useWebMidi()

  if (webMidiError !== null) {
    return (
      <Error error={`Error initializing Web MIDI: ${webMidiError.message}`} />
    )
  }
  if (!webMidiEnabled) {
    return <Spinner>Enabling WebMidi</Spinner>
  }

  return (
    <>
      <NavBar
        menuItems={[
          { href: '/midi-synth', title: 'Synth' },
          { href: '/midi-monitor', title: 'MIDI Monitor' },
          { href: '/midi-transmitter', title: 'MIDI Transmitter' },
          { href: '/midi-player', title: 'MIDI Player' },
        ]}
      />
      <div style={{ maxWidth: '1100px', margin: '1em auto' }}>{children}</div>
    </>
  )
}
