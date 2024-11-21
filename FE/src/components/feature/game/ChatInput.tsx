"use client";

import { ComponentProps } from "react";
import { useSendAnswer } from "@/api/useSendAnswer";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SITUATIONS, JOBS, GENDER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { useScenario } from "@/api/useScenario";
import { chatAtom } from "@/app/store/chatAtom";
import Link from "next/link";
import SendButton from "./SendButton";

interface Props extends ComponentProps<"div"> {
  userId: string;
  username: string;
  job: keyof typeof JOBS;
  gender: keyof typeof GENDER;
  situation: keyof typeof SITUATIONS;
  disabled?: boolean;
  systemName: string;
  personality: string;
}

const ChatInput = ({
  userId,
  situation,
  username,
  job,
  gender,
  systemName,
  personality,
}: Props) => {
  const [chats, setChats] = useAtom(chatAtom);
  const { isLoading } = useScenario({
    userId,
    username,
    job,
    situation,
    gender,
    systemName,
    personality,
  });
  const lastChat = chats.filter((chat) => chat.sender === "bot").at(-1);
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<{
    answer: string;
  }>({
    mode: "all",
  });

  const { mutate: sendAnswer, isPending } = useSendAnswer({
    userId,
  });

  const onSubmit = (data: { answer: string }) => {
    setChats((prev) => [
      ...prev,
      {
        id: chats[chats.length - 1].id + "answer",
        sender: "user",
        message: data.answer,
        loading: false,
      },
    ]);
    reset();
    setTimeout(() => {
      setChats((prev) => [
        ...prev,
        {
          id: "loading",
          sender: "bot",
          message: "잠시만 기다려주세요...",
          loading: true,
          scenarioImage: "",
          scenarioStep: "1",
        },
      ]);
    }, 2000);
    sendAnswer(
      {
        ...data,
        answerScenarioId: chats[chats.length - 1].id,
        scenarioIds: chats
          .filter((chat) => chat.sender === "bot")
          .map((chat) => chat.id),
      },
      {
        onSuccess(data) {
          setChats((prev) => [
            ...prev.filter((chat) => !chat.loading),
            {
              id: data.scenarioId,
              sender: "bot",
              message: data.scenarioContent,
              loading: false,
              scenarioImage: data.scenarioImage,
              scenarioStep: data.scenarioStep,
            },
          ]);
        },
      }
    );
  };
  if (lastChat?.scenarioStep === "end") {
    return (
      <Button
        className="rounded text-xl py-3 h-auto disabled:opacity-100 disabled:bg-[#737373] text-white font-semibold"
        asChild
      >
        <Link
          href={`/result/${situation}?systemName=${systemName}&personality=${personality}`}
        >
          결과보기
        </Link>
      </Button>
    );
  }
  return (
    <form
      className="flex justify-between gap-2 relative mb-[env(safe-area-inset-bottom)]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register("answer", {
          required: true,
        })}
        disabled={isPending || isLoading}
        placeholder="답변을 입력해주세요."
        className="backdrop-blur-sm rounded-full rounded-tr-none bg-[rgba(31,31,31,0.7)] py-3 h-auto px-5 pr-14 disabled:cursor-not-allowed"
      />

      <SendButton
        type="submit"
        disabled={!isValid || isPending}
        className="absolute right-0 h-full disabled:opacity-50 disabled:cursor-not-allowed bottom-0"
      />
    </form>
  );
};

export default ChatInput;
