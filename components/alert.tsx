import React from "react";
import { AlertType } from "../enum";

const Alert = ({
  type,
  alertState,
  text,
}: {
  type: AlertType;
  text: string;
  alertState: boolean;
} & React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={`transition-opacity duration-500 ${
        alertState ? `opacity-100` : `opacity-0`
      } text-sm bg-${type} h-12 flex items-center py-4 px-10 rounded-sm absolute w-full justify-center`}
      role="alert"
    >
      {text}
    </div>
  );
};

export default Alert;
