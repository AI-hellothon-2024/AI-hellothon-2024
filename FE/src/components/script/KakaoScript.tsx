"use client";

import Script from "next/script";

function KakaoScript() {
  const onLoad = () => {
    if (typeof window === "undefined") {
      return;
    }
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
  };

  return (
    <Script
      strategy="lazyOnload"
      src="https://developers.kakao.com/sdk/js/kakao.js"
      onLoad={onLoad}
      onError={(e: Error) => {
        console.error("Script failed to load", e);
      }}
    />
  );
}

export default KakaoScript;
