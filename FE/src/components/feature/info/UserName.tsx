import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { InfoForm } from "./Form";
import { useForm } from "react-hook-form";
import { twJoin, twMerge } from "tailwind-merge";

interface Props {
  onNext: (username: string) => void;
}
const UserName = ({ onNext }: Props) => {
  const {
    register,
    formState: { isValid, errors },
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
      <div className="flex flex-col gap-12 px-5">
        <div className="text-2xl">
          사용자 이름을
          <br />
          입력해주세요.
        </div>
        <div className="flex flex-col gap-3">
          <Input
            className={twMerge(
              "!text-xl py-3 rounded-full text-center h-auto rounded-tr-none focus-visible:placeholder:text-transparent",
              twJoin(
                errors.username && "focus-visible:ring-red-500 border-red-950"
              )
            )}
            {...register("username", {
              required: true,
              maxLength: {
                value: 10,
                message: "10자 이하로 입력해주세요.",
              },
            })}
            maxLength={10 + 1}
            placeholder="사용자 이름"
          />
          <span
            className={twMerge(
              "text-sm opacity-0 transition-opacity text-red-500 self-end",
              twJoin(errors.username && "opacity-100")
            )}
          >
            {errors.username?.message}
          </span>
        </div>
      </div>
      <Button
        type="submit"
        disabled={!isValid}
        className="text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold rounded-2xl mb-[env(safe-area-inset-bottom)]"
      >
        다음
      </Button>
    </form>
  );
};

export default UserName;
