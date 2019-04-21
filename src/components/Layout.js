import styled, { createGlobalStyle } from 'styled-components'
import React from 'react'
import Header from './Header'

const GlobalStyle = createGlobalStyle`
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
`

const Container = styled.div`
  margin: 1em;
`

export default function Layout({ children }) {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Container>{children}</Container>
    </>
  )
}
