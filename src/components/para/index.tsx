import React from "react";

export interface Para {
  children: string;
}

export const Para = ({ children }: Para) => (
  <>{children.split("\n").map(line => line && <p key={line}>{line}</p>)}</>
);
