import { useQuery } from "@tanstack/react-query";
import type { ICollection } from "@/app/type/ICollection.interface";

const getCollection = async ({
  userId,
}: {
  userId: string;
}): Promise<ICollection> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_HOST}/collection/list`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
      credentials: "omit",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch");
  }

  return res.json();
};
export const useCollection = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["collection", { userId }],
    queryFn: async () => {
      return getCollection({ userId });
    },
    enabled: !!userId,
  });
};
