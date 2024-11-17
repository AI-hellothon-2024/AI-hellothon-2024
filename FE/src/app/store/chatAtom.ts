import { atom } from "jotai";
import { IScenario } from "../type/IScenario.interface";

type Chat = IBotChat | IUserChat;

interface IBotChat extends CommonChat {
  sender: "bot";
  scenarioImage: string;
  scenarioStep: IScenario["scenarioStep"];
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
