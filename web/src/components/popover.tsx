import { Popover as BaseUIPopover } from "@base-ui-components/react/popover";
import type { PopoverArrow } from "node_modules/@base-ui-components/react/esm/popover/arrow/PopoverArrow";
import type { PopoverDescription } from "node_modules/@base-ui-components/react/esm/popover/description/PopoverDescription";
import type { PopoverPopup } from "node_modules/@base-ui-components/react/esm/popover/popup/PopoverPopup";
import type { PopoverPortal } from "node_modules/@base-ui-components/react/esm/popover/portal/PopoverPortal";
import type { PopoverPositioner } from "node_modules/@base-ui-components/react/esm/popover/positioner/PopoverPositioner";
import type { PopoverRoot } from "node_modules/@base-ui-components/react/esm/popover/root/PopoverRoot";
import type { PopoverTitle } from "node_modules/@base-ui-components/react/esm/popover/title/PopoverTitle";
import type { PopoverTrigger } from "node_modules/@base-ui-components/react/esm/popover/trigger/PopoverTrigger";

export default function Popover({
  children,
  title: Title,
  description: Description,
  props,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  props?: {
    root?: Omit<PopoverRoot.Props, "children">;
    trigger?: Omit<PopoverTrigger.Props, "children">;
    portal?: Omit<PopoverPortal.Props, "children">;
    positioner?: Omit<PopoverPositioner.Props, "children">;
    popup?: Omit<PopoverPopup.Props, "children">;
    arrow?: Omit<PopoverArrow.Props, "children">;
    title?: Omit<PopoverTitle.Props, "children">;
    description?: Omit<PopoverDescription.Props, "children">;
  };
}) {
  const {
    root,
    trigger,
    portal,
    positioner,
    popup,
    arrow,
    title,
    description,
  } = props ?? {};
  return (
    <BaseUIPopover.Root {...root}>
      <BaseUIPopover.Trigger {...trigger}>{children}</BaseUIPopover.Trigger>
      <BaseUIPopover.Portal {...portal}>
        <BaseUIPopover.Positioner {...positioner}>
          <BaseUIPopover.Popup {...popup}>
            <BaseUIPopover.Arrow {...arrow} />
            <BaseUIPopover.Title {...title}>{Title}</BaseUIPopover.Title>
            <BaseUIPopover.Description {...description}>
              {Description}
            </BaseUIPopover.Description>
          </BaseUIPopover.Popup>
        </BaseUIPopover.Positioner>
      </BaseUIPopover.Portal>
    </BaseUIPopover.Root>
  );
}
