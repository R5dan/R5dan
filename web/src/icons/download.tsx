import React, { type CSSProperties } from "react";
import {
  animated,
  useSpring,
  useReducedMotion,
  easings,
} from "@react-spring/web";
import { ArrowDown, Check } from "lucide-react";
import Transition from "~/components/transition";
import DownloadUnderline from "./download-underline";
import useBoop from "~/hooks/use-boop";
import DownloadArrow from "./download-arrow";

type Props = {
  downloaded: boolean;
  downloading: boolean;
};

export default function DownloadIcon({ downloaded, downloading }: Props) {
  const run = useReducedMotion();
  const [style, setStyles] = React.useState<CSSProperties>({});
  // const [style, boopTrigger] = useBoop({ y:10, springConfig: { tension: 300, friction: 10, bounce: 1 } });
  const trigger = () => {
    console.log("trigger" + run + "downloading" + downloading);

    if (downloading || run) {
      console.log("R" + run);
      return;
    }
    setStyles({ translate: "0px 5px" });
  };
  const leaveTrigger = () => {
    console.log("leaveTrigger");

    if (downloading) {
      return;
    }
    setStyles({ translate: "0px 0px" });
  };

  return (
    <div className="border-green h-min w-min self-center border-2 bg-gray-500">
      <animated.div
        className="absolute h-[24px] w-4 border-black bg-gray-400 opacity-50"
        aria-hidden
        //style={style}
      />
      <Transition
        From={<DownloadArrow />}
        To={<Check />}
        showA={!downloaded}
        onMouseOver={trigger}
        onMouseLeave={leaveTrigger}
        style={{ position: "absolute", ...style }}
      />
      <DownloadUnderline />
    </div>
  );
}
