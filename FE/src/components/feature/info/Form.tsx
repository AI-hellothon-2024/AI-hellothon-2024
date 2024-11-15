"use client";

import React from "react";
import { JOBS, SITUATIONS } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { useFunnel } from "@use-funnel/browser";
import UserName from "@/components/feature/info/UserName";
import Job from "@/components/feature/info/Job";
import Situation from "@/components/feature/info/Situation";
type TFormStep = "step1" | "step2" | "step3";

export interface InfoForm {
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
}
const getProgress = (step: TFormStep) => {
  switch (step) {
    case "step1":
      return 0;
    case "step2":
      return 33;
    case "step3":
      return 66;
    default:
      return 100;
  }
};

export type InfoFormStep<T extends TFormStep> = T extends "step1"
  ? Partial<InfoForm>
  : T extends "step2"
  ? Pick<InfoForm, "username"> & Partial<Omit<InfoForm, "username">>
  : T extends "step3"
  ? Pick<InfoForm, "username" | "job"> &
      Partial<Omit<InfoForm, "username" | "job">>
  : never;

const Form = () => {
  const funnel = useFunnel<{
    step1: InfoFormStep<"step1">;
    step2: InfoFormStep<"step2">;
    step3: InfoFormStep<"step3">;
  }>({
    id: "info-form",
    initial: {
      step: "step1",
      context: {},
    },
  });
  return (
    <>
      <Progress value={getProgress(funnel.step)} />
      <funnel.Render
        step1={({ history }) => (
          <UserName
            onNext={(username) => history.push("step2", { username })}
          />
        )}
        step2={({ history }) => (
          <Job onNext={(job) => history.push("step3", { job: job })} />
        )}
        step3={({ context }) => <Situation context={context} />}
      />
    </>
  );
};

export default Form;
