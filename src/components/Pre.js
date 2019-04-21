import React from 'react'
import styled from 'styled-components'

const StyledPre = styled.pre`
  background: #f2f2f2;
`

export default React.forwardRef(function Pre(props, ref) {
  return <StyledPre ref={ref} {...props} />
})
