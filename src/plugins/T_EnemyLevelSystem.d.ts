export type RawParams = {
  ShowLevelInBattle?: boolean | string;
  UseClassSkill?: boolean | string;
};

export type GlobalV = {
  showLevelInBattle: boolean;
  useClassSkill: boolean;
  skillMap: Record<number, Record<number, rm.types.EnemyAction>>;
};
