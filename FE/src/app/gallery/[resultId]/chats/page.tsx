"use client";
import React, { Fragment } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCollectionDetail } from "@/api/useCollectionDetail";
import Loading from "@/components/common/Loading";

const Page = ({
  params: { resultId },
}: {
  params: {
    resultId: string;
  };
}) => {
  const userId = useAtomValue(userIdAtom);
  const { data, isLoading } = useCollectionDetail({ userId, resultId });
  const router = useRouter();
  if (isLoading) {
    return (
      <div className="flex justify-center h-dvh items-center text-[#FF8C42]">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 w-full bg-[#1E1E1E] h-[60px] flex items-center px-4 z-10 text-lg font-semibold">
        <button onClick={() => router.back()}>
          <ChevronLeft />
        </button>
      </header>
      <div className="flex flex-col gap-2 px-6 pt-2 pb-[60px]">
        {data?.scenarios.map(
          ({ scenarioId, scenarioContent, answer }, index) => (
            <Fragment key={scenarioId}>
              <div className="p-6 w-full text-[#F8F8F8] rounded-b-[28px] backdrop-blur-sm break-all whitespace-break-spaces bg-[rgba(0,0,0,0.8)] rounded-tr-[28px] empty:hidden">
                {scenarioContent}
              </div>
              <div className="p-6 w-full text-[#F8F8F8] rounded-b-[28px] backdrop-blur-sm break-all whitespace-break-spaces bg-[rgba(31,31,31,0.7)] rounded-tl-[28px] border border-primary box-border empty:hidden">
                {answer}
              </div>
            </Fragment>
          )
        )}
      </div>
    </div>
  );
};

export default Page;
