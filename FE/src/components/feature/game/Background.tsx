"use client";
import { ComponentProps } from "react";
import { SITUATIONS, JOBS } from "@/lib/constants";
import { useScenario } from "@/api/useScenario";
import { MotionDiv } from "@/components/motion";

interface Props extends ComponentProps<"div"> {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
}
const Background = ({
  className,
  userId,
  username,
  job,
  situation,
  children,
}: Props) => {
  const { data } = useScenario({
    userId,
    username,
    job,
    situation,
  });
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
