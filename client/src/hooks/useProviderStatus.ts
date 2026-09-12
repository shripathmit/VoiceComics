import { useEffect, useState } from "react";

export interface ProviderStatus {
  stt: string;
  llm: string;
  tts: string;
}

export function useProviderStatus() {
  const [providers, setProviders] = useState<ProviderStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setProviders(data.providers as ProviderStatus);
      })
      .catch(() => {
        if (!cancelled) setProviders({ stt: "mock", llm: "mock", tts: "mock" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return providers;
}
