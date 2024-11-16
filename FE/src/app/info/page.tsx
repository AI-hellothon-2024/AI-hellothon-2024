import dynamic from "next/dynamic";
const DynamicForm = dynamic(() => import("@/components/feature/info/Form"), {
  ssr: false,
});
const Page = () => {
  return (
    <div className="bg-[rgba(0,0,0,0.9)] flex flex-col gap-16 pt-11 h-full">
      <DynamicForm />
    </div>
  );
};

export default Page;
