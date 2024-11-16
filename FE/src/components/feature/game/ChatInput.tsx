"use client";

import { ComponentProps } from "react";
import { useSendAnswer } from "@/api/useSendAnswer";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { chatAtom } from "@/app/store/chatAtom";

interface Props extends ComponentProps<"div"> {
  userId: string;
}

const ChatInput = ({ userId }: Props) => {
  const [chats, setChats] = useAtom(chatAtom);
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
          reset();
          const lastChat = data.scenarios[data.scenarios.length - 1];
          setTimeout(() => {
            setChats((prev) => [
              ...prev,
              {
                id: data.scenarioId,
                sender: "user",
                message: lastChat.scenarioContent,
                loading: true,
              },
            ]);
          }, 1000);

          // 3초 뒤  같은 데이터의 로딩 false로 변경 (위에서 추가한 것)
          setTimeout(() => {
            setChats((prev) =>
              prev.map((chat) =>
                chat.id === data.scenarioId ? { ...chat, loading: false } : chat
              )
            );
          }, 3000);
        },
      }
    );
  };
  return (
    <form
      className="flex justify-between gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register("answer", {
          required: true,
        })}
        placeholder="답변을 입력해주세요."
      />
      <Button type="submit" disabled={!isValid || isPending}>
        전송
      </Button>
    </form>
  );
};

export default ChatInput;
