import React from 'react'
import Link from 'next/link'
import useWebMidi from './hooks/useWebMidi'
import Spinner from './Spinner'
import Error from './Error'

// const GlobalStyle = createGlobalStyle`
// body {
//   margin: 0;
//   padding: 0;
//   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
//     "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
//     sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
// }

// code {
//   font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
//     monospace;
// }
// `

// const Container = styled.div`
//   margin: 1em;
// `

// Styled.NavBar = styled.div`
//   display: flex;
//   font-size: 1em;
//   background: #eee;
//   margin-bottom: 0.5em;
// `

// Styled.NavLink = styled(NavLink).attrs({ activeClassName: 'active' })`
//   display: block;
//   padding: 0.75em 0.5em;
//   text-decoration: none;
//   background: #eee;
//   color: #000000;

//   &.active {
//     background: #000000;
//     color: #ffffff;
//   }
// `

function NavBar({ children }) {
  return (
    <nav className="nav flex flex-wrap items-center justify-between px-4">
      <div className="flex flex-no-shrink items-center mr-6 py-3 text-grey-darkest">
        <span className="font-semibold text-xl tracking-tight">MIDI Tools</span>
      </div>

      {children}
    </nav>
  )
}

function NavMenu({ children }) {
  return (
    <ul className="menu border-b md:border-none flex justify-end list-reset m-0 w-full md:w-auto">
      {children}
    </ul>
  )
}

function NavItem({ href, children }) {
  return (
    <li className="border-t md:border-none">
      <Link href={href}>
        <a className="block md:inline-block px-4 py-3 no-underline text-grey-darkest hover:text-grey-darker font-bold">
          {children}
        </a>
      </Link>
    </li>
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
      <NavBar>
        <NavMenu>
          <NavItem href="/synth">Synth</NavItem>
          <NavItem href="/midi-monitor">MIDI Monitor</NavItem>
          <NavItem href="/transmitter">MIDI Transmitter</NavItem>
          <NavItem href="/player">MIDI Player</NavItem>
        </NavMenu>
      </NavBar>
      <div className="m-4">{children}</div>
    </>
  )
}
