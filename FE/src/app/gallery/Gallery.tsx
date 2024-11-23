"use client";

import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { useCollection } from "@/api/useCollection";
import Link from "next/link";
import { SITUATIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { MiniStars } from "@/components/feature/result/Stars";
import { ChevronLeft } from "lucide-react";
import { groupBy } from "@/lib/utils";
import { twJoin, twMerge } from "tailwind-merge";
import Image from "next/image";

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
        {data
          ? Object.entries(groupBy(data.result, (data) => data.situation)).map(
              ([situation, results]) => (
                <div key={situation} className="flex flex-col gap-4">
                  <h2 className="text-white font-DungGeunMo w">
                    {SITUATIONS[situation as keyof typeof SITUATIONS]}
                  </h2>
                  <div className="grid grid-cols-3 gap-1">
                    {results.map((result) => (
                      <Link
                        key={result.resultId}
                        href={`/gallery/${result.resultId}`}
                        className={twMerge(
                          `flex flex-col rounded-[6px] overflow-clip`,
                          twJoin(
                            result.job === "productManager" &&
                              "bg-[rgba(255,140,66,0.5)]",
                            result.job === "designer" &&
                              "bg-[rgba(69,107,145,0.5)]",
                            result.job === "developer" &&
                              "bg-[rgba(68,160,152,0.5)]"
                          )
                        )}
                      >
                        <div
                          className={`overflow-hidden aspect-square w-full relative`}
                        >
                          <Image
                            fill
                            src={`${process.env.NEXT_PUBLIC_API_HOST}/static/result_${result.resultId}.png`}
                            alt="result"
                            priority
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div className="flex flex-col p-1.5 gap-1">
                          <span className="text-[#D0D0D0] font-light text-xs">
                            {result.personality || "지나치게 말수가 적은"}
                          </span>
                          <div className="flex justify-between gap-1 items-center">
                            <div className="font-semibold font-DungGeunMo">
                              {result.systemName || "정부장"}
                            </div>
                            <div className="">
                              <MiniStars
                                flowEvaluation={result.flowEvaluation}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )
          : null}
      </div>
    </>
  );
};

export default Gallery;
