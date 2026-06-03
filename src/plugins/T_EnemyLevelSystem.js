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
 *   @text バトル画面に敵キャラのレベルを表示する
 *   @desc
 *   @type boolean
 *   @on 表示する
 *   @off 表示しない
 *   @default false
 *
 * @help
 * ================================
 * T_EnemyLevelSystem.js [ja] v0.0.1
 * ================================
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
 *
 * @type {import('./T_EnemyLevelSystem').GlobalV}
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
const readParams = (script) => {
  /**
   * @type {import('./T_EnemyLevelSystem').RawParams}
   */
  const params = PluginManagerEx.createParameter(script);
  console.debug(params);

  TELS.showLevelInBattle = PluginParamParser.boolean(params.ShowLevelInBattle, false);
};

// ---------------------------------------------------------------------------------------------------------------------
// Plugin main
// ---------------------------------------------------------------------------------------------------------------------
(() => {
  const script = document.currentScript;
  readParams(script);

  // -------------------------------------------------------------------------------------------------------------------
  // Objects
  // -------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Game_Enemy
  // --------------------------------------------------------------------------
  Object.defineProperty(Game_Enemy.prototype, "_level", {
    get: function () {
      return getCurrentLevel();
    },
    configurable: true,
  });
  Object.defineProperty(Game_Enemy.prototype, "level", {
    get: function () {
      return this._level;
    },
    configurable: true,
  });

  _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
  Game_Enemy.prototype.initMembers = function () {
    _Game_Enemy_initMembers.call(this);
    this._classId = 0;
  };

  _Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function (enemyId, x, y) {
    _Game_Enemy_setup.apply(this, arguments);
    this._classId = this.setupClassId();
  };

  Game_Enemy.prototype.currentClass = function () {
    return Game_Actor.prototype.currentClass.call(this);
  };

  /**
   *
   * @returns {number}
   */
  Game_Enemy.prototype.setupClassId = function () {
    const metaClassId = this.enemy().meta.classId;
    const classId = metaClassId === undefined ? undefined : Number(metaClassId);

    return Number.isNaN(classId) ? this._classId : classId;
  };

  /**
   *
   * @returns {number}
   */
  Game_Enemy.prototype.getCurrentLevel = function () {
    let level = 1,
      minLevel = 1,
      maxLevel = 99;

    // マップから設定を読み込む
    if ($dataMap && $dataMap.meta) {
      const levelSync = $dataMap.meta.levelSync;
      if (levelSync) {
        switch (typeof levelSync) {
          case "boolean":
            if (levelSync === true) {
              level = $gameParty.highestLevel() || 1;
            }
            break;
          case "string":
            level ||= Number(levelSync);
        }
      }
      const enemyLevelBonus = this.enemy().meta?.levelBonus;
      if (enemyLevelBonus) {
        level += Number(enemyLevelBonus) || 0;
      }
      const level = $dataMap.meta[`enemy_${this._enemyId}`];

      minLevel ||= Number($dataMap.meta.minLevel);
      maxLevel ||= Number($dataMap.meta.maxLevel);

      level ||= Number(level);
    }

    return level.clamp(minLevel, maxLevel);
  };

  _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
  /**
   *
   * @param {number} paramId
   * @returns
   */
  Game_Enemy.prototype.paramBase = function (paramId) {
    if (this._classId !== undefined) {
      // クラス指定あり
      const classData = $dataClasses[this._classId];
      if (classData && classData.params) {
        return classData.params[paramId][this._level];
      }
    }

    return _Game_Enemy_paramBase.apply(this, arguments);
  };

  _Game_Enemy_customParamBase = Game_Enemy.prototype.customParamBase;
  /**
   * T_CustomParameters.js を利用しているときのみ呼び出される
   *
   * @param {import('./T_CustomParameters').Cparam} cparam
   * @returns {number}
   */
  Game_Enemy.prototype.customParamBase = function (cparam) {
    if (this._classId !== undefined) {
      // クラス指定あり
      return Game_Actor.prototype.customParamBase.call(this, cparam);
    }

    return _Game_Enemy_customParamBase.apply(this, arguments);
  };

  _Game_Enemy_name = Game_Enemy.prototype.name;
  Game_Enemy.prototype.name = function () {
    const name = _Game_Enemy_name.call(this);
    if (TELS.showLevelInBattle) {
      return `${name} Lv.${this._level}`;
    }

    return name;
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Windows
  // -------------------------------------------------------------------------------------------------------------------
})();
