// const StyledInput = styled.input`
//   background: #fff;
//   color: #000;

//   font-size: 1em;
//   margin: 0.25em;
//   padding: 0.25em;
//   border: 2px solid #000;
//   transition: all ease-in-out 0.1s;

//   &:hover {
//     border: 2px solid #333;
//   }
//   &:focus {
//     background: #f2f2f2;
//     border: 2px solid #333;
//     outline: 0;
//   }
// `

export default function Input(props) {
  return <input type="text" {...props} />
}
