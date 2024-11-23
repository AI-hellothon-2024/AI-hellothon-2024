"use client";

import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { useCollection } from "@/api/useCollection";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MiniStars } from "@/components/feature/result/Stars";
import { ChevronLeft } from "lucide-react";

const Gallery = () => {
  const userId = useAtomValue(userIdAtom);
  const router = useRouter();
  const { data, isLoading } = useCollection({ userId });
  return (
    <>
      <header className="h-[60px] sticky top-0 flex items-center font-semibold text-lg z-10 px-4">
        <div className="relative w-full flex items-center">
          <button onClick={() => router.back()}>
            <ChevronLeft />
          </button>
          <h1
            className="absolute top-0 
            left-1/2 transform -translate-x-1/2
          "
          >
            결과 모아보기
          </h1>
        </div>
      </header>
      <div className="flex flex-col px-4">
        <div className="grid grid-cols-3 gap-1">
          {data?.result.map((result) => (
            <Link
              key={result.resultId}
              href={`/gallery/${result.resultId}`}
              className={`p-[5px] flex flex-col bg-[#424242] rounded-xl gap-1.5 items-center pb-2`}
            >
              <div
                className={`overflow-hidden aspect-square`}
                style={{ borderRadius: "11px" }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_HOST}/static/result_${result.resultId}.png`}
                />
              </div>
              <div className="h-[12px]">
                <MiniStars flowEvaluation="good" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Gallery;
