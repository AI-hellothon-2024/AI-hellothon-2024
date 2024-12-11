import type { IScenario } from "./IScenario.interface";
import { SITUATIONS, PERSONALITIES, JOBS } from "@/lib/constants";
export interface IResult {
  resultId: string;
  job: keyof typeof JOBS;
  situation: keyof typeof SITUATIONS;
  userName: string;
  gender: string;
  systemName: string;
  personality: keyof typeof PERSONALITIES;
  userId: string;
  oneLineResult: string;
  flowEvaluation: string;
  flowExplanation: string;
  responseTendency: string;
  goalAchievement: string;
  scenarios: IScenario["scenarios"];
  resultImage: string;
}
