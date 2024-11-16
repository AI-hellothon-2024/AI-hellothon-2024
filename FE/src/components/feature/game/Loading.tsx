import React from "react";
import { MotionCircle } from "@/components/motion";

const Loading = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <MotionCircle
        cx="12"
        cy="12"
        r="1"
        animate={{ y: [2, 0, 2, 0, 2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <MotionCircle
        cx="19"
        cy="12"
        r="1"
        animate={{ y: [2, 0, 2, 0, 2] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />
      <MotionCircle
        cx="5"
        cy="12"
        r="1"
        animate={{ y: [2, 0, 2, 0, 2] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
      />
    </svg>
  );
};

export default Loading;
