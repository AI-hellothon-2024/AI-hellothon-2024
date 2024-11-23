"use client";

import { useEffect, useRef, useState } from "react";
import TextTransition, { presets } from "react-text-transition";
import getRandomPersonality from "@/utils/getRandomPersonality";
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
  const [index, setIndex] = useState(0);
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
    const intervalId = setInterval(() => {
      setIndex((index) => {
        if (index === 8) {
          return 8;
        }
        return index + 1;
      });
    }, 200);
    return () => clearTimeout(intervalId);
  }, []);

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
    const TEXTS = [
      PERSONALITIES[getRandomPersonality()],
      PERSONALITIES[getRandomPersonality()],
      PERSONALITIES[getRandomPersonality()],
      PERSONALITIES[getRandomPersonality()],
      PERSONALITIES[getRandomPersonality()],
      PERSONALITIES[getRandomPersonality()],
      PERSONALITIES[getRandomPersonality()],
      PERSONALITIES[getRandomPersonality()],
      PERSONALITIES[personality as keyof typeof PERSONALITIES],
    ];
    return (
      <div className="fixed top-0 left-0 w-dvw h-dvh flex justify-center backdrop-blur text-[#D0D0D0] items-center z-10 text-xl font-semibold">
        <div className="flex flex-col items-center -translate-y-2 gap-11 w-full">
          <Loading />
          <div className="flex flex-col items-center mt-2">
            <div>
              <span className="font-DungGeunMo text-2xl text-[#F8F8F8]">
                {systemName}
              </span>
              님과의
            </div>
            <div className="font-DungGeunMo text-2xl text-[#F8F8F8]">
              {SITUATIONS[situation as keyof typeof SITUATIONS]}
            </div>
            <div>대화를 준비중입니다</div>
          </div>
          <div className="border border-current rounded-full py-3 text-lg mt-7 w-1/2 text-center h-[54px] overflow-y-clip">
            <TextTransition
              springConfig={presets.stiff}
              className="text-center flex-grow justify-center"
            >
              {TEXTS[index]}
            </TextTransition>
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
      {chats.map(({ id, sender, loading, message }) => (
        <MotionDiv
          key={id}
          className={twMerge(
            "px-6 py-4 w-full text-[#F8F8F8] rounded-b-2xl backdrop-blur-sm break-all whitespace-break-spaces flex flex-col gap-1",
            twJoin(
              sender === "bot"
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
          {!loading && sender === "bot" && (
            <span className="text-primary font-DungGeunMo text-xs">
              {systemName}
            </span>
          )}
          {loading ? <ChatLoading /> : message}
        </MotionDiv>
      ))}
    </div>
  );
};

export default Chats;
