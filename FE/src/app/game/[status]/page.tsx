import { SITUATIONS, JOBS, GENDER } from "@/lib/constants";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import LeaveDrawer from "@/components/feature/game/LeaveDrawer";
import Background from "@/components/feature/game/Background";
import Content from "./Content";

export const dynamicParams = false;
export const generateStaticParams = () => {
  return ["ongoing", "finished"];
};

const Page = async ({
  searchParams,
}: // params: { status },
{
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
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Background className="w-full bg-no-repeat bg-cover h-full bg-center grid grid-rows-2 min-h-0 justify-start grid-cols-1">
          <header className="flex items-center sticky top-0 left-0 self-start h-16 bg-dim-70 w-full">
            <LeaveDrawer />
            <h1
              className="absolute left-1/2
            transform -translate-x-1/2 text-white text-lg font-bold
            "
            >
              {SITUATIONS[searchParams.situation]}
            </h1>
          </header>
          <Content {...searchParams} />
        </Background>
      </HydrationBoundary>
    </>
  );
};

export default Page;
