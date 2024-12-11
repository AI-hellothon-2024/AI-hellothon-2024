import { SITUATIONS, JOBS, PERSONALITIES } from "@/lib/constants";
export interface ICollection {
  userId: string;
  result: {
    resultId: string;
    flowEvaluation: string;
    resultImage: string;
    job: keyof typeof JOBS;
    situation: keyof typeof SITUATIONS;
    systemName: string;
    personality: keyof typeof PERSONALITIES;
  }[];
}
