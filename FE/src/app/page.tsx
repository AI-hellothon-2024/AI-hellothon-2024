"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import GalleryButton from "@/components/feature/main/GalleryButton";
import { getRandomNumber } from "@/lib/utils";

export default function Home() {
  const [bg, setBg] = useState(getRandomNumber(1, 20));

  useEffect(() => {
    const interval = setInterval(() => {
      setBg(getRandomNumber(1, 20));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MotionDiv
      className="w-full h-dvh overflow-y-clip bg-center grid grid-rows-5 transition-all bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(/splash/${bg}.png)`,
      }}
    >
      <div className="row-span-2" />

      <div className="bg-gradient-to-b to-[#1E1E1E] from-transparent h-full px-9 flex flex-col justify-end pb-[74px] gap-14 row-span-3 via-60% via-[#1E1E1E]">
        <div className="flex flex-col items-center gap-3">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
            }}
          >
            사회초년생을 위한
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
            }}
          >
            <Image src="/logo.png" width={129} height={40} alt="AImigo" />
          </MotionDiv>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            asChild
            className="rounded-full rounded-tr-none text-xl font-medium h-auto py-3 text-[#F8F8F8]"
          >
            <Link href={"/info"}>시작하기</Link>
          </Button>
          <GalleryButton />
        </div>
      </div>
    </MotionDiv>
  );
}
