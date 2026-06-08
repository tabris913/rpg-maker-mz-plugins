declare const TERS: {
  elementRanks: Array<CustomRank>;
  normalIndex: number;
  maxIndex: number;
  isEnabledAbsorb: boolean;
  isEnabledInstantDeath: boolean;
};

type CustomRank = { key: string; name: string; rate: number };
type AbsorbRank = { rate: number; isEnabled: boolean };
type InstantDeathRank = { name: string; isEnabled: boolean };

declare const isCustomRank: (input: any) => input is CustomRank;

declare namespace TERS {
  type RawParams = {
    ResistRanks: Array<CustomRankInput | string> | string;
    WeakRanks: Array<CustomRankInput | string> | string;
    NormalRankName: string;
    AbsorbRank: AbsorbRankInput | string;
    InstantDeathRank: InstantDeathRankInput | string;
  };

  type CustomRankInput = { key?: string; name?: string; rate?: string };
  type AbsorbRankInput = { rate?: string; isEnabled?: boolean | string };
  type InstantDeathRankInput = {
    name?: string;
    isEnabled?: boolean | string;
  };
}

interface Game_BattlerBase {
  setupElementRank: () => void;
}

interface Game_Battler {
  onAbsorb: (value: number) => void;
  onNullDamage: () => void;
  elementPlus: (elementId: number) => number;
}
