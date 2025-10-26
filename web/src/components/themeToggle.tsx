"use client";

import * as React from "react";
import { Moon, Sun, Monitor, ArrowDown } from "lucide-react";
import { useTheme } from "next-themes";
import { Tooltip, TooltipProvider } from "./tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Option 1: Render nothing until mounted
    return null;
    // Option 2: Render a skeleton or placeholder if you want
    // return <div style={{ width: 100, height: 40 }} />;
  }

  return (
    <div className="dark:border-muted-foreground dark:bg-muted-foreground flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1">
      <TooltipProvider>
        <Tooltip
          contents="Light Mode"
          props={{
            popup: {
              onClick: () => setTheme("light"),
              className: `rounded-md p-2 transition-colors ${
                theme === "light"
                  ? "bg-gray-500 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-black hover:text-gray-900 dark:text-black dark:hover:text-white"
              }`,
            },
          }}
        >
          <Sun className="h-4 w-4" />
        </Tooltip>
        <Tooltip
          contents="Dark Mode"
          props={{
            popup: {
              onClick: () => setTheme("dark"),
              className: `rounded-md p-2 transition-colors ${
                theme === "dark"
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                  : "text-black hover:text-gray-900 dark:text-black dark:hover:text-white"
              }`,
            },
          }}
        >
          <Moon className="h-4 w-4" />
        </Tooltip>
        <Tooltip
          contents="System Mode"
          props={{
            popup: {
              onClick: () => setTheme("system"),
              className: `rounded-md p-2 transition-colors ${
                theme === "system"
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-black hover:text-gray-900 dark:text-black dark:hover:text-white"
              }`,
            },
          }}
        >
          <Monitor className="h-4 w-4" />
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
