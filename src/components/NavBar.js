import styled from 'styled-components'
import React from 'react'

const NavBar = styled.div`
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`

export default NavBar;

export const NavItem = ({ link, children }) => (
  <span>{children}</span>
)