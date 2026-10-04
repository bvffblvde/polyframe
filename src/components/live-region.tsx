"use client";

import { useEffect, useState } from "react";
import { subscribeAnnouncements } from "@/lib/announce";

export function LiveRegion() {
  const [message, setMessage] = useState("");
  useEffect(
    () =>
      subscribeAnnouncements((m) => {
        setMessage("");
        requestAnimationFrame(() => setMessage(m));
      }),
    [],
  );
  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only" data-testid="live-region">
      {message}
    </div>
  );
}
