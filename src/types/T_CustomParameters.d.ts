declare const TCP: {
  paramsDef: Array<TCP.ParamsDef>;
  buffRate: number;
  paramMemo: Record<number, Record<string, Record<number, number>>>;
  presentValues: { HP: boolean; MP: boolean };
  criticalDamageRate: TCP.CriticalDamageDef;
};

declare namespace TCP {
  type BuiltInParam1Input = Partial<{
    /**
     * 最大のバフ段階
     */
    maxBuff: number | string;
    /**
     * 最大のデバフ段階
     */
    maxDebuff: number | string;
    /**
     * 表示/非表示
     */
    visible: boolean | string;
    /**
     * 表示順
     */
    displayOrder: number | string;
  }>;
  type BuiltInParam2Input = BuiltInParam1Input & {
    /**
     * 能力値名
     */
    name?: string;
  };
  /**
   * 独自能力値設定入力の型
   */
  type CustomParamInput = BuiltInParam2Input &
    Partial<{
      /**
       * 能力値キー
       */
      key: string;
      /**
       * 最小値
       */
      min: number;
      /**
       * 最大値
       */
      max: number;
      /**
       * 確率能力値
       */
      isRate: boolean;
      /**
       * 成長タイプ
       */
      growType: "grow" | "fixed";
      /**
       * 合算能力値
       */
      formula: Array<string>;
    }>;
  type CriticalDamageInput = BuiltInParam1Input & { default?: number };
  type ParamType = "param" | "xparam" | "sparam" | "cparam";
  type BuiltInParam = {
    key: string;
    name?: string;
    maxBuff: number;
    maxDebuff: number;
    isRate: boolean;
    visible: boolean;
    displayOrder?: number;
    paramId: number;
    nameId?: number;
    type: ParamType;
  };
  type Cparam = {
    key: string;
    name: string;
    min: number;
    max?: number;
    maxBuff: number;
    maxDebuff: number;
    isRate: boolean;
    growType: "grow" | "fixed";
    formula: Array<string>;
    visible: boolean;
    displayOrder?: number;
    paramId: number;
    type: ParamType;
  };
  type ParamsDef = BuiltInParam & Cparam;
  type CriticalDamageDef = {
    default: number;
    maxBuff: number;
    maxDebuff: number;
    visible: boolean;
    displayOrder?: number;
  };

  type RawParams = Record<
    | "MaximumHitPoints"
    | "MaximumMagicPoints"
    | "AttackPower"
    | "DefensePower"
    | "MagicAttackPower"
    | "MagicDefensePower"
    | "Agility"
    | "Luck"
    | "HitRate"
    | "EvasionRate"
    | "CriticalRate"
    | "CriticalEvasionRate"
    | "MagicEvasionRate"
    | "MagicReflectionRate"
    | "CounterAttackRate"
    | "HPRegenerationRate"
    | "MPRegenerationRate"
    | "TPRegenerationRate"
    | "TargetRate"
    | "GuardEffectRate"
    | "RecoverEffectRate"
    | "Pharmocology"
    | "MPCostRate"
    | "TPChargeRate"
    | "PhysicalDamageRate"
    | "MagicDamageRate"
    | "FloorDamageRate"
    | "ExperienceRate",
    BuiltInParam2Input
  > & {
    HitPoints: boolean;
    MagicPoints: boolean;
    ParamJson: Array<CustomParamInput>;
    buffRate: number;
    criticalDamageRate: CriticalDamageInput;
  };
  type BuiltInParams = Record<
    | "maximumHitPoints"
    | "maximumMagicPoints"
    | "attackPower"
    | "defensePower"
    | "magicAttackPower"
    | "magicDefensePower"
    | "agility"
    | "luck"
    | "hitRate"
    | "evasionRate"
    | "criticalRate"
    | "criticalEvasionRate"
    | "magicEvasionRate"
    | "magicReflectionRate"
    | "counterAttackRate"
    | "hpRegenerationRate"
    | "mpRegenerationRate"
    | "tpRegenerationRate"
    | "targetRate"
    | "guardEffectRate"
    | "recoverEffectRate"
    | "pharmocology"
    | "mpCostRate"
    | "tpChargeRate"
    | "physicalDamageRate"
    | "magicDamageRate"
    | "floorDamageRate"
    | "experienceRate",
    BuiltInParam
  >;

