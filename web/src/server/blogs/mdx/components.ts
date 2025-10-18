import { animated } from "@react-spring/web";
import { motion } from "motion/react";
import * as BaseUI from "@base-ui-components/react";

import Asterisk from "~/components/asterisk";
import BlockQuote from "~/components/blockquote";
import Boop from "~/components/boop";
import CodeBlock from "~/components/code";
import { CodeTab, getCodeGroup } from "~/components/code-group";
import Copy from "~/components/copy";
import Download from "~/components/download";
import FileInput from "~/components/fileInput";
import Info from "~/components/info";
import Popover from "~/components/popover";
import Quote from "~/components/quote";
import { Tooltip } from "~/components/tooltip";
import Transition from "~/components/transition";

const components = {
  Asterisk,
  BlockQuote,
  Boop,
  CodeGroup: getCodeGroup(),
  CodeTab,
  CodeBlock,
  Copy,
  Download,
  FileInput,
  Info,
  Popover,
  Quote,
  Tooltip,
  Transition,
} as const;
type embeddedComponents<T, O extends boolean = true> = O extends true
  ? {
      [K in keyof T]?: React.ComponentType | embeddedComponents<T[K], O>;
    }
  : {
      [K in keyof T]: React.ComponentType | embeddedComponents<T[K], O>;
    };
const ui: ((
  wrappedComponent: keyof typeof BaseUI,
) => React.ComponentType | embeddedComponents<typeof BaseUI>) &
  embeddedComponents<typeof BaseUI> = (component: keyof typeof BaseUI) => {
  return BaseUI[component];
};
Object.entries(BaseUI).forEach(
  ([key, comp]) =>
    // @ts-expect-error its fine
    (ui[key] = comp),
);

export default {
  ...components,
  animated,
  motion,
  ui: ui as unknown as ((wrappedComponent: string) => React.ComponentType) &
    embeddedComponents<typeof BaseUI, false>,
} as const;
