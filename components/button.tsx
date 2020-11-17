import React, { ReactElement } from "react";

type ButtonProps = {
  children?: React.ReactNode;
  leftIcon?: ReactElement;
} & React.HTMLProps<HTMLButtonElement>;

const Button = (props: ButtonProps) => (
  <button className="bg-primary px-4 py-2 text-white">
    {props.leftIcon}
    {props.children}
  </button>
);

export default Button;
