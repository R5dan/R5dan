"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext } from "react";
import { Tabs } from "@base-ui-components/react/tabs";

class Tab {
  constructor(
    public label: string,
    public children: ReactNode,
  ) {}
}

class Group {
  public tabs: Tab[] = [];
  constructor(public activeTab = 1) {}

  addTab(tab: Tab) {
    this.tabs.push(tab);
  }

  setActiveTab(id: number) {
    this.activeTab = id;
  }
}

const GroupsContext = createContext<Record<string, Group>>({});
const GroupContext = createContext<Group | null>(null);

export function CodeGroup({ id }: { id?: string }) {
  const ctx = useContext(GroupsContext);
  let group: Group;
  if (id) {
    if (id in ctx) {
      group = ctx[id]!;
    } else {
      group = new Group();
      ctx[id] = group;
    }
  } else {
    group = new Group();
  }

  return React.createElement(
    GroupContext.Provider,
    {
      value: group,
    },

    <Tabs.Root
      value={group.activeTab}
      onValueChange={(v: number) => group.setActiveTab(v)}
    >
      <Tabs.List>
        {group.tabs.map((tab, i) => (
          <Tabs.Tab key={i} value={i}>
            {tab.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator />
      </Tabs.List>
      {group.tabs.map((tab, i) => (
        <Tabs.Panel key={i} value={i}>
          {tab.children}
        </Tabs.Panel>
      ))}
    </Tabs.Root>,
  );
}

export function CodeTab({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const group = useContext(GroupContext);

  if (!group) {
    throw new Error("CodeTab must be used within a CodeGroup");
  }

  group.addTab(new Tab(label, children));
  return <></>;
}

export function CodeGroupContext({ children }: { children: ReactNode }) {
  return React.createElement(
    GroupsContext.Provider,
    {
      value: {},
    },
    children,
  );
}
