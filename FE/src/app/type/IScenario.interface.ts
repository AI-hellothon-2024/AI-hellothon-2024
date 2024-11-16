export interface IScenario {
  userId: string;
  scenarioStep: `${number}` | "end";
  scenarioContent: string;
  scenarioImage: string;
  scenarioId: string;
  scenarios: {
    scenarioId: string;
    scenarioContent: string;
    scenarioStep: `${number}`;
    answer: string;
  }[];
}
