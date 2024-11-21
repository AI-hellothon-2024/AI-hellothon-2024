import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AImigo",
    description: "IT업계 신입사원을 위한 시뮬레이션",
    display: "standalone",
    start_url: "/",
    theme_color: "#000000",
    background_color: "#FF8C42",
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
