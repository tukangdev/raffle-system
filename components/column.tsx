import React from "react";

const Column = ({
  children,
  title,
  action,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
  action?: React.ReactElement;
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl sm:text-3xl font-semibold">{title}</h2>
        {action}
      </div>

      {children}
    </div>
  );
};

export default Column;