  type CustomEffect = { code: "buff" | "debuff"; key: string; value?: number; turns: number };
}

interface Game_Action {
  applyItemCustomBuffEffect: (target: Game_Battler, effect: TCP.CustomEffect) => void;
  itemEffectAddCustomBuff: (target: Game_Battler, effect: TCP.CustomEffect) => void;
  itemEffectAddCustomDebuff: (target: Game_Battler, effect: TCP.CustomEffect) => void;
}

interface Game_ActionResult {
  addedCustomBuffs: Array<string>;
  addedCustomDebuffs: Array<string>;
  removedCustomBuffs: Array<string>;

  isCustomBuffAdded: (paramKey: string) => boolean;
  pushAddedCustomBuff: (paramKey: string) => void;
  isCustomDebuffAdded: (paramKey: string) => boolean;
  pushAddedCustomDebuff: (paramKey: string) => void;
  isCustomBuffRemoved: (paramKey: string) => boolean;
  pushRemovedCustomBuff: (paramKey: string) => boolean;
}

interface Game_BattlerBase {
  _xparamPlus: Array<number>;
  _sparamPlus: Array<number>;
  _cparamPlus: Array<number>;
  _crdPlus: number;

  _xbuffs: Array<number>;
  _sbuffs: Array<number>;
  _cbuffs: Array<number>;
  _crdBuff: number;

  _xbuffTurns: Array<number>;
  _sbuffTurns: Array<number>;
  _cbuffTurns: Array<number>;
  _crdBuffTurns: number;

  eraseCustomBuff: (paramKey: string, param?: TCP.ParamsDef) => void;
  xbuffLength: () => number;
  sbuffLength: () => number;
  cbuffLength: () => number;
  customBuff: (paramKey: string, param?: TCP.ParamsDef) => number;
  isCustomBuffAffected: (paramKey: string, param?: TCP.ParamsDef) => boolean;
  isCustomDebuffAffected: (paramKey: string, param?: TCP.ParamsDef) => boolean;
  isCustomBuffOrDebuffAffected: (paramKey: string, param?: TCP.ParamsDef) => boolean;
  isMaxCustomBuffAffected: (paramKey: string, param?: TCP.ParamsDef) => boolean;
  isMaxCustomDebuffAffected: (paramKey: string, param?: TCP.ParamsDef) => boolean;
  increaseCustomBuff: (paramKey: string, value: number, param?: TCP.ParamsDef) => void;
  decreaseCustomBuff: (paramKey: string, value: number, param?: TCP.ParamsDef) => void;
  overwriteCustomBuffTurns: (paramKey: string, param?: TCP.ParamsDef, turns: number) => void;
  isCustomBuffExpired: (paramKey: string, param?: TCP.ParamsDef) => boolean;
  customDebuffRate: (paramKey: string) => number;

  xparamBase: (xparamId: number) => number;
  xparamPlus: (xparamId: number) => number;
  xparamBasePlus: (xparamId: number) => number;
  xparamRate: (xparamId: number) => number;
  xparamBuffRate: (xparamId: number) => number;
  sparamBase: (sparamId: number) => number;
  sparamPlus: (sparamId: number) => number;
  sparamBasePlus: (sparamId: number) => number;
  sparamRate: (sparamId: number) => number;
  sparamBuffRate: (sparamId: number) => number;
  crdBase: () => number;
  crdPlus: () => number;
  crdBasePlus: () => number;
  crdRate: () => number;
  crdBuffRate: () => number;
  crd: () => number;
  addCrd: (value: number) => void;

  cparamBase: (param: Cparam) => number;
  cparamPlus: (param: Cparam) => number;
  cparamBasePlus: (param: Cparam) => number;
  cparamRate: (param: Cparam) => number;
  cparamBuffRate: (cparamId: number) => number;
  cparam: (cparamId: number) => number;
  addCustomParam: (cparamId: number, value: number) => void;
}

interface Game_Battler {
  addCustomBuff: (paramKey: string, param?: TCP.ParamsDef, turns: number, value?: number) => void;
  addCustomDebuff: (paramKey: string, param?: TCP.ParamsDef, turns: number, value?: number) => void;
  removeCustomBuff: (paramKey: string, param?: TCP.ParamsDef) => void;
}
