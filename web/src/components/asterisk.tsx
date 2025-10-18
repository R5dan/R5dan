import * as React from "react";
import { Popover } from "@base-ui-components/react/popover";

export default function Asterisk({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Popover.Root openOnHover>
      <Popover.Trigger>*</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup>
            <Popover.Arrow />
            <Popover.Title>{title}</Popover.Title>
            <Popover.Description>{children}</Popover.Description>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
