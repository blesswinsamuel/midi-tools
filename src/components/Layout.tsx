import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Alignment, Button, Classes, Navbar } from '@blueprintjs/core'
import { classNames } from './classNames'

function NavBar({
  menuItems,
}: {
  menuItems: { title: string; href: string }[]
}) {
  const router = useRouter()

  const renderMenuItem = ({ href, title }) => {
    return (
      <Link key={href} href={href}>
        <a
          className={classNames(
            Classes.MINIMAL,
            Classes.BUTTON,
            router.pathname == href && Classes.ACTIVE
          )}
        >
          {title}
        </a>
      </Link>
    )
  }

  return (
    <Navbar>
      <Navbar.Group
        align="center"
        style={{ maxWidth: '1100px', margin: 'auto', padding: '0 1em' }}
      >
        <Link href="/">
          <a
            className={Classes.NAVBAR_HEADING}
            style={{ textDecoration: 'none' }}
          >
            MIDI Tools
          </a>
        </Link>
        <Navbar.Divider />
        {menuItems.map(menuItem => renderMenuItem(menuItem))}
      </Navbar.Group>
    </Navbar>
  )
}

export default function Layout({ children }) {
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
      <div style={{ maxWidth: '1100px', margin: '1em auto', padding: '0 1em' }}>
        {children}
      </div>
    </>
  )
}
