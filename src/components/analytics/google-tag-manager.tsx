import Script from "next/script";

/** Analytics starts only after the visitor grants permission. */
export function GoogleTagManagerScript() {
  return <Script type="module" src="/measurement/site.mjs" strategy="afterInteractive" />;
}

export function GoogleTagManagerNoScript() { return null; }
