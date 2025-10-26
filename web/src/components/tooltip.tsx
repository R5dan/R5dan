import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { ArrowDown } from "lucide-react";
import type React from "react";

export function Tooltip({
  children,
  arrowIcon = <ArrowDown />,
  contents,
  props = {},
}: {
  children: React.ReactNode;
  arrowIcon?: React.ReactNode;
  contents: React.ReactNode;
  props?: {
    root?: BaseTooltip.Root.Props;
    trigger?: BaseTooltip.Trigger.Props;
    portal?: BaseTooltip.Portal.Props;
    positioner?: BaseTooltip.Positioner.Props;
    popup?: BaseTooltip.Popup.Props;
    arrow?: BaseTooltip.Arrow.Props;
  };
}) {
  const {
    root = {},
    trigger = {},
    portal = {},
    positioner = { sideOffset: 10 },
    popup = {},
    arrow = {},
  } = props || {};
  return (
    <BaseTooltip.Root {...root}>
      <BaseTooltip.Trigger {...trigger}>{children}</BaseTooltip.Trigger>
      <BaseTooltip.Portal {...portal}>
        <BaseTooltip.Positioner {...positioner}>
          <BaseTooltip.Popup {...popup}>
            <BaseTooltip.Arrow {...arrow}>{arrowIcon}</BaseTooltip.Arrow>
            {contents}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

export const TooltipProvider = BaseTooltip.Provider;
