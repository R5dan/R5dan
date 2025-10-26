import { Checkbox as CheckboxPrimitive } from "@base-ui-components/react/checkbox";
import { CheckIcon } from "lucide-react";

export function Checkbox(
  props: React.ComponentProps<typeof CheckboxPrimitive.Root>,
) {
  return (
    <CheckboxPrimitive.Root {...props}>
      <CheckboxPrimitive.Indicator>
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
