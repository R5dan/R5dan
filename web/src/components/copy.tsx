import { useEffect, useState, type JSX } from "react";
import Boop from "./boop";
import { toast } from "sonner";
import { Clipboard, ClipboardCheck } from "lucide-react";
import Transition from "./transition";

function toastError(text: string) {
  toast.error(text, {
    duration: 10000,
  });
  console.error(text);
}

export default function Copy({
  text,
  className,
  to = <ClipboardCheck className="h-5 w-5" />,
  from = <Clipboard className="h-5 w-5" />,
}: {
  text: string;
  className: string;
  to: JSX.Element;
  from: JSX.Element;
}) {
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (copying) {
      if (navigator?.clipboard?.writeText) {
        toast.promise(navigator.clipboard.writeText(text), {
          error: () => {
            console.error("Failed to copy text to clipboard");
            setCopying(false);
            return "Failed to copy text to clipboard";
          },
          success: () => {
            setCopied(true);
            setCopying(false);
            timeoutId = setTimeout(() => setCopied(false), 1000);
            return "Copied to clipboard";
          },
        });
      } else {
        toastError("What browser is this?");
        toastError("Why doesn't it support clipboard?");
        toastError("You can't make this up!");
        toastError("A browser that doesn't support clipboard");
        toastError("Is it a real browser?");
        toastError("Is this a joke?");

        console.error("Clipboard API not supported");
        setCopying(false);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [copying, text]);

  return (
    <Boop scale={1.2}>
      <button
        onClick={() => {
          setCopying(true);
        }}
        className={className}
      >
        <Transition From={from} To={to} showA={copied} />
      </button>
    </Boop>
  );
}
