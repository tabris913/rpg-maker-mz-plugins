declare const TEVS: {
  threshold: number;
  totalMax: number;
  individualMax: number;
  isEnabledTCP: boolean;
};

type ParamsRaw = Record<"Threshold" | "TotalMax" | "IndividualMax", unknown>;

interface BattleManager {
  gainEffortValues: () => void;
}

interface Game_Actor {
  _effortValues: Array<number>;
  _effortValuesCustom: Array<number>;

  initEV: () => void;
  gainEV: (paramKey: string, value: number) => void;
  resetEV: (paramKey: string) => void;
  resetEVs: () => void;
  totalEffortValues: () => number;
}
