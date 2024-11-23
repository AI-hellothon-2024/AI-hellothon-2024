"use client";
import React from "react";
import { Button } from "../ui/button";
import type { ButtonProps } from "../ui/button";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}
interface KakaoShareProps extends Omit<ButtonProps, "onClick"> {
  imgUrl: string;
}
const KakaoShare = ({ imgUrl, children, ...props }: KakaoShareProps) => {
  return (
    <Button
      {...props}
      onClick={() => {
        const { Kakao } = window;

        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: "AImigo",
            description: "IT업계 신입사원을 위한 AI 시뮬레이션",
            imageUrl: imgUrl,
            link: {
              mobileWebUrl: process.env.NEXT_PUBLIC_HOST,
              webUrl: process.env.NEXT_PUBLIC_HOST,
            },
          },
          buttons: [
            {
              title: "나도 하러가기",
              link: {
                mobileWebUrl: process.env.NEXT_PUBLIC_HOST,
                webUrl: process.env.NEXT_PUBLIC_HOST,
              },
            },
          ],
        });
      }}
    >
      {children}
    </Button>
  );
};

export default KakaoShare;
