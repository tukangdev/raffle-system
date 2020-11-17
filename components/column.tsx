import React from "react";

const Column = ({
  children,
  title,
  action,
}: {
  children: React.ReactNode;
  title: string;
  action?: React.ReactElement;
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl sm:text-3xl font-semibold">{title}</h2>
        {action}
      </div>

      {children}
    </div>
  );
};

export default Column;
