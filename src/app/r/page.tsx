"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { posthog } from "posthog-js";
import { toast } from "sonner";
import { Clipboard, ClipboardCheck } from "lucide-react";
import env from "~/env";

export default function Page() {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("SUBMIT");

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setSuccess(null);
    setError(null);
    setShortId("");
    setLoading(true);
    const res = await fetch(`/api/redirect/create`, {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    if (res.status !== 200){
      console.error(res);
      setError(new Error("Failed to create redirect"));
      setSuccess(false);
      return;
    }
    const data = await res.json();
    setShortId(data.id);
    setSuccess(true);
    setError(null);
    setLoading(false);

    const redirectUrl = new URL(`${env.NEXT_PUBLIC_HOST}/r/${data.id}`);
    toast.success("Redirect created!", {
      action: {
        label: "Goto",
        onClick: () => window.open(redirectUrl.toString(), "_blank"),
      },
    });

    posthog.capture("SET REDIRECT", { url, id: data.id });
  }

  const copyToClipboard = async (text: string) => {
    setCopied(true);
    await navigator.clipboard.writeText(text);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-4xl font-bold">URL Shortener</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="url" className="mb-2 block text-sm font-medium">
              Enter URL to shorten
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="https://example.com"
              required
            />
          </div>

          {shortId && (
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 flex flex-row">
              <a className="font-mono text-lg text-white">
                /r/{shortId}
              </a>
              <button
                onClick={() =>
                  copyToClipboard(`${env.NEXT_PUBLIC_HOST}/r/${shortId}`)
                }
              >{copied ? <ClipboardCheck /> : <Clipboard />}</button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Shorten URL"}
          </button>
        </form>
      </div>
    </main>
  );
}
