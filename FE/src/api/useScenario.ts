import { useQuery } from "@tanstack/react-query";
import { SITUATIONS, JOBS, GENDER } from "@/lib/constants";
import type { IScenario } from "@/app/type/IScenario.interface";

const getScenario = async ({
  userId,
  username,
  job,
  situation,
  gender,
  systemName,
  personality,
}: {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
  systemName: string;
  personality: string;
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
      systemName,
      personality,
    }),
    credentials: "omit",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch !");
  }

  return res.json();
};
export const useScenario = ({
  userId,
  username,
  job,
  situation,
  gender,
  systemName,
  personality,
}: // select,
{
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
  systemName: string;
  personality: string;
}) => {
  return useQuery<IScenario>({
    queryKey: ["scenario", { userId }],
    queryFn: () =>
      getScenario({
        userId,
        username,
        job,
        situation,
        gender,
        systemName,
        personality,
      }),
    refetchInterval: 0,
  });
};
