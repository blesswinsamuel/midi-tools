import styled from 'styled-components'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Styled = {}
Styled.NavBar = styled.div`
  display: flex;
  font-size: 1em;
  background: #eee;
`

Styled.NavLink = styled(NavLink)`
  display: block;
  padding: 0.75em 0.5em;
  background: #eee;
`

export default function Header() {
  return (
    <Styled.NavBar>
      <Styled.NavLink to="/synth">Synth</Styled.NavLink>
      <Styled.NavLink to="/monitor">MIDI Monitor</Styled.NavLink>
      <Styled.NavLink to="/transmitter">MIDI Transmitter</Styled.NavLink>
      <Styled.NavLink to="/player">MIDI Player</Styled.NavLink>
    </Styled.NavBar>
  )
}
