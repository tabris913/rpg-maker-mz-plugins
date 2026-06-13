//=============================================================================
// RPG Maker MZ - T_EnemyLevelSystem
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 敵キャラにレベルシステムを導入するプラグイン
 * @author tosshie
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @base T_PluginBase
 * @orderAfter T_PluginBase
 *
 * @param ShowLevelInBattle
 *   @text 敵キャラレベル表示
 *   @desc バトル画面に敵キャラのレベルを表示する
 *   @type boolean
 *   @on 表示する
 *   @off 表示しない
 *   @default false
 * @param UseClassSkill
 *   @text 職業スキル使用
 *   @desc 敵キャラが職業スキルを使用する
 *   @type boolean
 *   @on 使用する
 *   @off 使用しない
 *   @default false
 *
 * @help
 * ==================================
 * T_EnemyLevelSystem.js [ja] v1.0.0
 * ==================================
 *
 * # Dependencies
 *
 * - PluginCommonBase.js
 * 　> {RPG Maker MZ のインストール場所}/dlc/BasicResources/plugins/official
 * 　> にあるものを，ゲームプロジェクトのプラグインディレクトリにコピーし，
 * 　> プラグイン管理から有効化してください
 * - T_PluginBase.js
 * 　> ゲームプロジェクトのプラグインディレクトリにコピーし，プラグイン管理から
 * 　> 有効化してください
 *
 * # できること
 *
 * - 敵キャラにレベルシステムを導入し，レベルに応じて能力値を変化させる
 * - 敵キャラのレベルによって使えるスキルも変化させる
 * - 敵キャラの名前にレベルを付与して表示する
 *
 * # 設定方法
 * ## プラグイン設定
 * ### 敵キャラレベル表示
 * バトル画面で敵キャラの名前の後ろにレベル表記を表記するかを切り替えます．
 *
 * ## データベース
 * データベースのメモ欄に1行ずつタグを記述することで，さまざまな設定が可能です．
 * 本プラグインでは，敵キャラおよびマップのメモ欄を解析します．
 *
 * ### 職業
 * 敵キャラに適用する職業を作成してください．アクターの職業を敵キャラに流用する
 * ことも可能で，特別な手順・設定はありません．
 *
 * ### 敵キャラ
 * 職業をメモに設定します．
 *
 * <classId: {value}>
 * 　職業のIDを設定します．
 * 　e.g. <classId: 1>
 * 　     --> (独自に変更してなければ) 職業は「剣士」
 * <levelBonus: {value}>
 * 　レベルボーナスを設定します．レベルを直接指定する以外の方法で設定した場合、
 * 　計算されたレベルに付加されます．
 * 　e.g. <levelBonus: 2>
 * 　     --> レベルシンクでLv 15になった場合、この敵キャラはLv 17になります
 * <skill_{skillId}: {type},{value1},{value2},{rating}>
 * 　行動パターンを設定します．
 * 　type: 行動条件の種類．デフォルトは0
 * 　  0: 常時, 1: ターン, 2: HP, 3: MP,
 * 　  4: ステート, 5: パーティLV, 6: スイッチ
 * 　value1, value2: 条件の値．行動パターンの条件欄に倣って設定してください．
 * 　rating: 優先度 (1～10)，デフォルトは5
 * 　e.g. <skill_XX: 0,0,0,5>
 * 　     --> 常時優先度5でID「XX」のスキルを行動する
 * 　     ※ すべてデフォルト値なので <skill_12: ,,,> という書き方でもOK
 * 　e.g. <skill_YY: 2,0,50,7>
 * 　     --> HPが0%～50%のときに優先度7でID「YY」のスキルを行動する
 * 　e.g. <skill_ZZ: 4,4,,1>
 * 　     --> ID「4」のステートが付与されているときに優先度1でID「ZZ」のスキ
 * 　         ルを行動する
 *
 * ## マップ
 * 出現する敵キャラのレベルをメモに設定します．
 *
 * <levelSync>
 * 　パーティの最高レベルにレベルシンクされるように設定します．
 * <levelSync: {value}>
 * 　指定したレベルにレベルシンクされるように設定します．
 * 　e.g. <levelSync: 15>
 * 　     --> Lv. 15にレベルシンクされます
 * <enemy_{enemyId}: {value}>
 * 　敵キャラを個別にレベル設定します．
 * 　e.g. <enemy_1: 20>
 * 　     --> (独自に変更してなければ) ゴブリンがLv. 20になります
 * <minLevel: {value}>
 * 　敵キャラのレベルの最小値を設定します．デフォルトは1です．
 * 　e.g. <minLevel: 30>
 * 　     --> レベルの最小値は30になります
 * <maxLevel: {value}>
 * 　敵キャラのレベルの最大値を設定します．デフォルトは1です．
 * 　e.g. <maxLevel: 50>
 * 　     --> レベルの最大値は50になります．
 *
 * レベルを決定する優先度は以下のとおりです．
 * 1. <enemy_{enemyId}: {value}>
 * 2. <levelSync> <levelSync: {value}>
 * 3. <minLevel: {value}> <maxLevel: {value}>
 *
 * ================
 * Version History
 * ================
 * Ver.   Date        Desc.
 * 1.0.0  2026/06/dd  初版作成
 */

