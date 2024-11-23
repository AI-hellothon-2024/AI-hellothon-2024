import type { IScenario } from "./IScenario.interface";

export interface IResult {
  resultId: string;
  userId: string;
  oneLineResult: string;
  flowEvaluation: string;
  flowExplanation: string;
  responseTendency: string;
  goalAchievement: string;
  scenarios: IScenario["scenarios"];
  resultImage: string;
}
