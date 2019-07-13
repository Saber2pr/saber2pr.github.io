import React, { useState, useEffect } from "react";
import { LinkProps, Link } from "@saber2pr/router";
import { store } from "../../store";

export interface ALink extends LinkProps {
  act: string;
  uact: string;
}

export const ALink = ({ act, uact, onClick, ...props }: ALink) => {
  const [className, set] = useState(uact);
  useEffect(() =>
    store.subscribe(() =>
      store.getState().href.startsWith(props.to) ? set(act) : set(uact)
    )
  );
  return (
    <Link
      {...props}
      className={`${props.className} ${className}`}
      onClick={event => {
        onClick && onClick(event);
        store.dispatch("href", props.to);
      }}
    />
  );
};