/*~struct~:
 *
 */

"use strict";

/**
 * Global variable
 */
const TELS = {};

// ---------------------------------------------------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------------
// Parameters
// ---------------------------------------------------------------------------------------------------------------------
/**
 * プラグインパラメータ処理
 *
 * @param {HTMLOrSVGScriptElement | null} script
 */
TELS.readParams = (script) => {
  /**
   * @type {TELS.RawParams}
   */
  const params = PluginManagerEx.createParameter(script);
  console.debug(params);

  TELS.showLevelInBattle = PluginParamParser.boolean(params.ShowLevelInBattle, false);
  TELS.useClassSkill = PluginParamParser.boolean(params.UseClassSkill, false);
  TELS.skillMap = {};
};

// ---------------------------------------------------------------------------------------------------------------------
// Plugin main
// ---------------------------------------------------------------------------------------------------------------------
(() => {
  const script = document.currentScript;
  TELS.readParams(script);

  // -------------------------------------------------------------------------------------------------------------------
  // Objects
  // -------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Game_Enemy
  // --------------------------------------------------------------------------
  Object.defineProperty(Game_Enemy.prototype, "classId", {
    get: function () {
      if (!this._classId) this.setupClassId();

      return this._classId;
    },
    configurable: true,
  });
  Object.defineProperty(Game_Enemy.prototype, "level", {
    get: function () {
      if (!this._level) this._level = this.getCurrentLevel();

      return this._level;
    },
    configurable: true,
  });

  const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
  Game_Enemy.prototype.initMembers = function () {
    _Game_Enemy_initMembers.call(this);
    this._classId = 0;
    this._level = 0;
  };

  const _Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function (enemyId, x, y) {
    _Game_Enemy_setup.apply(this, arguments);
    this.setupClassId();
  };

  /**
   * 現在の職業を取得する
   *
   * @see Game_Actor.prototype.currentClass
   */
  Game_Enemy.prototype.currentClass = function () {
    // アクターと同じ方法で取得
    const cls = Game_Actor.prototype.currentClass.call(this);

    return cls;
  };

  /**
   * 現在の職業の ID を取得する
   */
  Game_Enemy.prototype.setupClassId = function () {
    const metaClassId = this.enemy().meta.classId;
    const classId = metaClassId === undefined ? undefined : Number(metaClassId);

    if (!Number.isNaN(classId)) this._classId = classId;
  };

  /**
   * 現在のレベルを取得する
   */
  Game_Enemy.prototype.getCurrentLevel = function () {
    let level = 1,
      minLevel = 1,
      maxLevel = 99;

    // マップから設定を読み込む
    if ($dataMap && $dataMap.meta) {
      if ($dataMap.meta[`enemy_${this._enemyId}`]) {
        const parsed = Number($dataMap.meta[`enemy_${this._enemyId}`]);
        if (parsed) {
          return parsed;
        }
      }

      const levelSync = $dataMap.meta.levelSync;
      if (levelSync) {
        switch (typeof levelSync) {
          case "boolean":
            if (levelSync === true) {
              level = $gameParty.highestLevel() || 1;
            }
            break;
          case "string":
            level = Number(levelSync) || level;
        }
      } else {
        minLevel = Number($dataMap.meta.minLevel) || minLevel;
        maxLevel = Number($dataMap.meta.maxLevel) || maxLevel;
        level = Math.randomRangeInt(minLevel, maxLevel + 1);
      }

      // 個別指定が勝つ
      // スキル
    }

    const enemyLevelBonus = this.enemy().meta?.levelBonus;
    if (enemyLevelBonus) {
      level += Number(enemyLevelBonus) || 0;
    }

    return level;
  };

  const _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
  /**
   *
   * @param {number} paramId
   * @returns
   */
  Game_Enemy.prototype.paramBase = function (paramId) {
    if (this.classId) {
      // クラス指定あり
      const classData = $dataClasses[this.classId];
      if (classData && classData.params) {
        return classData.params[paramId][this.level];
      }
    }

    return _Game_Enemy_paramBase.apply(this, arguments);
  };

  const _Game_Enemy_customParamBase = Game_Enemy.prototype.cparamBase;
  /**
   * T_CustomParameters.js を利用しているときのみ呼び出される
   *
   * @param {TCP.Cparam} cparam
   * @returns {number}
   */
  Game_Enemy.prototype.cparamBase = function (cparam) {
    if (this.classId) {
      // クラス指定あり
      const value = Game_Actor.prototype.cparamBase.call(this, cparam);
      return value;
    }

    return _Game_Enemy_customParamBase.apply(this, arguments);
  };

  // for log
  const _Game_Enemy_param = Game_Enemy.prototype.param;
  Game_Enemy.prototype.param = function (paramId) {
    const value = _Game_Enemy_param.apply(this, arguments);

    return value;
  };

  // for log
  const _Game_Enemy_cparam = Game_Enemy.prototype.cparam;
  Game_Enemy.prototype.cparam = function (cparamId) {
    const value = _Game_Enemy_cparam.apply(this, arguments);

    return value;
  };

  const _Game_Enemy_name = Game_Enemy.prototype.name;
  Game_Enemy.prototype.name = function () {
    const name = _Game_Enemy_name.call(this);
    if (TELS.showLevelInBattle) {
      return `${name} Lv.${this.level}`;
    }

    return name;
  };

  /**
   * 最大レベルを取得する
   *
   * 全アクターの最も高い最大レベルと等しい
   */
  Game_Enemy.prototype.maxLevel = function () {
    return Math.max(...$dataActors.filter((a) => a).map((a) => a.maxLevel));
  };

  Game_Enemy.prototype.makeActions = function () {
    Game_Battler.prototype.makeActions.call(this);

    if (this.numActions() > 0) {
      const enemy = this.enemy();
      //
      let actionList = enemy.actions;
      if (TELS.useClassSkill) {
        // 職業のスキルを使用する場合
        if (TELS.skillMap[enemy.id] === undefined) {
          TELS.skillMap[enemy.id] = {};
        }
        const skillMap = TELS.skillMap[enemy.id];
        this.currentClass()
          // 今のレベルまでに使えるスキル
          .learnings.filter((l) => l.level <= this.level)
          .forEach(({ skillId }) => {
            if (skillMap[skillId] === undefined) {
              if (enemy.meta[`skill_${skillId}`]) {
                const configs = enemy.meta[`skill_${skillId}`]
                  .split(",")
                  .map((v) => v.trim())
                  .map(Number);
                skillMap[skillId] = {
                  conditionParam1: configs[1] || 0,
                  conditionParam2: configs[2] || 0,
                  conditionType: configs[0] || 0,
                  rating: configs[3] || 5,
                  skillId,
                };
              } else {
                skillMap[skillId] = {
                  conditionParam1: 0,
                  conditionParam2: 0,
                  conditionType: 0,
                  rating: 5,
                  skillId: skillId,
                };
              }
            }

            actionList.push(skillMap[skillId]);
          });
      }
      //
      actionList = actionList.filter((a) => this.isActionValid(a));
      if (actionList.length > 0) {
        this.selectAllActions(actionList);
      }
    }
    this.setActionState("waiting");
  };

  const _Game_Enemy_traitObjects = Game_Enemy.prototype.traitObjects;
  Game_Enemy.prototype.traitObjects = function () {
    // 敵キャラに適用される特徴に，職業の特徴を追加
    return _Game_Enemy_traitObjects.call(this).concat(this.currentClass());
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Windows
  // -------------------------------------------------------------------------------------------------------------------
})();
