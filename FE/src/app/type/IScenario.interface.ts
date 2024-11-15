export interface IScenario {
  userId: string;
  scenarioStep: `${number}`;
  scenarioContent: string;
  scenarioImage: string;
  scenarioId: string;
  scenarios: Omit<IScenario, "scenarios">[];
}
