"use client";
import { useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import { SITUATIONS, JOBS, GENDER } from "@/lib/constants";
import Chats from "@/components/feature/game/Chats";
import ChatInput from "@/components/feature/game/ChatInput";
import getRandomSystemName from "@/utils/getRandomSystemName";
import getRandomPersonality from "@/utils/getRandomPersonality";

interface Props {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
}

const Content = ({ ...props }: Props) => {
  const [systemName] = useState(getRandomSystemName(props.situation));
  const [personality] = useState(getRandomPersonality());
  const [viewMode, setViewMode] = useState<"chat" | "all">("chat");
  const [hasScroll, setHasScroll] = useState(false);
  return (
    <div
      className={twMerge(
        "row-start-2 px-4 flex py-8 flex-col justify-end gap-8 max-h-full min-h-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.74)] w-full relative",
        twJoin(
          viewMode === "all" &&
            "h-[calc(100dvh-64px)] overflow-y-auto row-span-2 "
        )
      )}
    >
      <Chats
        {...props}
        setHasScroll={setHasScroll}
        systemName={systemName}
        personality={personality}
      />
      {viewMode === "chat" && (
        <ChatInput
          {...props}
          systemName={systemName}
          personality={personality}
        />
      )}
    </div>
  );
};

export default Content;
