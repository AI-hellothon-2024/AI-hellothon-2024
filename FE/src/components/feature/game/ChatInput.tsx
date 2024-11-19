"use client";

import { ComponentProps } from "react";
import { useSendAnswer } from "@/api/useSendAnswer";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { SITUATIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { chatAtom } from "@/app/store/chatAtom";
import Link from "next/link";

interface Props extends ComponentProps<"div"> {
  userId: string;
  situation: keyof typeof SITUATIONS;
}

const ChatInput = ({ userId, situation }: Props) => {
  const [chats, setChats] = useAtom(chatAtom);
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
        <Link href={`/result/${situation}`}>결과보기</Link>
      </Button>
    );
  }
  return (
    <form
      className="flex justify-between gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register("answer", {
          required: true,
        })}
        disabled={isPending}
        placeholder="답변을 입력해주세요."
        className="backdrop-blur-sm rounded-full rounded-tr-none bg-[rgba(31,31,31,0.7)] py-3 h-auto px-5"
      />
      <Button type="submit" disabled={!isValid || isPending} className="hidden">
        전송
      </Button>
    </form>
  );
};

export default ChatInput;
