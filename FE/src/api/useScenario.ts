import { useQuery, QueryClient } from "@tanstack/react-query";
import { SITUATIONS, JOBS, GENDER } from "@/lib/constants";
import type { IScenario } from "@/app/type/IScenario.interface";

const getScenario = async ({
  userId,
  username,
  job,
  situation,
  gender,
}: {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
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
      gender,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};
export const useScenario = ({
  userId,
  username,
  job,
  situation,
  gender,
}: // select,
{
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
}) => {
  return useQuery<IScenario>({
    queryKey: ["posts", { userId }],
    queryFn: () => getScenario({ userId, username, job, situation, gender }),
    refetchInterval: 0,
  });
};
export const prefetchScenario = ({
  userId,
  username,
  job,
  situation,
  gender,
  queryClient,
}: {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
  queryClient: QueryClient;
}) => {
  return queryClient.prefetchQuery({
    queryKey: ["posts", { userId }],
    queryFn: () => getScenario({ userId, username, job, situation, gender }),
  });
};
