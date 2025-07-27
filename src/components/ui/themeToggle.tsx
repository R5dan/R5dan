"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

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
      <button
        onClick={() => setTheme("light")}
        className={`rounded-md p-2 transition-colors ${
          theme === "light"
            ? "bg-gray-500 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
            : "text-black hover:text-gray-900 dark:text-black dark:hover:text-white"
        }`}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`rounded-md p-2 transition-colors ${
          theme === "dark"
            ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
            : "text-black hover:text-gray-900 dark:text-black dark:hover:text-white"
        }`}
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`rounded-md p-2 transition-colors ${
          theme === "system"
            ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
            : "text-black hover:text-gray-900 dark:text-black dark:hover:text-white"
        }`}
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
