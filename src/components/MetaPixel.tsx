"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const META_PIXEL_ID = "2142285873032765";

type PixelWindow = Window & {
  fbq?: (command: "track", event: "PageView") => void;
};

function MetaPixelPageView({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    const fbq = (window as PixelWindow).fbq;
    if (!ready || !fbq) return;

    const url = query ? `${pathname}?${query}` : pathname;
    // Also prevents duplicate initial events when Strict Mode replays effects.
    if (lastTrackedUrl.current === url) return;

    fbq("track", "PageView");
    lastTrackedUrl.current = url;
  }, [ready, pathname, query]);

  return null;
}

export default function MetaPixel() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Script
        id="hamdan-meta-pixel"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <MetaPixelPageView ready={ready} />
      </Suspense>
      <noscript>
        {/* Meta requires a direct, unoptimized tracking request without JavaScript. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
