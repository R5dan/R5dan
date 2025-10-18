import type React from "react";
import useBoop from "~/hooks/use-boop";
import { animated } from "@react-spring/web";

export default function Boop({
  children,
  ...boopConfig
}: {
  children: React.ReactNode;

  x?: number | undefined;
  y?: number | undefined;
  rotation?: number | undefined;
  scale?: number | undefined;
  timing?: number | undefined;
  springConfig?:
    | {
        tension: number;
        friction: number;
      }
    | undefined;
}) {
  const [style, trigger] = useBoop(boopConfig);
  return (
    <animated.span onMouseEnter={trigger} style={style}>
      {children}
    </animated.span>
  );
}
