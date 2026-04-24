import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, ExternalLinkIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useWakeLock } from './WakeLock'

function NavBar({ menuItems }: { menuItems: { title: string; href: string }[] }) {
  const { wakeLockEnabled, requestWakeLock, releaseWakeLock } = useWakeLock()

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1100px] flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-semibold text-sm hover:opacity-80 transition-opacity">
            MIDI Tools
          </Link>
          <div className="w-px h-4 bg-border mx-1" />
          {menuItems.map(({ href, title }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                cn(
                  'text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted',
                  isActive ? 'bg-muted text-foreground' : 'text-muted-foreground'
                )
              }
            >
              {title}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={wakeLockEnabled ? releaseWakeLock : requestWakeLock}
            title={wakeLockEnabled ? 'Disable wake lock' : 'Enable wake lock'}
          >
            {wakeLockEnabled ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon">
            <a href="https://github.com/blesswinsamuel/midi-tools" title="GitHub - Source Code" target="_blank" rel="noreferrer">
              <ExternalLinkIcon className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </nav>
  )
}

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <NavBar menuItems={[{ href: '/midi-player', title: 'MIDI Player' }]} />
      <div className="mx-auto max-w-[1100px] p-4">{children}</div>
    </div>
  )
}

export default Layout
