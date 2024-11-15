import React from "react";
import { Button } from "@/components/ui/button";
import type { InfoForm, InfoFormStep } from "./Form";
import { useForm, Controller } from "react-hook-form";
import { SITUATIONS } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toSelectOptions } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
  context: InfoFormStep<"step2">;
}
const Situation = ({ context }: Props) => {
  const router = useRouter();
  const {
    control,
    formState: { isValid },
    handleSubmit,
  } = useForm<Pick<InfoForm, "situation">>({
    mode: "all",
  });
  const onSubmit = (data: Pick<InfoForm, "situation">) => {
    console.log("data", {
      ...data,
      ...context,
    });
    router.push("/game");
  };
  return (
    <form
      className="flex flex-col justify-between h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <div>직업을 선택해주세요</div>
        <Controller
          control={control}
          name="situation"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <ToggleGroup
              type="single"
              className="flex-col"
              value={value}
              onValueChange={(value) => {
                onChange(value);
              }}
            >
              {toSelectOptions(SITUATIONS).map(({ value, name }) => (
                <ToggleGroupItem
                  key={value}
                  value={value}
                  className="w-full rounded-full border"
                >
                  {name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
      </div>
      <Button type="submit" disabled={!isValid} className="rounded-full">
        다음
      </Button>
    </form>
  );
};

export default Situation;
