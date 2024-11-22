"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/motion";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GalleryButton from "@/components/feature/main/GalleryButton";

export default function Home() {
  const [bg, setBg] = useState(1);
  return (
    <MotionDiv
      className="w-full h-dvh overflow-y-clip bg-center grid grid-rows-5 transition-all bg-cover bg-no-repeat "
      style={{
        backgroundSize: "110%",
        backgroundImage: `url(/splash/${bg}.png)`,
      }}
    >
      <div className="row-span-2">
        <div className="self-start mb-4 flex mx-auto backdrop-blur rounded-full border w-fit px-5 py-2 font-bold items-center text-primary gap-2">
          <Button
            variant={"secondary"}
            className="rounded-full aspect-square"
            onClick={() => {
              setBg((prev) => (prev === 26 ? 1 : prev + 1));
            }}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant={"secondary"}
            className="rounded-full aspect-square"
            onClick={() => {
              setBg((prev) => (prev === 1 ? 26 : prev - 1));
            }}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-b to-[#1E1E1E] from-transparent h-full px-9 flex flex-col justify-end pb-[74px] gap-14 row-span-3 via-60% via-[#1E1E1E]">
        <div className="flex flex-col items-center gap-3">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            사회초년생을 위한
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
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
