import React from 'react'

// const StyledSelectWrapper = styled.span`
//   position: relative;

//   &:after {
//     content: ' ';
//     position: absolute;
//     right: 0.6em;
//     top: 50%;
//     transform: translateY(-50%);

//     width: 0;
//     height: 0;
//     border-left: 4px solid transparent;
//     border-right: 4px solid transparent;
//     border-top: 4px solid #000;
//   }
// `

// const StyledSelect = styled.select`
//   background: #fff;
//   color: #000;

//   font-size: 1em;
//   margin: 0.25em;
//   padding: 0.25em 1em 0.25em 0.25em;
//   transition: all ease-in-out 0.1s;
//   border: 2px solid #000;

//   -webkit-appearance: none;
//   -webkit-border-radius: 0;

//   &:focus {
//     background: #f2f2f2;
//     outline: 0;
//   }

//   &:after {
//     content: ' ';
//     width: 0;
//     height: 0;
//     border-left: 20px solid transparent;
//     border-right: 20px solid transparent;

//     border-top: 20px solid #f00;
//   }
// `

export default function Select({
  options,
  valueKey = x => x,
  labelKey = x => x,
  ...props
}) {
  return (
    <span>
      <select {...props}>
        {options.map(option => (
          <option key={valueKey(option)} value={valueKey(option)}>
            {labelKey(option)}
          </option>
        ))}
      </select>
    </span>
  )
}
