"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstallCommandProps {
  command: string;
  variant?: "default" | "compact";
}

export function InstallCommand({ command, variant = "default" }: InstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = command;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-2 rounded-md bg-muted/50 px-2.5 py-1.5">
        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
        <code className="text-xs text-muted-foreground">{command}</code>
        <button
          onClick={handleCopy}
          className="ml-1 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={copied ? "Copied" : "Copy command"}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="group relative rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <code className="text-sm font-mono">{command}</code>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy command"}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}