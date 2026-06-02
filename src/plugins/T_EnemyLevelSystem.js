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
 * @param
 *   @text
 *   @desc
 *   @type
 *   @default
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
  const params = PluginManagerEx.createParameter(script);
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
    if ($dataMap && $dataMap.meta) {
      let defaultLevel = 1;

      const levelSync = $dataMap.meta.levelSync;
      if (levelSync) {
        switch (typeof levelSync) {
          case "boolean":
            defaultLevel = $gameParty.highestLevel() || 1;
          case "string":
            defaultLevel ||= Number(levelSync);
        }
      }
      const enemyLevelBonus = this.enemy().meta?.levelBonus;
      if (enemyLevelBonus) {
        defaultLevel += Number(enemyLevelBonus) || 0;
      }
      const level = $dataMap.meta[`enemy_${this._enemyId}`];

      const minLevel = Number($dataMap.meta.minLevel) || 1;
      const maxLevel = Number($dataMap.meta.maxLevel) || 99;

      return (Number(level) || defaultLevel).clamp(minLevel, maxLevel);
    }
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Windows
  // -------------------------------------------------------------------------------------------------------------------
})();
