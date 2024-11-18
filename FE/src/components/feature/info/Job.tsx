import React from "react";
import { Button } from "@/components/ui/button";
import type { InfoForm } from "./Form";
import { useForm, Controller } from "react-hook-form";
import { JOBS } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toSelectOptions } from "@/lib/utils";

interface Props {
  onNext: (job: keyof typeof JOBS) => void;
}
const Job = ({ onNext }: Props) => {
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<Pick<InfoForm, "job">>({
    mode: "all",
  });
  const onSubmit = (data: Pick<InfoForm, "job">) => {
    onNext(data.job);
  };
  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-12">
        <div className="text-2xl">
          직업을
          <br />
          선택해주세요
        </div>
        <Controller
          control={control}
          name="job"
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
              {toSelectOptions(JOBS).map((job) => (
                <ToggleGroupItem
                  key={job.value}
                  value={job.value}
                  className="w-full rounded-full border border-[#D0D0D0] data-[state=on]:border-transparent text-xl py-3 h-auto rounded-tr-none data-[state=on]:bg-gradient-to-bl from-[#FF751D] to-[#FF8A3F]"
                >
                  {job.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
      </div>
      <Button
        type="submit"
        disabled={!isValid}
        className="rounded-2xl text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold"
      >
        다음
      </Button>
    </form>
  );
};

export default Job;
