"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/app/store/userAtom";
import { useCollection } from "@/api/useCollection";

const GalleryButton = () => {
  const userId = useAtomValue(userIdAtom);
  const { data } = useCollection({ userId });

  return (
    <Button
      asChild
      variant={"outline"}
      disabled={!data || data?.result.length === 0}
      className="rounded-full rounded-tr-none text-xl font-medium h-auto py-3 text-white bg-transparent border-current disabled:opacity-40"
    >
      <Link href={"/gallery"}>갤러리</Link>
    </Button>
  );
};

export default GalleryButton;
