import { SITUATIONS } from "@/lib/constants";

const getRandomSystemName = (situation: keyof typeof SITUATIONS) => {
  const lastNames = ["김", "이", "박", "정", "류", "홍"];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];
  switch (situation) {
    case "love":
      return `${randomLastName}팀장`;
    case "codeReview":
      return `${randomLastName}사원`;
    case "bubbles":
      return `${randomLastName}대리`;
    case "nastyClient":
      return `${randomLastName}대리`;
    case "passWork":
      return `${randomLastName}주임`;
    default:
      return `${randomLastName}과장`;
  }
};

export default getRandomSystemName;
