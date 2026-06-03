export type BuiltInParam1Input = Partial<{
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
export type BuiltInParam2Input = BuiltInParam1Input & {
  /**
   * 能力値名
   */
  name?: string;
};
/**
 * 独自能力値設定入力の型
 */
export type CustomParamInput = BuiltInParam2Input &
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
export type ParamType = "param" | "xparam" | "sparam" | "cparam";
export type BuiltInParam = {
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
export type Cparam = {
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
export type ParamsDef = BuiltInParam & Cparam;

export type RawParams = Record<
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
};
export type BuiltInParams = Record<
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

export type GlobalV = {
  paramsDef: Array<ParamsDef>;
  buffRate: number;
  paramMemo: Record<number, Record<string, Record<number, number>>>;
  presentValues: { HP: boolean; MP: boolean };
};
