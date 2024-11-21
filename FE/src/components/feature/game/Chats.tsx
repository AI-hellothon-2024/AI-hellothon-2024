"use client";

import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction, ComponentProps } from "react";
import { twMerge, twJoin } from "tailwind-merge";
import { SITUATIONS, JOBS, GENDER, PERSONALITIES } from "@/lib/constants";
import { useScenario } from "@/api/useScenario";
import { MotionDiv } from "@/components/motion";
import { useAtom, useSetAtom } from "jotai";
import { chatAtom } from "@/app/store/chatAtom";
import { scenarioAtom } from "@/app/store/scenarioAtom";
import ChatLoading from "./ChatLoading";
import Loading from "@/components/common/Loading";

interface Props extends ComponentProps<"div"> {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
  setHasScroll: Dispatch<SetStateAction<boolean>>;
  systemName: string;
  personality: string;
}
const Chats = ({
  userId,
  username,
  job,
  situation,
  gender,
  setHasScroll,
  systemName,
  personality,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useScenario({
    userId,
    username,
    job,
    situation,
    gender,
    systemName,
    personality,
  });
  const [chats, setChats] = useAtom(chatAtom);
  const setScenario = useSetAtom(scenarioAtom);

  useEffect(() => {
    if (data) {
      setScenario([data.scenarioId]);
      setChats([
        {
          id: data.scenarioId,
          sender: "bot",
          message: data.scenarioContent,
          scenarioImage: data.scenarioImage,
          loading: false,
          scenarioStep: data.scenarioStep,
        },
      ]);
    }
  }, [data, setChats, setScenario]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setHasScroll(scrollTop + clientHeight < scrollHeight);
    }
  }, [chats, setHasScroll]);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-dvw h-dvh flex justify-center backdrop-blur text-[#F8F8F8] items-center z-10 text-2xl font-semibold">
        <div className="flex flex-col items-center gap-14 -translate-y-2">
          <Loading />
          <div className="flex flex-col items-center mt-2">
            <div>{systemName}님과의</div>
            <div>{SITUATIONS[situation as keyof typeof SITUATIONS]}</div>
            <div>대화를 로딩중입니다</div>
          </div>

          <div className="border border-current rounded-full px-[60px] py-3 text-lg">
            {PERSONALITIES[personality as keyof typeof PERSONALITIES]}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className="flex flex-col overflow-y-auto gap-2 scroll-smooth"
      ref={containerRef}
    >
      {chats.map((chat) => (
        <MotionDiv
          key={chat.id}
          className={twMerge(
            "p-6 w-full text-[#F8F8F8] rounded-b-2xl backdrop-blur-sm break-all whitespace-break-spaces",
            twJoin(
              chat.sender === "bot"
                ? "bg-[rgba(0,0,0,0.8)] rounded-tr-2xl"
                : "bg-[rgba(31,31,31,0.7)] rounded-tl-2xl border border-primary box-border"
            )
          )}
          initial={{
            opacity: 0,
            y: -10,
          }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          viewport={{
            once: true,
          }}
        >
          {chat.loading ? <ChatLoading /> : chat.message}
        </MotionDiv>
      ))}
    </div>
  );
};

export default Chats;
