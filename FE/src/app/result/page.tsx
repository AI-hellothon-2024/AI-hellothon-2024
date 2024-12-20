"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useResult } from "@/api/useResult";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { scenarioAtom } from "@/app/store/scenarioAtom";
import { SITUATIONS, PERSONALITIES } from "@/lib/constants";
import Loading from "@/components/common/Loading";
import Stars from "@/components/feature/result/Stars";
import { ChevronLeft, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SituationIcon from "@/components/common/SituationIcon";
import JobBadge from "@/components/feature/result/JobBadge";
import Image from "next/image";
import KakaoShare from "@/components/common/KakaoShare";

const Page = () => {
  const userId = useAtomValue(userIdAtom);
  const scenarioIds = useAtomValue(scenarioAtom);
  const { data, isLoading } = useResult({ userId, scenarioIds });

  return isLoading ? (
    <div className="flex justify-center h-dvh items-center text-[#FF8C42]">
      <Loading />
    </div>
  ) : (
    <>
      <header className="sticky top-0 w-full bg-[#1E1E1E] h-[60px] px-4 z-10 flex">
        <div className="flex w-full justify-center items-center flex-grow relative text-lg font-semibold">
          <Link href={"/"} className="abolute left-4 block top-0">
            <ChevronLeft />
          </Link>
          <span className="flex-grow text-center -translate-x-3">결과보기</span>
          <Link href={`/result/chats`} className="abolute right-4 block top-0">
            <History />
          </Link>
        </div>
      </header>
      <div>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center mt-[22px]">
            <div className="flex flex-col items-center">
              {data?.flowEvaluation && (
                <div className="">
                  <Stars flowEvaluation={data.flowEvaluation} />
                </div>
              )}
              <div className="text-2xl font-DungGeunMo mt-3">
                {data?.situation && SITUATIONS[data.situation]}
              </div>
              <div className="flex gap-[5px] mt-5">
                {data && (
                  <>
                    <Badge className="bg-[rgba(217,217,217,0.15)] text-white px-2 py-1">
                      {data.systemName}
                    </Badge>
                    <Badge className="bg-[rgba(217,217,217,0.15)] text-white px-2 py-1">
                      {PERSONALITIES[data.personality]}
                    </Badge>
                    <JobBadge job={data.job} />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col font-DungGeunMo w-1/2 flex-grow-0 mx-auto items-center gap-3 mb-6 [word-break:auto-phrase]">
            <div className="text-2xl">“</div>
            <p className="flex-grow-0 text-center">{data?.oneLineResult}</p>
            <div className="text-2xl mt-2">”</div>
          </div>
          {data && (
            <div className="w-full aspect-square bg-center overflow-hidden relative">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_HOST}/static/result_${data.resultId}.png`}
                alt="result"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          )}
        </div>
        <div className="flex flex-col text-[#F8F8F8] items-center px-4 gap-14 mt-14 pb-4">
          <div className="w-[100px] aspect-square animate-pulse">
            {data?.situation && <SituationIcon situation={data.situation} />}
          </div>
          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-5 items-center rounded-2xl p-4 pb-6 bg-[rgba(217,217,217,0.15)] w-full">
              <div className="font-DungGeunMo">대화의 흐름</div>
              <p>{data?.flowExplanation}</p>
            </div>
            <div className="flex flex-col gap-5 items-center rounded-2xl p-4 pb-6 bg-[rgba(217,217,217,0.15)] w-full">
              <div className="font-DungGeunMo">나의 대답 성향</div>
              <p>{data?.responseTendency}</p>
            </div>
            <div className="flex flex-col gap-5 items-center rounded-2xl p-4 pb-6 bg-[rgba(217,217,217,0.15)] w-full">
              <div className="font-DungGeunMo">목표 달성도</div>
              <p>{data?.goalAchievement}</p>
            </div>
          </div>

          {data && (
            <div className="mb-20 flex flex-col gap-4">
              <KakaoShare
                imgUrl={`${process.env.NEXT_PUBLIC_API_HOST}/static/result_${data.resultId}.png`}
                className="flex gap-2 items-center rounded-full bg-[#ddc700] text-[#1E1E1E] hover:bg-[#ddc700]"
              >
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9 14C13.9706 14 18 10.866 18 7C18 3.13401 13.9706 0 9 0C4.02944 0 0 3.13401 0 7C0 9.33234 1.46658 11.3983 3.72161 12.6703L3 17L7.29706 13.8749C7.84849 13.957 8.41779 14 9 14Z"
                    fill="#070707"
                  />
                </svg>
                카카오톡 공유하기
              </KakaoShare>
              <Button
                className="flex items-center rounded-full text-foreground"
                asChild
              >
                <Link href="/gallery" className="flex items-center">
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.6667 2.00016H9L7.33333 0.333496H2.33333C1.41666 0.333496 0.666664 1.0835 0.666664 2.00016V12.0002C0.666664 12.9168 1.41666 13.6668 2.33333 13.6668H15.6667C16.5833 13.6668 17.3333 12.9168 17.3333 12.0002V3.66683C17.3333 2.75016 16.5833 2.00016 15.6667 2.00016Z"
                      fill="white"
                    />
                  </svg>
                  결과 모아보기
                </Link>
              </Button>
            </div>
          )}
        </div>
        <div className="w-full sticky bottom-0 px-4 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.74)] h-[240px] flex items-end pb-[calc(env(safe-area-inset-bottom)+16px)]">
          <Button
            asChild
            className="rounded-2xl text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold  w-full"
          >
            <Link href="/">처음으로</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Page;
