"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useResult } from "@/api/useResult";
import { useAtomValue, useSetAtom } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { scenarioAtom } from "@/app/store/scenarioAtom";
import { chatAtom } from "@/app/store/chatAtom";
import { SITUATIONS, PERSONALITIES } from "@/lib/constants";
import Loading from "@/components/common/Loading";
import Stars from "@/components/feature/result/Stars";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SituationIcon from "@/components/common/SituationIcon";

const Page = ({
  params: { situation },
  searchParams: { systemName, personality },
}: {
  params: {
    situation: keyof typeof SITUATIONS;
  };
  searchParams: {
    systemName: string;
    personality: string;
  };
}) => {
  const queryClient = useQueryClient();
  const setChats = useSetAtom(chatAtom);
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
        <div className="flex w-full justify-center items-center flex-grow relative">
          <Link href={"/"} className="abolute left-4 block top-0">
            <ChevronLeft />
          </Link>
          <span className="flex-grow text-center -translate-x-3">결과보기</span>
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
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col font-DungGeunMo w-1/2 flex-grow-0 mx-auto items-center">
            <div className="mb-3 text-2xl">“</div>
            <p className="flex-grow-0 text-center">{data?.oneLineResult}</p>
            <div className="mb-6 text-2xl">”</div>
          </div>
          {data && (
            <div
              className="w-full aspect-square bg-center bg-no-repeat"
              style={{
                // backgroundImage: `url('data:image/png;base64,${data?.resultImage}')`,
                backgroundImage: `url('${process.env.NEXT_PUBLIC_API_HOST}/static/result_${data.resultId}.png')`,
                backgroundSize: "120%",
              }}
            ></div>
          )}
        </div>
        <div className="flex flex-col text-[#F8F8F8] items-center px-4 gap-14 mt-14 pb-4">
          <div className="w-[100px] aspect-square animate-pulse">
            <SituationIcon situation={"love"} />
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
        </div>
        <div className="w-full sticky bottom-[calc(env(safe-area-inset-bottom)+16px)] px-4">
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
