import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { ArrowDown } from "lucide-react";
import type React from "react";

export function Tooltip({
  children,
  arrow = <ArrowDown />,
  contents,
}: {
  children: React.ReactNode;
  arrow?: React.ReactNode;
  contents: React.ReactNode;
}) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger>{children}</BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner sideOffset={10}>
          <BaseTooltip.Popup>
            <BaseTooltip.Arrow>{arrow}</BaseTooltip.Arrow>
            {contents}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

export const TooltipProvider = BaseTooltip.Provider;
