import React from 'react'
// export default styled.div`
//   /* Adapt the colors based on primary prop */
//   background: red;
//   color: white;

//   font-size: 1em;
//   margin: 1em;
//   padding: 0.25em 1em;
// `;

export default function AppError({ error }: { error: any }) {
  return <div>{error}</div>
}
