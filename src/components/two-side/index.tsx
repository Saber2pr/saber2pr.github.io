import './style.less'

import React, { Props } from 'react'

export interface TwoSide extends Props<HTMLDivElement> {}

export const TwoSide = ({ children }: TwoSide) => {
  return <div className="TwoSide">{children}</div>;
};
