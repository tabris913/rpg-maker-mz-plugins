//=============================================================================
// RPG Maker MZ - T_EffortValueSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 努力値風システムを導入するプラグイン
 * @author tosshie
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter T_CustomParameters
 *
 * @param Threshold
 *   @text 上昇閾値
 *   @desc 何ポイント溜まると能力値が 1 上がるかを設定する
 *   @type number
 *   @default 4
 * @param TotalMax
 *   @text 合計上限
 *   @desc アクターが獲得できる合計努力値の上限を設定する
 *   @type number
 *   @default 510
 * @param IndividualMax
 *   @text 個別上限
 *   @desc アクターが獲得できる各能力値ごとの努力値の上限を設定する
 *   @type number
 *   @default 252
 *
 * @help
 * ================================
 * T_EffortValueSystem.js [ja] v1.0.0
 * ================================
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
 * - 敵キャラを倒すと努力値を獲得できます
 * - 努力値を何ポイント溜めるとステータスが1上昇するかを変更する
 * - 獲得努力値の上限量を変更する
 *
 * # ⚠️注意点⚠️
 * 確率能力値には反映されない
 *
 * # 設定方法
 * ## データベース
 * ### 敵キャラ
 *
 * <ev_{paramKey}: {value}>
 * 　倒したときに得られる努力値の種類と量を設定します．{paramKey}にはスキルの計
 * 　算式で指定する能力値のキーを指定します．T_CustomParametersを導入している
 * 　場合は，独自能力値のキーも設定できます．
 * 　e.g. <ev_mhp: 2>
 * 　     --> 最大HPの努力値が2得られる．
 *
 * ### アイテム
 *
 * <evResetAll>
 * 　すべての努力値をリセットするように設定する．
 *
 * <evReset_{paramKey}>
 * 　特定の能力値の努力値をリセットするように設定する．
 * 　e.g. <evReset_mhp>
 * 　     --> 最大HPの努力値をリセットする．
 *
 * <evAdd_{paramKey}: {value}>
 * 　特定の努力値を変化させるように設定する．
 * 　e.g. <evAdd_mhp: -10>
 * 　     --> 最大HPの努力値を10下げる．
 *
 * ================
 * Version History
 * ================
 * Ver.   Date        Desc.
 * 1.0.0  2026/06/dd  初版作成
 */

"use strict";

/**
 * Global variable
 */
const TEVS = {};

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
const readParams = (script) => {
  /**
   * @type {ParamsRaw}
   */
  const params = PluginManagerEx.createParameter(script);

  TEVS.threshold = PluginParamParser.number(params.Threshold, 4);
  TEVS.totalMax = PluginParamParser.number(params.TotalMax, 510);
  TEVS.individualMax = PluginParamParser.number(params.IndividualMax, 252);
  TEVS.isEnabledTCP = TCP !== undefined;
};

