import React from 'react';
import './style.less';

export interface Loading {  };

export const Loading = ({  }: Loading) => {
  return <div className="Loading">Loading</div>;
}