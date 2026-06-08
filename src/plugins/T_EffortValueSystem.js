/// <reference path="./T_EffortValueSystem.d.ts" />

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
 *
 * @param TotalMax
 *   @text 合計上限
 *   @desc アクターが獲得できる合計努力値の上限を設定する
 *   @type number
 *   @default 510
 *
 * @param IndividualMax
 *   @text 個別上限
 *   @desc アクターが獲得できる各能力値ごとの努力値の上限を設定する
 *   @type number
 *   @default 252
 *
 * @help
 * ================================
 * T_EffortValueSystem.js [ja] v0.0.1
 * ================================
 *
 * 確率能力値には反映されない
 *
 * ================
 * Version History
 * ================
 * Ver.   Date        Desc.
 * 0.0.1  yyyy/MM/dd  初版作成
 */

/*~struct~:
 *
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
    const defeatedEnemies = $gameTroop.deadMembers();
    const survivors = $gameParty.battleMembers().filter((actor) => actor.isAlive());

    defeatedEnemies.forEach((enemy) => {
      for (let i = 0; i < 8; i++) {
        const tag = `EV_Gain${i}`;
        const gain = Number(enemy.enemy().meta[tag] || 0);
        if (gain > 0) {
          survivors.forEach((actor) => actor.gainEV(i, gain));
        }
      }
    });
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Objects
  // -------------------------------------------------------------------------------------------------------------------
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

  /**
   * 努力値を獲得する
   *
   * @param {string} type
   * @param {number} paramId
   * @param {number} value
   */
  Game_Actor.prototype.gainEV = function (type, paramId, value) {
    let currentTotal = this.totalEffortValues();
    let currentVal;
    switch (type) {
      case "param":
        currentVal = this._effortValues[paramId];
        break;
      case "cparam":
        currentVal = this._effortValuesCustom[paramId];
        break;
      default:
        console.warn(`通常能力値および独自能力値ではない能力値(${type},${paramId})の努力値獲得が試みられました．`);
        return;
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
   * @param {string} type
   * @param {number} paramId
   */
  Game_Actor.prototype.resetEV = function (type, paramId) {
    switch (type) {
      case "param":
        this._effortValues[paramId] = 0;
        break;
      case "cparam":
        this._effortValuesCustom[paramId] = 0;
        break;
      default:
        console.warn(`通常能力値および独自能力値ではない能力値(${type},${paramId})の努力値リセットが試みられました．`);
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
    let value = _Game_Actor_paramPlus(paramId);
    const evBonus = Math.floor(this._effortValues[paramId] / TEVS.threshold);

    return value + evBonus;
  };

  const Game_Actor_customParamPlus = Game_Actor.prototype.customParamPlus;
  Game_Actor.prototype.customParamPlus = function (param) {
    let value = Game_Actor_customParamPlus(param.paramId);
    const evBonus = Math.floor(this._effortValues[param.paramId] / TEVS.threshold);

    return value + evBonus;
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Windows
  // -------------------------------------------------------------------------------------------------------------------
})();
