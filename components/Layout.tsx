import React, { useState } from 'react'
import Link from 'next/link'
import useWebMidi from './hooks/useWebMidi'
import Spinner from './Spinner'
import Error from './Error'
import { HiMenu, HiX } from 'react-icons/hi'
import { classNames } from './classNames'
import { useRouter } from 'next/router'

function NavBar({
  menuItems,
}: {
  menuItems: { title: string; href: string }[]
}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const normalMenuItem = ({ href, title }) => {
    const activeStyle =
      'ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out'
    const normalStyle =
      'ml-4 px-3 py-2 rounded-md text-sm font-medium leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out'

    const style = router.pathname == href ? activeStyle : normalStyle
    return (
      <Link key={href} href={href}>
        <a className={style}>{title}</a>
      </Link>
    )
  }

  const mobileMenuItem = ({ href, title }) => {
    const activeStyle =
      'mt-1 block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out'
    const normalStyle =
      'mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out'

    const style = router.pathname == href ? activeStyle : normalStyle
    return (
      <Link key={href} href={href}>
        <a className={style}>{title}</a>
      </Link>
    )
  }

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
              aria-label="Main menu"
              aria-expanded="false"
            >
              {!isMobileMenuOpen && (
                <HiMenu
                  className="h-6 w-6"
                  onClick={() => setMobileMenuOpen(true)}
                />
              )}
              {isMobileMenuOpen && (
                <HiX
                  className="h-6 w-6"
                  onClick={() => setMobileMenuOpen(false)}
                />
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <div className="ml-4 px-3 py-2 text-lg font-medium leading-5 text-white">
                MIDI Tools
              </div>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex">
                {menuItems.map(menuItem => normalMenuItem(menuItem))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classNames('sm:hidden', !isMobileMenuOpen && 'hidden')}>
        <div className="px-2 pt-2 pb-3">
          {menuItems.map(menuItem => mobileMenuItem(menuItem))}
        </div>
      </div>
    </nav>
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
          { href: '/synth', title: 'Synth' },
          { href: '/midi-monitor', title: 'MIDI Monitor' },
          { href: '/transmitter', title: 'MIDI Transmitter' },
          { href: '/player', title: 'MIDI Player' },
        ]}
      />
      <div className="m-4">{children}</div>
    </>
  )
}
