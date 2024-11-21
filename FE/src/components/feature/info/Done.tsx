import React from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { SITUATIONS, GENDER, JOBS } from "@/lib/constants";
import { userIdAtom } from "@/app/store/userAtom";
import { Button } from "@/components/ui/button";
import type { InfoForm } from "./Form";

interface Props {
  context: InfoForm;
}

const Done = ({ context }: Props) => {
  const setUserId = useSetAtom(userIdAtom);
  const router = useRouter();

  const handleStartGame = () => {
    const userId = window.crypto.randomUUID();
    setUserId(userId);
    const qs = new URLSearchParams({
      ...context,
      userId,
    });
    router.push(`/game/ongoing?${qs}`);
  };
  return (
    <div className="flex justify-between flex-col h-full">
      <div className="flex flex-col gap-14 items-center px-5">
        <div className="text-2xl">{SITUATIONS[context.situation]}</div>
        <div className="flex flex-col gap-4 w-full">
          {[
            {
              key: "이름",
              value: context.username,
            },
            {
              key: "성별",
              value: GENDER[context.gender],
            },
            {
              key: "직업",
              value: JOBS[context.job],
            },
          ].map(({ key, value }, index) => (
            <div
              key={index}
              className="text-xl flex justify-between px-5 py-4 border border-[#D0D0D0] rounded-full"
            >
              <span>{key}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={handleStartGame}
        className="rounded-2xl text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold mb-[env(safe-area-inset-bottom)]"
      >
        시작하기
      </Button>
    </div>
  );
};

export default Done;
