import React from "react";

type CardProps = {
  wrapperClass?: string;
  children: React.ReactNode;
};

const Card = (props: CardProps) => {
  return (
    <div
      className={`mt-4 rounded overflow-hidden shadow-lg p-6 ${props.wrapperClass}`}
    >
      {props.children}
    </div>
  );
};

export default Card;