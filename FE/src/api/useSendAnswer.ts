import { useQuery, QueryClient, useMutation } from "@tanstack/react-query";
import { SITUATIONS, JOBS } from "@/lib/constants";
import type { IScenario } from "@/app/type/IScenario.interface";

const postAnswerScenario = async ({
  userId,
  senarioId,
  answer,
}: {
  userId: string;
  senarioId: string;
  answer: string;
}): Promise<IScenario> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/scenario/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        senarioId,
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
}
export const useSendAnswer = ({
  userId,
  senarioId,
}: {
  userId: string;
  senarioId: string;
}) => {
  return useMutation({
    mutationKey: ["posts", { userId }],
    mutationFn: ({ answer }: IAnswer) =>
      postAnswerScenario({ userId, senarioId, answer }),
    onError: (error) => {
      console.log("error", error);
    },
  });
};
