import styled from 'styled-components'

export default styled.select`
  /* Adapt the colors based on primary prop */
  background: ${props => props.primary ? "palevioletred" : "white"};
  color: ${props => props.primary ? "white" : "palevioletred"};

  margin: 1em;
  padding: 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;
