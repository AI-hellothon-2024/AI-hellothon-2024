"use client";

import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { useCollectionDetail } from "@/api/useCollectionDetail";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITUATIONS, PERSONALITIES } from "@/lib/constants";
import Stars from "@/components/feature/result/Stars";
import { History, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SituationIcon from "@/components/common/SituationIcon";
import KakaoShare from "@/components/common/KakaoShare";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";
import JobBadge from "@/components/feature/result/JobBadge";
import Image from "next/image";

interface Props {
  resultId: string;
}
const Detail = ({ resultId }: Props) => {
  const router = useRouter();
  const userId = useAtomValue(userIdAtom);
  const { data, isLoading } = useCollectionDetail({ userId, resultId });
  if (isLoading) {
    return (
      <div className="flex justify-center h-dvh items-center text-[#FF8C42]">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <header className="sticky top-0 w-full bg-[#1E1E1E] h-[60px] flex items-center justify-between px-4 z-10 text-lg font-semibold">
        <button onClick={() => router.back()}>
          <ChevronLeft />
        </button>
        <span>자세히보기</span>
        <Link href={`/gallery/${resultId}/chats`}>
          <History />
        </Link>
      </header>
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
        <div className="flex flex-col font-DungGeunMo w-2/3 flex-grow-0 mx-auto items-center [word-break:auto-phrase] gap-3 mb-6 ">
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
          <div className="mb-20">
            <KakaoShare
              imgUrl={`${process.env.NEXT_PUBLIC_API_HOST}/static/result_${data.resultId}.png`}
              className="flex gap-2 items-center rounded-full bg-[#FAE100] text-[#1E1E1E] hover:bg-[#ddc700]"
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
          </div>
        )}
      </div>

      <div className="w-full sticky bottom-[calc(env(safe-area-inset-bottom)+16px)] px-4">
        <Button
          asChild
          className="rounded-2xl text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold  w-full"
        >
          <Link href="/">처음으로</Link>
        </Button>
      </div>
    </>
  );
};

export default Detail;
