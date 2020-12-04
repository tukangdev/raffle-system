import React, { ReactElement } from "react";

type ButtonProps = {
  children?: React.ReactNode;
  leftIcon?: ReactElement;
  isDisabled: boolean;
} & React.HTMLProps<HTMLButtonElement>;

const defaultProps = {
  isDisabled: false,
};

const Button = (props: ButtonProps) => (
  <button
    onClick={props.onClick}
    type={props.type as "button" | "submit" | "reset" | undefined}
    className={`bg-primary px-4 py-2 text-white ${
      props.isDisabled && "bg-grey-600"
    } ${props.className}`}
  >
    {props.leftIcon}
    {props.children}
  </button>
);

Button.defaultProps = defaultProps;

export default Button;
