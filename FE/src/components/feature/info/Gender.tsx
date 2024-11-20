import React from "react";
import { Button } from "@/components/ui/button";
import type { InfoForm } from "./Form";
import { useForm, Controller } from "react-hook-form";
import { GENDER } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toSelectOptions } from "@/lib/utils";

interface Props {
  onNext: (job: keyof typeof GENDER) => void;
}
const Gender = ({ onNext }: Props) => {
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<Pick<InfoForm, "gender">>({
    mode: "all",
  });
  const onSubmit = (data: Pick<InfoForm, "gender">) => {
    onNext(data.gender);
  };
  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-12">
        <div className="text-2xl">
          성별을
          <br />
          선택해주세요
        </div>
        <Controller
          control={control}
          name="gender"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <ToggleGroup
              type="single"
              className="flex-col gap-2.5"
              value={value}
              onValueChange={(value) => {
                onChange(value);
              }}
            >
              {toSelectOptions(GENDER).map((gender) => (
                <ToggleGroupItem
                  key={gender.value}
                  value={gender.value}
                  className="w-full rounded-full border border-[#D0D0D0] data-[state=on]:border-transparent text-xl py-3 h-auto rounded-tr-none data-[state=on]:bg-gradient-to-bl from-[#FF751D] to-[#FF8A3F]"
                >
                  {gender.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
      </div>
      <Button
        type="submit"
        disabled={!isValid}
        className="rounded-2xl text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold mb-[env(safe-area-inset-bottom)]"
      >
        다음
      </Button>
    </form>
  );
};

export default Gender;
