import React from "react";

const Camera = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fill="currentColor"
      d="M26 7h-3.465l-1.704-2.555A1 1 0 0020 4h-8a1 1 0 00-.831.445L9.464 7H6a3 3 0 00-3 3v14a3 3 0 003 3h20a3 3 0 003-3V10a3 3 0 00-3-3zm1 17a1 1 0 01-1 1H6a1 1 0 01-1-1V10a1 1 0 011-1h4a1 1 0 00.832-.445L12.535 6h6.929l1.704 2.555A1 1 0 0022 9h4a1 1 0 011 1v14zM16 11a5.5 5.5 0 105.5 5.5A5.506 5.506 0 0016 11zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"
    ></path>
  </svg>
);

export default Camera;
