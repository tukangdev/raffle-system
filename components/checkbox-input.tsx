import React from "react";

type CheckboxInputProps = {
  wrapperclass?: string;
} & React.HTMLProps<HTMLInputElement>;
const CheckboxInput = (props: CheckboxInputProps) => (
  <div className={`relative h-6 w-6 ${props.wrapperclass}`}>
    <label className="checkbox-container block relative cursor-pointer select-none">
      <input
        {...props}
        type="checkbox"
        className="absolute opacity-0 cursor-pointer h-0 w-0"
      />
      <span className="checkmark absolute top-0 left-0 h-6 w-6 bg-grey-200 hover:bg-grey-300"></span>
    </label>
  </div>
);

export default CheckboxInput;
