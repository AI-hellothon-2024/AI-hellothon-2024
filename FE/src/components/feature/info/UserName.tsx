import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { InfoForm } from "./Form";
import { useForm } from "react-hook-form";

interface Props {
  onNext: (username: string) => void;
}
const UserName = ({ onNext }: Props) => {
  const {
    register,
    formState: { isValid },
    handleSubmit,
  } = useForm<Pick<InfoForm, "username">>({
    mode: "all",
  });
  const onSubmit = (data: Pick<InfoForm, "username">) => {
    onNext(data.username);
  };

  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-12">
        <div className="text-2xl">
          사용자 이름을
          <br />
          입력해주세요.
        </div>
        <Input
          className="!text-xl py-3 rounded-full text-center h-auto rounded-tr-none focus-visible:placeholder:text-transparent"
          {...register("username", {
            required: true,
          })}
          placeholder="사용자 이름"
        />
      </div>
      <Button
        type="submit"
        disabled={!isValid}
        className="text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold rounded-2xl"
      >
        다음
      </Button>
    </form>
  );
};

export default UserName;
