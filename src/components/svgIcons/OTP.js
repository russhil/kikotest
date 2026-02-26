import * as React from "react"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={12}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M1 10h20v2H1v-2Zm1.15-4.05L3 4.47l.85 1.48 1.3-.75-.85-1.48H6v-1.5H4.3L5.15.75 3.85 0 3 1.47 2.15 0 .85.75l.85 1.47H0v1.5h1.7L.85 5.2l1.3.75Zm6.7-.75 1.3.75.85-1.48.85 1.48 1.3-.75-.85-1.48H14v-1.5h-1.7l.85-1.47-1.3-.75L11 1.47 10.15 0l-1.3.75.85 1.47H8v1.5h1.7L8.85 5.2ZM22 2.22h-1.7l.85-1.47-1.3-.75L19 1.47 18.15 0l-1.3.75.85 1.47H16v1.5h1.7l-.85 1.48 1.3.75.85-1.48.85 1.48 1.3-.75-.85-1.48H22v-1.5Z"
    />
  </svg>
)
export default SvgComponent
