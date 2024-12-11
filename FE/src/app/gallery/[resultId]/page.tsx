import Detail from "./Detail";

const Page = ({
  params: { resultId },
}: {
  params: {
    resultId: string;
  };
}) => {
  return (
    <div>
      <Detail resultId={resultId} />
    </div>
  );
};

export default Page;
