"use client";

import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { useCollection } from "@/api/useCollection";
import Link from "next/link";

const Gallery = () => {
  const userId = useAtomValue(userIdAtom);
  const { data, isLoading } = useCollection({ userId });
  return (
    <div className="flex flex-col">
      <p>Gallery</p>
      <div className="grid grid-cols-3 gap-2">
        {data?.result.map((result) => (
          <Link
            key={result.resultId}
            href={`/gallery/${result.resultId}`}
            className="aspect-square"
          >
            <img
              src={`data:image/png;base64,${result.resultImage}`}
              className="aspect-square"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
