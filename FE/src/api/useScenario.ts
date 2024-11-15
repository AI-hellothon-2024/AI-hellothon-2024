import { useQuery, QueryClient } from "@tanstack/react-query";
import { SITUATIONS, JOBS } from "@/lib/constants";
import type { IScenario } from "@/app/type/IScenario.interface";

const getScenario = async ({
  userId,
  username,
  job,
  situation,
}: {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
}): Promise<IScenario> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/scenario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      userName: username,
      job,
      situation,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }
  const json = await res.json();

  return {
    userId: json.userId,
    scenarioStep: json.scenarioStep,
    scenarioContent: json.scenarioContent,
    scenarioImage: json.scenarioImage,
    scenarioId: json.scenarioId,
    scenarios: [
      {
        userId: json.userId,
        scenarioStep: json.scenarioStep,
        scenarioContent: json.scenarioContent,
        scenarioImage: json.scenarioImage,
        scenarioId: json.scenarioId,
      },
    ],
  };
};
export const useScenario = ({
  userId,
  username,
  job,
  situation,
}: // select,
{
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  // select?: (data: IScenario[]) => IScenario[];
}) => {
  return useQuery<IScenario>({
    queryKey: ["posts", { userId }],
    queryFn: () => getScenario({ userId, username, job, situation }),
    // select,
  });
};
export const prefetchScenario = ({
  userId,
  username,
  job,
  situation,
  queryClient,
}: {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  queryClient: QueryClient;
}) => {
  return queryClient.prefetchQuery({
    queryKey: ["posts", { userId }],
    queryFn: () => getScenario({ userId, username, job, situation }),
  });
};
