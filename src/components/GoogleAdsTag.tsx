import Script from "next/script";

export default function GoogleAdsTag() {
  return (
    <>
      <Script id="hamdan-google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-18458745440');
        `}
      </Script>
      <Script
        id="hamdan-google-ads"
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-18458745440"
        strategy="afterInteractive"
      />
    </>
  );
}
