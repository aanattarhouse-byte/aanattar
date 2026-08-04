"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const META_PIXEL_ID = "1518064532953325";
export default function DeferredMetaPixel() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) return;

    const enable = () => setEnabled(true);
    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, enable, { once: true, passive: true });
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, enable);
      });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
`,
      }}
    />
  );
}
