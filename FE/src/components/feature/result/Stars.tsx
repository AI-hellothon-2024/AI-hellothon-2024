import { MotionDiv } from "@/components/motion";
import React from "react";
import type { HTMLMotionProps, Variants } from "framer-motion";

const Star = (props: HTMLMotionProps<"div">) => {
  return (
    <MotionDiv {...props}>
      <svg
        width="40"
        height="37"
        viewBox="0 0 40 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 30.8575L29.3375 36.505C31.0475 37.54 33.14 36.01 32.69 34.075L30.215 23.455L38.4725 16.3C39.98 14.995 39.17 12.52 37.19 12.3625L26.3225 11.44L22.07 1.40496C21.305 -0.417539 18.695 -0.417539 17.93 1.40496L13.6775 11.4175L2.81 12.34C0.829996 12.4975 0.0199955 14.9725 1.5275 16.2775L9.785 23.4325L7.31 34.0525C6.86 35.9875 8.95249 37.5175 10.6625 36.4825L20 30.8575Z"
          fill="white"
        />
      </svg>
    </MotionDiv>
  );
};
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.4,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};
const Stars = ({ flowEvaluation }: { flowEvaluation: string }) => {
  switch (flowEvaluation) {
    case "bad":
      return (
        <MotionDiv
          className="flex gap-2"
          variants={container}
          initial="hidden"
          whileInView="show"
        >
          <Star variants={item} />
        </MotionDiv>
      );
    case "normal":
      return (
        <MotionDiv
          className="flex gap-2"
          variants={container}
          initial="hidden"
          whileInView="show"
        >
          <Star variants={item} />
          <Star variants={item} />
        </MotionDiv>
      );
    case "good":
      return (
        <MotionDiv
          className="flex gap-2"
          variants={container}
          initial="hidden"
          whileInView="show"
        >
          <Star variants={item} />
          <Star variants={item} />
          <Star variants={item} />
        </MotionDiv>
      );
    default:
      return null;
  }
};

export default Stars;
