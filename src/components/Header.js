import styled from 'styled-components'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Styled = {}
Styled.NavBar = styled.div`
  display: flex;
  font-size: 1em;
  background: #eee;
  margin-bottom: 0.5em;
`

Styled.NavLink = styled(NavLink).attrs({ activeClassName: 'active' })`
  display: block;
  padding: 0.75em 0.5em;
  text-decoration: none;
  background: #eee;
  color: #000000;

  &.active {
    background: #000000;
    color: #ffffff;
  }
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
