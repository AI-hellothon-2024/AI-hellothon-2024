import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col h-full gap-10">
      <div className="flex-grow flex flex-col gap-8">
        <div className="flex-grow flex-center">hero</div>
        <Button asChild>
          <Link href={"/info"} className="mx-10 bg-gray-200 py-6 text-center">
            플레이
          </Link>
        </Button>
      </div>
      <footer className="flex self-center w-full py-4 justify-center">
        footer
      </footer>
    </div>
  );
}
