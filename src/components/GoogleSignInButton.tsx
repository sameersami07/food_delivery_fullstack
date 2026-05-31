import React, { useEffect, useRef } from "react";
import { usePublicConfig, loadScript } from "../hooks/usePublicConfig";

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  disabled?: boolean;
}

export default function GoogleSignInButton({ onCredential, disabled }: GoogleSignInButtonProps) {
  const { googleClientId, loaded } = usePublicConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const onCredentialRef = useRef(onCredential);

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!loaded || !googleClientId || disabled || !containerRef.current || initialized.current) {
      return;
    }

    let cancelled = false;

    loadScript("https://accounts.google.com/gsi/client", "google-gsi")
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => onCredentialRef.current(response.credential)
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          width: containerRef.current.offsetWidth || 320,
          text: "continue_with",
          shape: "rectangular"
        });

        initialized.current = true;
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [loaded, googleClientId, disabled]);

  if (!loaded) return null;

  if (!googleClientId) {
    return (
      <p className="text-[10px] text-slate-400 text-center">
        Add GOOGLE_CLIENT_ID to enable Google Sign-In
      </p>
    );
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="flex justify-center w-full min-h-[44px]" />
    </div>
  );
}
