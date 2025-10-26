"use client";

import React, { type JSX } from "react";
import { useTransition, animated } from "@react-spring/web";

export default function Transition({
  From,
  To,
  showA,
  ...props
}: {
  From: JSX.Element;
  To: JSX.Element;
  showA: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const transitions = useTransition(showA, {
    from: { opacity: 0, transform: "scale(0.9)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0, transform: "scale(1.1)" },
    config: { tension: 20, friction: 10 },
  });

  return transitions((styles, item) =>
    item ? (
      <animated.div style={{ ...styles, position: "absolute" }} {...props}>
        {From}
      </animated.div>
    ) : (
      <animated.div style={{ ...styles, position: "absolute" }} {...props}>
        {To}
      </animated.div>
    ),
  );

  // return (
  //   <div {...props}>
  //     {From}
  //   </div>
  // )
}
