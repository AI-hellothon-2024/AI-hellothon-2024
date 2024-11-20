"use client";

import { ComponentProps, useEffect, useRef } from "react";
import { twMerge, twJoin } from "tailwind-merge";
import { SITUATIONS, JOBS, GENDER } from "@/lib/constants";
import { useScenario } from "@/api/useScenario";
import { MotionDiv } from "@/components/motion";
import { useAtom, useSetAtom } from "jotai";
import { chatAtom } from "@/app/store/chatAtom";
import { scenarioAtom } from "@/app/store/scenarioAtom";
import Loading from "./Loading";

interface Props extends ComponentProps<"div"> {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
}
const Chats = ({ userId, username, job, situation, gender }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useScenario({ userId, username, job, situation, gender });
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
    }
  }, [chats]);

  return (
    <div
      className="flex flex-col overflow-y-auto gap-2 scroll-smooth"
      ref={containerRef}
    >
      {chats.map((chat) => (
        <>
          <MotionDiv
            key={chat.id}
            className={twMerge(
              "p-6 w-full text-[#F8F8F8] rounded-b-2xl backdrop-blur-sm break-all",
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
            {chat.loading ? <Loading /> : chat.message}
          </MotionDiv>
        </>
      ))}
    </div>
  );
};

export default Chats;
