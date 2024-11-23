"use client";
import React from "react";
import TextTransition, { presets } from "react-text-transition";
import getRandomPersonality from "@/utils/getRandomPersonality";
import { PERSONALITIES } from "@/lib/constants";
const TEXTS = [
  PERSONALITIES[getRandomPersonality()],
  PERSONALITIES[getRandomPersonality()],
  PERSONALITIES[getRandomPersonality()],
];
const Page = () => {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((index) => {
        if (index === 2) {
          return 2;
        }
        return index + 1;
      });
    }, 500 - index * 100);
    return () => clearTimeout(intervalId);
  }, []);
  return (
    <h1>
      <TextTransition springConfig={presets.stiff}>
        {TEXTS[index]}
      </TextTransition>
    </h1>
  );
};

export default Page;
