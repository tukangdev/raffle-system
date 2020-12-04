import React from "react";

type CardProps = {
  wrapperclass?: string;
  children: React.ReactNode;
};

const Card = (props: CardProps) => {
  return (
    <div
      className={`mt-4 rounded overflow-hidden shadow-lg p-6 ${props.wrapperclass}`}
    >
      {props.children}
    </div>
  );
};

export default Card;
