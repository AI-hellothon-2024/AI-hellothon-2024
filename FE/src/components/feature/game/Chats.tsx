"use client";

import { ComponentProps, useEffect, useRef } from "react";
import { SITUATIONS, JOBS } from "@/lib/constants";
import { useScenario } from "@/api/useScenario";
import { MotionDiv } from "@/components/motion";
import { useAtom } from "jotai";
import { chatAtom } from "@/app/store/chatAtom";
import Loading from "./Loading";

interface Props extends ComponentProps<"div"> {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
}
const Chats = ({ userId, username, job, situation }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useScenario({ userId, username, job, situation });
  const [chats, setChats] = useAtom(chatAtom);

  useEffect(() => {
    if (data) {
      setChats([
        {
          id: data.scenarioId,
          sender: "bot",
          message: data.scenarioContent,
          scenarioImage: data.scenarioImage,
          loading: false,
        },
      ]);
    }
  }, [data, setChats]);

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
            className="bg-gray-100 text-gray-900 px-6 py-4 rounded w-full"
            initial={{
              opacity: 0,
              y: -10,
            }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
          >
            {chat.loading ? <Loading /> : chat.message}
          </MotionDiv>
        </>
      ))}
    </div>
  );
};

export default Chats;
