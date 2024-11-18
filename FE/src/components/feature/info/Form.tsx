"use client";

import React from "react";
import { JOBS, SITUATIONS, GENDER } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";
import { useFunnel } from "@use-funnel/browser";
import UserName from "@/components/feature/info/UserName";
import Gender from "./Gender";
import Job from "@/components/feature/info/Job";
import Situation from "@/components/feature/info/Situation";
import Done from "@/components/feature/info/Done";

type TFormStep = "step1" | "step2" | "step3" | "step4" | "done";

export interface InfoForm {
  username: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  gender: keyof typeof GENDER;
}
const getProgress = (step: TFormStep) => {
  switch (step) {
    case "step1":
      return 0;
    case "step2":
      return 25;
    case "step3":
      return 50;
    case "step4":
      return 75;
    default:
      return 100;
  }
};

export type InfoFormStep<T extends TFormStep> = T extends "step1"
  ? Partial<InfoForm>
  : T extends "step2"
  ? Pick<InfoForm, "username"> & Partial<Omit<InfoForm, "username">>
  : T extends "step3"
  ? Pick<InfoForm, "username" | "gender"> &
      Partial<Omit<InfoForm, "username" | "gender">>
  : T extends "step4"
  ? Pick<InfoForm, "username" | "gender" | "job"> &
      Partial<Omit<InfoForm, "username" | "gender" | "job">>
  : InfoForm;

const Form = () => {
  const funnel = useFunnel<{
    step1: InfoFormStep<"step1">;
    step2: InfoFormStep<"step2">;
    step3: InfoFormStep<"step3">;
    step4: InfoFormStep<"step4">;
    done: InfoFormStep<"done">;
  }>({
    id: "info-form",
    initial: {
      step: "step1",
      context: {},
    },
  });
  return (
    <>
      <Progress
        value={getProgress(funnel.step)}
        className="rounded-none h-[2px]"
      />
      <funnel.Render
        step1={({ history }) => (
          <UserName
            onNext={(username) => history.push("step2", { username })}
          />
        )}
        step2={({ history }) => (
          <Gender onNext={(gender) => history.push("step3", { gender })} />
        )}
        step3={({ history }) => (
          <Job onNext={(job) => history.push("step4", { job: job })} />
        )}
        step4={({ history }) => (
          <Situation
            onNext={(situation) => history.push("done", { situation })}
          />
        )}
        done={({ context }) => <Done context={context} />}
      />
    </>
  );
};

export default Form;
