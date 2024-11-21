"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useResult } from "@/api/useResult";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { scenarioAtom } from "@/app/store/scenarioAtom";
import { SITUATIONS } from "@/lib/constants";
import Loading from "@/components/common/Loading";
import Stars from "@/components/feature/result/Stars";

const Page = ({
  params: { situation },
}: {
  params: {
    situation: keyof typeof SITUATIONS;
  };
}) => {
  const userId = useAtomValue(userIdAtom);
  const scenarioIds = useAtomValue(scenarioAtom);
  const { data, isLoading } = useResult({ userId, scenarioIds });

  return isLoading ? (
    <div className="flex justify-center h-dvh items-center text-[#FF8C42]">
      <Loading />
    </div>
  ) : (
    <div className="flex flex-col text-[#F8F8F8] items-center">
      {data && (
        <div
          className="w-dvw aspect-square"
          style={{
            backgroundImage: `url('data:image/png;base64,${data?.resultImage}')`,
            backgroundSize: "cover",
          }}
        ></div>
      )}
      <div className="flex flex-col px-8 items-center">
        <div className="mt-9">
          {data && <Stars flowEvaluation={data.flowEvaluation} />}
        </div>
        <div className="flex flex-col items-center gap-4 mt-[50px]">
          <div className="font-semibold text-2xl">{SITUATIONS[situation]}</div>
          <div className="font-semibold text-2xl">이름</div>
          <div className="border border-current rounded-full px-[60px] py-3 text-lg">
            성격
          </div>
        </div>
        <div className="mt-[106px] flex flex-col gap-11">
          <div className="flex flex-col gap-4 items-center">
            <div>대화의 흐름</div>
            <p>{data?.flowExplanation}</p>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <div>나의 대답 성향</div>
            <p>{data?.responseTendency}</p>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <div>목표 달성도</div>
            <p>{data?.goalAchievement}</p>
          </div>
        </div>
      </div>
      <div className="px-4 w-full pb-[env(safe-area-inset-bottom)]">
        <Button
          asChild
          className="rounded-2xl text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold  w-full"
        >
          <Link href="/">처음으로</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
