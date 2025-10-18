import Asterisk from "./asterisk";
import BlockQuote from "./blockquote";
import Quote from "./quote";
import Code from "./code";
import { getCodeGroup, CodeTab } from "./code-group";
import Info from "./info";

export default {
  Asterisk,
  Quote,
  BlockQuote,
  Code,
  CodeGroup: getCodeGroup(),
  CodeTab,
  Info,
} as const;