// ---------------------------------------------------------------------------------------------------------------------
// Plugin main
// ---------------------------------------------------------------------------------------------------------------------
(() => {
  const script = document.currentScript;
  readParams(script);

  // ---------------------------------------------------------------------------------------------------------------------
  // Managers
  // ---------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // BattleManager
  // ----------------------------------------------------------------------------
  const _BattleManager_gainRewards = BattleManager.gainRewards;
  BattleManager.gainRewards = function () {
    _BattleManager_gainRewards.call(this);
    this.gainEffortValues();
  };

  BattleManager.gainEffortValues = function () {
    /**
     * @type {Array<Game_Enemy>}
     */
    const defeatedEnemies = $gameTroop.deadMembers();
    /**
     * @type {Array<Game_Actor>}
     */
    const survivors = $gameParty.battleMembers().filter((actor) => actor.isAlive());

    defeatedEnemies.forEach((enemy) => {
      Object.entries(enemy.enemy().meta)
        .filter(([key]) => key.startsWith("ev_"))
        .forEach(([key, value]) => {
          const paramKey = Number(key.replace("ev_", ""));
          const gain = Number(value.trim()) || 0;
          if (gain > 0) {
            survivors.forEach((actor) => actor.gainEV(paramKey, gain));
          }
        });
    });
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Objects
  // -------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // Game_Action
  // ----------------------------------------------------------------------------
  const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
  Game_Action.prototype.applyItemEffect = function (target, effect) {
    _Game_Action_applyItemEffect.call(this, target, effect);

    if (target.isActor()) {
      const item = this.item();

      Object.entries(item.meta).forEach(([key, value]) => {
        // 努力値リセットアイテム
        if (key === "evResetAll" && value) {
          target.resetEVs();
        } else if (key.startsWith("evReset_")) {
          target.resetEV(key.replace("evReset_"));
        } else if (key.startsWith("evAdd_")) {
          // 努力値増減アイテム (EV_Change[ID])
          const value = Number(value);
          if (!Number.isNaN(value)) {
            target.gainEV(key.replace("evAdd_"), value);
          }
        }
      });
    }
  };

  // ----------------------------------------------------------------------------
  // Game_Actor
  // ----------------------------------------------------------------------------
  const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
  Game_Actor.prototype.initMembers = function () {
    _Game_Actor_initMembers.call(this);
    // 努力値の初期化
    this.initEV();
  };

  /**
   * 努力値の初期化
   */
  Game_Actor.prototype.initEV = function () {
    this._effortValues = Array(9).fill(0);
    this._effortValuesCustom = Array(
      TEVS.isEnabledTCP ? TCP.paramsDef.filter((p) => p.type === "cparam").length : 0,
    ).fill(0);
  };

  /**
   * 合計努力値を取得する
   *
   * @returns {number}
   */
  Game_Actor.prototype.totalEffortValues = function () {
    return this._effortValues.concat(this._effortValuesCustom).reduce((a, b) => a + b, 0);
  };

  const paramKeys = ["mhp", "mmp", "atk", "def", "mat", "mdf", "agi", "luk"];
  /**
   * 努力値を獲得する
   *
   * @param {string} paramKey
   * @param {number} value
   */
  Game_Actor.prototype.gainEV = function (paramKey, value) {
    let currentTotal = this.totalEffortValues();
    let currentVal, paramId, type;
    if (paramKeys.includes(paramKey)) {
      type = "param";
      paramId = paramKeys.indexOf(paramKey);
      currentVal = this._effortValues[paramId];
    } else {
      const param = TCP.paramsDef.find((p) => p.key === paramKey);
      if (TEVS.isEnabledTCP && param?.type === "cparam") {
        type = "cparam";
        paramId = param?.paramId;
        currentVal = this._effortValuesCustom[paramId];
      } else {
        console.warn(`通常能力値および独自能力値ではない能力値(${paramKey})の努力値獲得が試みられました．`);
        return;
      }
    }

    // 合計上限と個別上限のチェック
    let gainable = Math.min(value, TEVS.IndividualMax - currentVal, TEVS.totalMax - currentTotal);

    if (value < 0) gainable = Math.max(value, -currentVal); // 減少時の処理

    (type === "param" ? this._effortValues : this._effortValuesCustom)[paramId] += gainable;

    // ステータス再計算を促す [3]
    this.refresh();
  };

  /**
   * 個別努力値をリセットする
   *
   * @param {string} paramKey
   */
  Game_Actor.prototype.resetEV = function (paramKey) {
    if (paramKeys.includes(paramKey)) {
      this._effortValues[paramKey.indexOf(paramKey)] = 0;
    } else {
      const param = TCP.paramsDef.find((p) => p.key === paramKey);
      if (TEVS.isEnabledTCP && param?.type === "cparam") {
        this._effortValuesCustom[param?.paramId] = 0;
      } else {
        console.warn(`通常能力値および独自能力値ではない能力値(${paramKey})の努力値リセットが試みられました．`);
      }
    }
  };

  /**
   * 全努力値をリセットする
   */
  Game_Actor.prototype.resetEVs = function () {
    this.initEV();
    this.refresh();
  };

  const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
  Game_Actor.prototype.paramPlus = function (paramId) {
    let value = _Game_Actor_paramPlus.call(this, paramId);
    const evBonus = Math.floor(this._effortValues[paramId] / TEVS.threshold);

    return value + evBonus;
  };

  const Game_Actor_customParamPlus = Game_Actor.prototype.cparamPlus;
  Game_Actor.prototype.cparamPlus = function (param) {
    let value = Game_Actor_customParamPlus.call(this, param);
    const evBonus = Math.floor(this._effortValues[param.paramId] / TEVS.threshold);

    return value + evBonus;
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Windows
  // -------------------------------------------------------------------------------------------------------------------
})();
