import React from "react";
import { SITUATIONS, JOBS, GENDER } from "@/lib/constants";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { prefetchScenario } from "@/api/useScenario";
import LeaveDrawer from "@/components/feature/game/LeaveDrawer";
import Background from "@/components/feature/game/Background";
import Chats from "@/components/feature/game/Chats";
import ChatInput from "@/components/feature/game/ChatInput";

export const dynamicParams = false;
export const generateStaticParams = () => {
  return ["ongoing", "finished"];
};
const situationMapper: {
  [key in keyof typeof SITUATIONS]: string;
} = {
  love: "상사가 고백할 때",
  daily: "상사가 고백할 때",
  angry: "상사가 고백할 때",
};
const Page = async ({
  searchParams,
  params: { status },
}: {
  params: {
    status: "ongoing" | "finished";
  };
  searchParams: {
    userId: string;
    username: string;
    job: keyof typeof JOBS;
    situation: keyof typeof SITUATIONS;
    gender: keyof typeof GENDER;
  };
}) => {
  const queryClient = new QueryClient();
  if (status === "ongoing") {
    await prefetchScenario({ ...searchParams, queryClient });
  }
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Background className="w-full bg-no-repeat bg-cover h-full bg-center grid grid-rows-2 flex-grow-0 min-h-0 justify-start">
          <header className="flex items-center sticky top-0 left-0 self-start h-16 bg-dim-70">
            <LeaveDrawer />
            <h1
              className="absolute left-1/2
            transform -translate-x-1/2 text-white text-lg font-bold
            "
            >
              {situationMapper[searchParams.situation]}
            </h1>
          </header>
          <div className="row-start-2 px-4 flex py-8 flex-col justify-end gap-8 max-h-full min-h-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.74)]">
            <Chats {...searchParams} />
            <ChatInput userId={searchParams.userId} />
          </div>
        </Background>
      </HydrationBoundary>
    </>
  );
};

export default Page;
