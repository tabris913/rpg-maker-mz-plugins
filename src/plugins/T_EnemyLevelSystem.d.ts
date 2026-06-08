declare const TELS: {
  showLevelInBattle: boolean;
  useClassSkill: boolean;
  skillMap: Record<number, Record<number, rm.types.EnemyAction>>;
};

declare namespace TELS {
  type RawParams = {
    ShowLevelInBattle?: boolean | string;
    UseClassSkill?: boolean | string;
  };
}

interface Game_Enemy {
  _classId: number;
  _level: number;
  level: number;

  currentClass: () => rm.types.RPGClass;
  setupClassId: () => number;
  getCurrentLevel: () => number;
}
