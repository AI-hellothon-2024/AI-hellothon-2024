import React from "react";
import { SITUATIONS, JOBS, GAME_STEPS } from "@/lib/constants";
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
  return Object.keys(GAME_STEPS).map((step) => ({ step }));
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
}: {
  searchParams: {
    userId: string;
    username: string;
    job: keyof typeof JOBS;
    situation: keyof typeof SITUATIONS;
  };
}) => {
  const queryClient = new QueryClient();
  await prefetchScenario({ ...searchParams, queryClient });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <header className="flex items-center">
          <LeaveDrawer />
          <h1>{situationMapper[searchParams.situation]}</h1>
        </header>
        <Background
          className="w-full bg-no-repeat bg-cover h-full bg-center grid grid-rows-2 flex-grow-0 min-h-0"
          {...searchParams}
        >
          <div className="row-start-2 px-10 flex py-8 flex-col justify-end gap-8 max-h-full min-h-0">
            <Chats {...searchParams} />
            <ChatInput userId={searchParams.userId} />
          </div>
        </Background>
      </HydrationBoundary>
    </>
  );
};

export default Page;
