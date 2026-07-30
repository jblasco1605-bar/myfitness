"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // instalación de PWA sigue funcionando sin SW; solo se pierde el caché offline
      });
    }
  }, []);

  return null;
}
