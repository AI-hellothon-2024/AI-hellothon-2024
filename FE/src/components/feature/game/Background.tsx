"use client";
import { ComponentProps } from "react";
import { SITUATIONS, JOBS } from "@/lib/constants";
import { useAtomValue } from "jotai";
import { chatAtom } from "@/app/store/chatAtom";
import { MotionDiv } from "@/components/motion";

interface Props extends ComponentProps<"div"> {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
}
const Background = ({ className, children }: Props) => {
  const data = useAtomValue(chatAtom)
    .filter((chat) => chat.sender === "bot")
    .at(-1);
  return (
    <MotionDiv
      className={className}
      style={{
        backgroundImage: data
          ? `url('data:image/png;base64,${data?.scenarioImage}')`
          : undefined,
      }}
    >
      {children}
    </MotionDiv>
  );
};

export default Background;
