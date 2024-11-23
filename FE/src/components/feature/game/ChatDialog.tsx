import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { chatAtom } from "@/app/store/chatAtom";
import { useAtomValue } from "jotai";
import { X } from "lucide-react";
import { twMerge, twJoin } from "tailwind-merge";
import ChatLoading from "./ChatLoading";

const ChatDialog = () => {
  const chats = useAtomValue(chatAtom);
  return (
    <Dialog>
      <DialogTrigger className="ml-auto underline text-[#FF8C42]">
        전체보기
      </DialogTrigger>
      <DialogContent className="h-dvh overflow-y-auto max-w-[600px] border-0 p-0 flex flex-col">
        <DialogTitle className="sr-only">채팅 전체보기</DialogTitle>
        <div className="flex flex-col gap-2 p-6 flex-grow">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={twMerge(
                "px-6 py-4 w-full text-[#F8F8F8] rounded-b-2xl backdrop-blur-sm break-all whitespace-break-spaces flex flex-col gap-1",
                twJoin(
                  chat.sender === "bot"
                    ? "bg-[rgba(0,0,0,0.8)] rounded-tr-2xl"
                    : "bg-[rgba(31,31,31,0.7)] rounded-tl-2xl border border-primary box-border"
                )
              )}
            >
              {chat.loading ? <ChatLoading /> : chat.message}
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 pb-[62px] w-full backdrop-blur-xl flex justify-center h-[120px] items-end">
          <DialogClose>
            <X size={28} color="#FF8C42" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
