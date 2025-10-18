import type { JSX } from "react";
import { Tabs } from "@base-ui-components/react/tabs";
import React from "react";

export function getCodeGroup() {
  const tabGroups: Record<string, number> = {};

  return function CodeGroup({
    children,
    id,
  }: {
    children: JSX.Element[];
    id?: keyof typeof tabGroups;
  }) {
    let defaultValue: number;
    let callback: (val: number) => void;

    if (id) {
      if (id in tabGroups) {
        defaultValue = tabGroups[id]!;
      } else {
        defaultValue = 0;
        tabGroups[id] = defaultValue;
      }
      callback = (val: number) => {
        tabGroups[id] = val;
      };
    } else {
      defaultValue = 0;
      callback = (val) => {
        return;
      };
    }
    return (
      <Tabs.Root onValueChange={callback} defaultValue={defaultValue}>
        <Tabs.List>
          {children.map((child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                // @ts-expect-error all
                slot: "header",
              });
            }
            return null;
          })}
          <Tabs.Indicator />
        </Tabs.List>
        {children.map((child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              // @ts-expect-error all
              slot: "contents",
            });
          }
          return null;
        })}
      </Tabs.Root>
    );
  };
}

export function CodeTab({
  children,
  title,
  icon,
  slot,
}: {
  children: JSX.Element;
  title: string;
  icon?: JSX.Element;
  slot?: "contents" | "header";
}) {
  if (!slot) {
    return null;
  }
  if (slot === "contents") {
    return <Tabs.Panel value={title}>{children}</Tabs.Panel>;
  }
  return (
    <Tabs.Tab value={title}>
      {icon ?? <></>}
      {children}
    </Tabs.Tab>
  );
}
