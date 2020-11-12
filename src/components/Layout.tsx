import React, { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button, Classes, Navbar } from '@blueprintjs/core'
import { classNames } from './classNames'
import { useWakeLock } from './WakeLock'

function NavBar({
  menuItems,
}: {
  menuItems: { title: string; href: string }[]
}) {
  const { wakeLockEnabled, requestWakeLock, releaseWakeLock } = useWakeLock()

  const renderMenuItem = ({ href, title }: { title: string; href: string }) => {
    return (
      <NavLink
        key={href}
        to={href}
        className={classNames(Classes.MINIMAL, Classes.BUTTON)}
        activeClassName={Classes.ACTIVE}
      >
        {title}
      </NavLink>
    )
  }

  return (
    <Navbar>
      <div style={{ maxWidth: '1100px', margin: 'auto', padding: '0 1em' }}>
        <Navbar.Group align="left">
          <Link
            to="/"
            className={Classes.NAVBAR_HEADING}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            MIDI Tools
          </Link>
          <Navbar.Divider />
          {menuItems.map((menuItem) => renderMenuItem(menuItem))}
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

const Layout: React.FC<{}> = ({ children }) => {
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

export default Layout
