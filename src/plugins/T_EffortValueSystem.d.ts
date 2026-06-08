declare const TEVS: {
  threshold: number;
  totalMax: number;
  individualMax: number;
  isEnabledTCP: boolean;
};

type ParamsRaw = Record<"Threshold" | "TotalMax" | "IndividualMax", unknown>;

interface BattleManager {
  static gainEffortValues: () => void;
}

interface Game_Actor {
  _effortValues: Array<number>;
  _effortValuesCustom: Array<number>;

  initEV: () => void;
  gainEV: (type: string, paramId: number, value: number) => void;
  resetEV: (type: string, paramId: number) => void;
  resetEVs: () => void;
  totalEffortValues: () => number;
}
