import { useQuery } from "@tanstack/react-query";
import type { IResult } from "@/app/type/IResult.interface";

const getCollectionDetails = async ({
  userId,
  resultId,
}: {
  userId: string;
  resultId: string;
}): Promise<IResult> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/collection/detail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, resultId }),
      credentials: "omit",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};
export const useCollectionDetail = ({
  userId,
  resultId,
}: {
  userId: string;
  resultId: string;
}) => {
  return useQuery({
    queryKey: ["collection", { userId, resultId }],
    queryFn: async () => {
      return getCollectionDetails({ userId, resultId });
    },
    enabled: !!userId,
  });
};
