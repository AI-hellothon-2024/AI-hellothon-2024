import React from "react";
import { Button } from "@/components/ui/button";
import type { InfoForm, InfoFormStep } from "./Form";
import { useForm, Controller } from "react-hook-form";
import { JOBS, SITUATIONS } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toSelectOptions } from "@/lib/utils";

interface Props {
  context: InfoFormStep<"step4">;
  onNext: (job: keyof typeof SITUATIONS) => void;
}
const situationMapper: {
  [key in keyof typeof JOBS]: (keyof typeof SITUATIONS)[];
} = {
  developer: ["codeReview", "love", "passWork"],
  designer: ["nastyClient", "love", "passWork"],
  productManager: ["bubbles", "love", "passWork"],
};

const Situation = ({ onNext, context }: Props) => {
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<Pick<InfoForm, "situation">>({
    mode: "all",
  });
  const onSubmit = (data: Pick<InfoForm, "situation">) => {
    onNext(data.situation);
  };
  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-12 px-5">
        <div className="text-2xl">
          필요한 상황을
          <br />
          선택해주세요
        </div>
        <Controller
          control={control}
          name="situation"
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
              {toSelectOptions(SITUATIONS).map(({ value, name }) => {
                if (!situationMapper[context.job].includes(value)) {
                  return null;
                }

                return (
                  <ToggleGroupItem
                    key={value}
                    value={value}
                    className="w-full rounded-full border border-[#D0D0D0] data-[state=on]:border-transparent text-xl py-3 h-auto rounded-tr-none data-[state=on]:bg-gradient-to-bl from-[#FF751D] to-[#FF8A3F]"
                  >
                    {name}
                  </ToggleGroupItem>
                );
              })}
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

export default Situation;
