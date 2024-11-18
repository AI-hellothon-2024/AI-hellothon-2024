import { useMutation } from "@tanstack/react-query";
import type { IScenario } from "@/app/type/IScenario.interface";

const postAnswerScenario = async ({
  userId,
  scenarioIds,
  answer,
  answerScenarioId,
}: {
  userId: string;
  scenarioIds: string[];
  answer: string;
  answerScenarioId: string;
}): Promise<IScenario> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/scenario/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answerScenarioId,
        userId,
        scenarioIds,
        answer,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};

interface IAnswer {
  answer: string;
  answerScenarioId: string;
  scenarioIds: string[];
}
export const useSendAnswer = ({ userId }: { userId: string }) => {
  return useMutation({
    mutationKey: ["answers", { userId }],
    mutationFn: ({ answer, answerScenarioId, scenarioIds }: IAnswer) => {
      if (scenarioIds.length === 0) {
        throw new Error("Failed to fetch");
      }
      return postAnswerScenario({
        userId,
        scenarioIds,
        answer,
        answerScenarioId,
      });
    },

    onError: (error) => {
      console.log("error", error);
    },
  });
};
