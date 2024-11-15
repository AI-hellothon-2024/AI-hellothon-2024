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
const Chats = ({ userId, username, job, situation }: Props) => {
  const { data } = useScenario({ userId, username, job, situation });
  return data?.scenarios.map((scenario) => (
    <MotionDiv
      key={scenario.scenarioId}
      className="bg-gray-100 text-gray-900 px-6 py-4 rounded w-full"
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
    >
      {scenario.scenarioContent}
    </MotionDiv>
  ));
};

export default Chats;
