"use client";
import { ComponentProps } from "react";
import { useAtomValue } from "jotai";
import { chatAtom } from "@/app/store/chatAtom";
import { MotionDiv } from "@/components/motion";

const Background = ({ className, children }: ComponentProps<"div">) => {
  const data = useAtomValue(chatAtom)
    .filter((chat) => chat.sender === "bot")
    .at(-1);
  return (
    <MotionDiv
      className={className}
      style={{
        backgroundSize: "110%",
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
