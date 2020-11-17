import React, { ReactElement } from "react";

const TextInput = ({
  className,
  rightIcon,
  placeholder,
}: {
  className?: string;
  rightIcon?: ReactElement;
  placeholder?: string;
}) => (
  <div className={`relative text-gray-600 ${className}`}>
    <input
      placeholder={placeholder}
      className="border-2 border-grey-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none w-full"
    />
    <button type="submit" className="absolute right-0 top-0 mt-2 mr-2">
      {rightIcon}
    </button>
  </div>
);

export default TextInput;
