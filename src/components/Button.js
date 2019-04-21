import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  background: #fff;
  color: #000;

  font-size: 1em;
  margin: 0.25em;
  padding: 0.25em;
  border: 2px solid #000;
  transition: all ease-in-out .1s;
  
  &:hover {
    background: #000;
    color: #ffffff;
  }
  &:focus {
    background: #333;
    color: #ffffff;
    outline: 0;
  }
`

export default function Button(props) {
  return <StyledButton {...props} />
}
