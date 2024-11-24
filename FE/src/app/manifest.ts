import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "에이미고",
    description: "신입사원의 빠른 온보딩과 대화 스킬 학습을 위한 AI 파트너",
    display: "standalone",
    start_url: "/",
    theme_color: "#1E1E1E",
    background_color: "#1E1E1E",
    icons: [
      {
        src: "icons/icon-96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        src: "icons/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "icons/icon-maskable-640.png",
        type: "image/png",
        sizes: "640x640",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshot.jpg",
        sizes: "1280x832",
        type: "image/jpg",
      },
    ],
  };
}
