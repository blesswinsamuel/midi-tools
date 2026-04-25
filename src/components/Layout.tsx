import type React from 'react'
import { Link, useMatch } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, SunIcon, MoonIcon, CodeXmlIcon } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useWakeLock } from './WakeLock'
import { useTheme } from './hooks/useTheme'

function NavItem({ href, title }: { href: string; title: string }) {
  const match = useMatch(href)
  return (
    <NavigationMenuItem>
      <NavigationMenuLink active={match !== null} render={<Link to={href} />}>
        {title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

function NavBar({ menuItems }: { menuItems: { title: string; href: string }[] }) {
  const { wakeLockEnabled, requestWakeLock, releaseWakeLock } = useWakeLock()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1100px] flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-semibold text-sm hover:opacity-80 transition-opacity">
            MIDI Tools
          </Link>
          {menuItems.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-1 h-4 self-center" />
              <NavigationMenu>
                <NavigationMenuList>
                  {menuItems.map(({ href, title }) => (
                    <NavItem key={href} href={href} title={title} />
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                />
              }
            >
              {resolvedTheme === 'dark' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
            </TooltipTrigger>
            <TooltipContent>{resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={wakeLockEnabled ? releaseWakeLock : requestWakeLock}
                />
              }
            >
              {wakeLockEnabled ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
            </TooltipTrigger>
            <TooltipContent>{wakeLockEnabled ? 'Disable wake lock' : 'Enable wake lock'}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href="https://github.com/blesswinsamuel/midi-tools"
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                >
                  <CodeXmlIcon className="size-4" />
                </a>
              }
            />
            <TooltipContent>GitHub - Source Code</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </nav>
  )
}

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar menuItems={[]} />
      <div className="mx-auto max-w-[1100px] p-4">{children}</div>
    </div>
  )
}

export default Layout
