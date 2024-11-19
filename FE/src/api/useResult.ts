"use client";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { resultAtom } from "@/app/store/resultAtom";
import type { IResult } from "@/app/type/IResult.interface";

const getResult = async ({
  userId,
  scenarioIds,
}: {
  userId: string;
  scenarioIds: string[];
}): Promise<IResult> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/scenario/result`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, scenarioIds }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};

export const useResult = ({
  userId,
  scenarioIds,
}: {
  userId: string;
  scenarioIds: string[];
}) => {
  const setResults = useSetAtom(resultAtom);
  setResults((prev) => {
    return [...prev, { userId, scenarioIds }];
  });
  return useQuery({
    queryKey: ["result", { userId, scenarioIds }],
    queryFn: () => getResult({ userId, scenarioIds }),
    enabled: scenarioIds.length > 0,
  });
};
