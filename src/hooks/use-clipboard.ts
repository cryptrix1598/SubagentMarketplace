import { useState, useCallback } from "react";

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-9999px";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), timeout);
          return true;
        } catch {
          return false;
        }
      }
    },
    [timeout],
  );

  return { copied, copy };
}