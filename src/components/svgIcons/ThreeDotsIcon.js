import * as React from "react"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={5}
    height={21}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M2.25 4.5a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Zm0 8a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5ZM0 18.25a2.25 2.25 0 1 0 4.499 0 2.25 2.25 0 0 0-4.499 0Z"
    />
  </svg>
)
export default SvgComponent
