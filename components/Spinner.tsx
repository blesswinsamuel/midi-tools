import React from 'react'

const Styled = {}

// Styled.Spinner = styled.div`
//   margin: 100px auto 0;
//   width: 70px;
//   text-align: center;

//   & > div {
//     width: 18px;
//     height: 18px;
//     background-color: #333;
//     margin: 2px;

//     border-radius: 100%;
//     display: inline-block;
//     animation: sk-bouncedelay 1.4s infinite ease-in-out both;
//   }

//   .app-dark & > div {
//     background-color: #ccc;
//   }

//   & .bounce1 {
//     animation-delay: -0.32s;
//   }

//   & .bounce2 {
//     animation-delay: -0.16s;
//   }

//   @keyframes sk-bouncedelay {
//     0%,
//     80%,
//     100% {
//       transform: scale(0);
//     }
//     40% {
//       transform: scale(1);
//     }
//   }
// `

// Styled.Caption = styled.div`
//   margin-top: 4px;
//   text-align: center;
// `

export default function Spinner({ children }) {
  return (
    <>
      <div>
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
      <div>{children}</div>
    </>
  )
}
