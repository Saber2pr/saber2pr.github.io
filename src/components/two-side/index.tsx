import React, { Props } from "react";
import "./style.less";

export interface TwoSide extends Props<HTMLDivElement> {}

export const TwoSide = ({ children }: TwoSide) => {
  return <div className="TwoSide">{children}</div>;
};
