import React, { ReactElement, ReactHTMLElement } from "react";

const TextInput = (
  props: {
    className?: string;
    righticon?: ReactElement;
    placeholder?: string;
  } & React.HTMLProps<HTMLInputElement>
) => (
  <div className={`relative text-gray-600 ${props.className}`}>
    <input
      {...props}
      placeholder={props.placeholder}
      className="border-2 border-grey-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
    />
    <button type="submit" className="absolute right-0 top-0 mt-2 mr-2">
      {props.righticon}
    </button>
  </div>
);

export default TextInput;
