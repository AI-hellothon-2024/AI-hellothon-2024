import { atom } from "jotai";

type Chat = IBotChat | IUserChat;

interface IBotChat extends CommonChat {
  sender: "bot";
  scenarioImage: string;
}
interface IUserChat extends CommonChat {
  sender: "user";
}
interface CommonChat {
  id: string;
  message: string;
  loading: boolean;
}
export const chatAtom = atom<Chat[]>([]);
