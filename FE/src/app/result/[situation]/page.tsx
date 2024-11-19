"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useResult } from "@/api/useResult";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { scenarioAtom } from "@/app/store/scenarioAtom";

const Page = () => {
  const userId = useAtomValue(userIdAtom);
  const scenarioIds = useAtomValue(scenarioAtom);
  const { data, isLoading } = useResult({ userId, scenarioIds });

  return isLoading ? (
    <>로딩 중..</>
  ) : (
    <div className="flex flex-col">
      {data && (
        <div
          className="w-[200px] h-[400px]"
          style={{
            backgroundImage: `url('data:image/png;base64,${data?.resultImage}')`,
            backgroundSize: "cover",
          }}
        ></div>
      )}
      <div className="flex flex-col">
        <strong>flowEvaluation</strong>
        <div>{data?.flowEvaluation}</div>
      </div>
      <div className="flex flex-col">
        <strong>flowExplanation</strong>
        <div>{data?.flowExplanation}</div>
      </div>
      <div className="flex flex-col">
        <strong>responseTendency</strong>
        <div>{data?.responseTendency}</div>
      </div>
      <div className="flex flex-col">
        <strong>goalAchievement</strong>
        <div>{data?.goalAchievement}</div>
      </div>
      <Button asChild>
        <Link href="/">처음으로</Link>
      </Button>
    </div>
  );
};

export default Page;
