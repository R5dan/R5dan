"use client";

import React from "react";

export default function useToggle(initialValue = false) {
  const [value, setValue] = React.useState(initialValue);
  const toggle = React.useCallback(
    (val?: boolean) => setValue((v) => val ?? !v),
    [],
  );
  return [value, toggle] as const;
}
