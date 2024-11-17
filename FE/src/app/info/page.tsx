import dynamic from "next/dynamic";
const DynamicForm = dynamic(() => import("@/components/feature/info/Form"), {
  ssr: false,
});
const Page = () => {
  return (
    <>
      <DynamicForm />
    </>
  );
};

export default Page;
