import { useState, useEffect } from "react";

interface PublicConfig {
  googleClientId: string;
  googleMapsApiKey: string;
  loaded: boolean;
}

let cachedConfig: PublicConfig | null = null;

export function usePublicConfig(): PublicConfig {
  const [config, setConfig] = useState<PublicConfig>(
    cachedConfig || { googleClientId: "", googleMapsApiKey: "", loaded: false }
  );

  useEffect(() => {
    if (cachedConfig) {
      setConfig(cachedConfig);
      return;
    }

    fetch("/api/config/public")
      .then(res => res.json())
      .then(result => {
        const next = {
          googleClientId: result.googleClientId || "",
          googleMapsApiKey: result.googleMapsApiKey || "",
          loaded: true
        };
        cachedConfig = next;
        setConfig(next);
      })
      .catch(() => {
        const next = { googleClientId: "", googleMapsApiKey: "", loaded: true };
        cachedConfig = next;
        setConfig(next);
      });
  }, []);

  return config;
}

export function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${id}`));
    document.head.appendChild(script);
  });
}
