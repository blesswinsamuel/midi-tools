import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Classes, Navbar } from '@blueprintjs/core'
import { classNames } from './classNames'
import { useWakeLock } from './WakeLock'

function NavBar({
  menuItems,
}: {
  menuItems: { title: string; href: string }[]
}) {
  const router = useRouter()
  const { wakeLockEnabled, requestWakeLock, releaseWakeLock } = useWakeLock()

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
      <div style={{ maxWidth: '1100px', margin: 'auto', padding: '0 1em' }}>
        <Navbar.Group align="left">
          <Link href="/">
            <a
              className={Classes.NAVBAR_HEADING}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              MIDI Tools
            </a>
          </Link>
          <Navbar.Divider />
          {menuItems.map(menuItem => renderMenuItem(menuItem))}
        </Navbar.Group>
        <Navbar.Group align="right">
          <Button
            icon={wakeLockEnabled ? 'eye-open' : 'eye-off'}
            minimal
            onClick={wakeLockEnabled ? releaseWakeLock : requestWakeLock}
          />
        </Navbar.Group>
      </div>
    </Navbar>
  )
}

export default function Layout({ children }) {
  useEffect(() => {
    document.body.classList.add(Classes.DARK)
    return () => {
      document.body.classList.remove(Classes.DARK)
    }
  }, [])
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
