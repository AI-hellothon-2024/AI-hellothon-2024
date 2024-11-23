import { PERSONALITIES } from "@/lib/constants";

const getRandomPersonality = () => {
  const personalities = Object.keys(PERSONALITIES);
  return personalities[
    Math.floor(Math.random() * personalities.length)
  ] as keyof typeof PERSONALITIES;
};

export default getRandomPersonality;
