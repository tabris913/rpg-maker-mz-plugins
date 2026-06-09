/// <reference path="../types/T_ElementRankSystem.d.ts" />

//=============================================================================
// RPG Maker MZ - T_ElementRankSystem
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 動的に属性有効度レベルを上下させるシステムを導入するプラグイン
 * @author tosshie
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @base T_PluginBase
 * @orderAfter T_PluginBase
 *
 * @param ResistRanks
 *   @text 耐性段階
 *   @desc 無効(倍率0倍)と通常(倍率1倍)の間の耐性段階を定義する
 *   @type struct<CustomRank>[]
 *   @default ["{\"key\":\"halve\",\"name\":\"半減\",\"rate\":\"0.5\"}"]
 * @param WeakRanks
 *   @text 弱点段階
 *   @desc 通常(倍率1倍)と即死(倍率+∞)の間の弱点段階を定義する
 *   @type struct<CustomRank>[]
 *   @default ["{\"key\":\"weak\",\"name\":\"弱点\",\"rate\":\"1.5\"}"]
 * @param NormalRankName
 *   @text 通常段階名
 *   @desc 倍率1倍の段階の表示名を定義する
 *   @type string
 *   @default 通常
 * @param AbsorbRank
 *   @text 吸収段階
 *   @desc ダメージを吸収する段階を定義する
 *   @type struct<AbsorbRank>
 *   @default {"rate":"-1","isEnabled":"true"}
 * @param InstantDeathRank
 *   @text 即死段階
 *   @desc 一撃必殺の段階を定義する
 *   @type struct<InstantDeathRank>
 *   @default {"name":"即死","isEnabled":"true"}
 *
 * @help
 * ================================
 * T_ElementRankSystem.js [ja] v0.0.1
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
 * - 従来の属性有効度の設定はすべて無視されます
 *
 * # 設定方法
 * ## プラグイン設定
 * ### 耐性段階・弱点段階
 * 「吸収」「無効」「通常」「即死」以外の耐性・弱点の設定を行います．
 *
 * ### 通常段階名
 * 通常状態(等倍)の表示名を変更します．
 *
 * ### 吸収段階・即死段階
 * 属性を吸収する耐性段階および即死する弱点段階の有効・無効を切り替えます．
 *
 * ## データベース
 * ### アクター・職業・敵キャラ
 * アクター・職業・敵キャラの固有の有効度段階を設定します．
 *
 * <elementRank_{elementId}: {value}>
 * 　属性ごとに通常状態から何段階変化した状態であるかを設定します．正の数を設定
 * 　した場合は弱点方向に，負の数を設定した場合は耐性方向に変化します．また，数
 * 　値ではなくキーワードを設定することも可能です．
 * 　キーワード: absorb(吸収), null(無効), instantDeath(即死)
 * 　e.g. <elementRank_1: 2>
 * 　     --> ID「1」の属性有効度が通常状態よりも2段階上昇している．
 * 　e.g. <elementRank_1: absorb>
 * 　     --> ID「1」の属性有効度が「吸収」段階になる．
 *
 * 　アクターと職業に，T_EnemyLevelSystemを導入している場合は敵キャラと職業に
 * 　もそれぞれ設定をすることができますが，これらは基本的に加算されます．数値に
 * 　!記号を付与することで，加算されずに一方の値を強制することができます．両者に
 * 　!記号がある場合は，職業が優先されます．
 * 　e.g. <elementRank_1: -1> (アクター)
 * 　     <elementRank_1: 2> (職業)
 * 　     --> ID「1」の属性有効度が通常状態よりも1段階上昇している．
 * 　e.g. <elementRank_1: -1!> (アクター)
 * 　     <elementRank_1: 2> (職業)
 * 　     --> ID「1」の属性有効度が通常状態よりも1段階下降している．
 * 　e.g. <elementRank_1: -1!> (アクター)
 * 　     <elementRank_1: 2!> (職業)
 * 　     --> ID「1」の属性有効度が通常状態よりも2段階上昇している．
 *
 * ### スキル・アイテム
 * スキル・アイテムを使用した際の耐性段階の変化を設定します．
 *
 * <elementRank_{elementId}: {value},{turn}>
 * 　属性有効度が何ターンの間，何段階変化するかを設定します．
 * 　e.g. <elementRank_1: 1,2>
 * 　     --> ID「1」の属性有効度が，2ターンの間通常状態よりも1段階上昇する．
 *
 * ### 武器・防具・ステート
 * 武器・防具を装備した際およびステートが付与されている際の設定をします．その他
 * の設定と異なり，有効度段階ではなく直接倍率を設定します．
 *
 * <addElementRate_{elementId}: {value}>
 * 　属性耐性に対する加算効果を設定します．
 * 　e.g. <addElementRate_1: 0.2>
 * 　     --> ID「1」の属性倍率に0.2加算する (20%増加)
 *
 * <prodElementRate_{elementId}: {value}>
 * 　属性耐性に対する乗算効果を設定します．
 * 　e.g. <prodElementRate_1: 1.5>
 *        --> ID「1」の属性倍率が1.5倍になる
 *
 * ================
 * Version History
 * ================
 * Ver.   Date        Desc.
 * 1.0.0  2026/06/dd  初版作成
 */

/*~struct~CustomRank:
 * @param key
 *   @text 属性有効段階キー
 *   @desc
 *   @type string
 * @param name
 *   @text 属性有効段階名
 *   @desc
 *   @type string
 * @param rate
 *   @text 倍率
 *   @desc 属性有効度を指定する
 *   @type string
 *   @default 1
 */
/*~struct~AbsorbRank:
 * @param rate
 *   @text 倍率
 *   @desc 属性有効度を指定する
 *   @type string
 *   @default -1
 * @param isEnabled
 *   @text 有効
 *   @desc 属性有効度を指定する
 *   @type boolean
 *   @on 有効
 *   @off 無効
 *   @default on
 */
/*~struct~InstantDeathRank:
 * @param name
 *   @text 属性有効段階名
 *   @desc
 *   @type string
 * @param isEnabled
 *   @text 有効
 *   @desc 属性有効度を指定する
 *   @type boolean
 *   @on 有効
 *   @off 無効
 *   @default on
 */

"use strict";

/**
 * Global variable
 */
const TERS = {};

// ---------------------------------------------------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Type guard
 *
 * @param {any} input
 * @returns
 */
const isCustomRank = (input) => {
  return input.key !== undefined && input.name !== undefined && input.rate !== undefined;
};

// ---------------------------------------------------------------------------------------------------------------------
// Parameters
// ---------------------------------------------------------------------------------------------------------------------
/**
 * プラグインパラメータ処理
 *
 * @param {HTMLOrSVGScriptElement | null} script
 */
TERS.readParams = (script) => {
  /**
   * @type {TERS.RawParams}
   */
  const params = PluginManagerEx.createParameter(script);

  TERS.elementRanks = [];

  let count = 0;

  // Absorb
  const ar = PluginParamParser.struct(params.AbsorbRank);
  if (PluginParamParser.boolean(ar?.isEnabled, true)) {
    const absorbRank = { key: "absorb", name: "吸収", rate: PluginParamParser.number(ar?.rate, -1) };
    if (absorbRank.rate >= 0) absorbRank.rate = -1;
    TERS.elementRanks.push(absorbRank);
    TERS.isEnabledAbsorb = true;
    count++;
  } else {
    TERS.isEnabledAbsorb = false;
  }

  // Null
  TERS.elementRanks.push({ key: "null", name: "無効", rate: 0 });
  count++;

  // Resist
  PluginParamParser.array(params.ResistRanks)
    .filter((p) => typeof p !== "string")
    .map((p) => ({
      key: PluginParamParser.string(p.key),
      name: PluginParamParser.string(p.name),
      rate: PluginParamParser.number(p.rate),
    }))
    .filter(isCustomRank)
    .filter((p) => 0 < p.rate && p.rate < 1)
    .sort((a, b) => a.rate - b.rate)
    .forEach((p) => {
      count++;
      TERS.elementRanks.push(p);
    });

  // Normal
  TERS.normalIndex = count;
  TERS.elementRanks.push({ key: "normal", name: PluginParamParser.string(params.NormalRankName, "通常"), rate: 1 });
  // Weak
  TERS.weakRanks = PluginParamParser.array(params.WeakRanks)
    .filter((p) => typeof p !== "string")
    .map((p) => ({
      key: PluginParamParser.string(p.key),
      name: PluginParamParser.string(p.name),
      rate: PluginParamParser.number(p.rate),
    }))
    .filter(isCustomRank)
    .filter((p) => 1 < p.rate)
    .sort((a, b) => a.rate - b.rate)
    .forEach((p) => TERS.elementRanks.push(p));

  // Instant Death
  const idr = PluginParamParser.struct(params.InstantDeathRank);
  if (PluginParamParser.boolean(idr?.isEnabled, true)) {
    const instantDeathRank = { key: "instantDeath", name: PluginParamParser.string(idr?.name, "即死"), rate: Infinity };
    if (instantDeathRank.rate >= 0) instantDeathRank.rate = Infinity;
    TERS.elementRanks.push(instantDeathRank);
    TERS.isEnabledInstantDeath = true;
  } else {
    TERS.isEnabledInstantDeath = false;
  }

  TERS.maxIndex = TERS.elementRanks.length - 1;
};

// ---------------------------------------------------------------------------------------------------------------------
// Plugin main
// ---------------------------------------------------------------------------------------------------------------------
(() => {
  const script = document.currentScript;
  TERS.readParams(script);

  // -------------------------------------------------------------------------------------------------------------------
  // Objects
  // -------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // Game_Action
  // ----------------------------------------------------------------------------
  const _Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function (target) {
    _Game_Action_applyItemUserEffect.call(this, target);

    console.debug(target.name(), target._elementRanks);

    // スキル/アイテムのメモ欄を解析
    const item = this.item();
    if (item && item.note && target && target._elementRanks) {
      Object.entries(item.meta)
        .filter(([key]) => key.startsWith("elementRank_"))
        .forEach(([key, value]) => {
          const elementId = Number(key.replace("elementRank_", ""));
          const [amount, turn] = value
            .split(",")
            .map((v) => v.trim())
            .map(Number);
          if (Number.isNaN(elementId) || Number.isNaN(amount) || amount === 0 || Number.isNaN(turn) || turn === 0) {
            return;
          }

          target._elementRanks[elementId] += amount;
          target._elementRankTurns[elementId] = turn;

          const elementName = $dataSystem.elements[elementId];
          let message = "変化した！";
          if (amount < 0) {
            message = `${Math.abs(amount)}段階上昇した！`;
          } else if (amount > 0) {
            message = `${amount}段階下降した！`;
          }
          BattleManager._logWindow.push("addText", `${target.name()}の${elementName}属性耐性が${message}`);
        });
    }

    console.debug(target.name(), target._elementRanks, target._elementRankTurns);
  };

  /**
   *
   * @param {Game_Battler} target
   * @param {number} value
   * @override
   */
  Game_Action.prototype.executeHpDamage = function (target, value) {
    if (this.isDrain()) {
      value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    target.gainHp(-value);
    if (value > 0) {
      target.onDamage(value);
    }
    //
    else if (value < 0) {
      target.onAbsorb(value);
    } else {
      target.onNullDamage();
    }
    //
    this.gainDrainedHp(value);
  };

  const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
  Game_Action.prototype.makeDamageValue = function (target, critical) {
    const rate = this.calcElementRate(target);
    if (rate === Infinity) return target.mhp * 10;

    return _Game_Action_makeDamageValue.apply(this, arguments);
  };

  // ----------------------------------------------------------------------------
  // Game_BattlerBase
  // ----------------------------------------------------------------------------
  const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
  Game_BattlerBase.prototype.initMembers = function () {
    _Game_BattlerBase_initMembers.call(this);
    this._elementRanks = Array($dataSystem.elements.length).fill(TERS.normalIndex);
    this._elementRankPlus = Array($dataSystem.elements.length).fill(0);
    this._elementRankTurns = Array($dataSystem.elements.length).fill(0);
  };

  /**
   *
   * @param {number} elementId
   * @returns {number}
   * @override
   */
  Game_BattlerBase.prototype.elementRate = function (elementId) {
    const rankIndex = this._elementRanks[elementId];
    const rank = TERS.elementRanks[rankIndex];

    let value = rank?.rate ?? 1;
    value += this.elementPlus(elementId);

    console.debug(elementId, rankIndex, rank, value);

    return value;
  };

  Game_BattlerBase.prototype.setupElementRank = function () {
    //
  };

  // ----------------------------------------------------------------------------
  // Game_Battler
  // ----------------------------------------------------------------------------
  const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
  Game_Battler.prototype.onBattleStart = function () {
    _Game_Battler_onBattleStart.call(this);
    this.setupElementRank();
    this._instantDeath = false;
  };

  const _Game_Battler_onDamage = Game_Battler.prototype.onDamage;
  Game_Battler.prototype.onDamage = function (value) {
    _Game_Battler_onDamage.call(this, value);

    // 戦闘中のダメージ処理である場合
    if ($gameParty.inBattle() && TERS.isEnabledInstantDeath) {
      const action = BattleManager._action;
      if (action && action.item()) {
        const elementId = action.item().damage.elementId;
        // 通常攻撃（elementId === -1）の場合は、攻撃側の属性を取得
        const actualElementId = elementId === -1 ? action.subject().attackElements()[0] : elementId;

        if (actualElementId > 0) {
          const rankIndex = this._elementRanks[actualElementId];
          const rank = TERS.elementRanks[rankIndex];
          if (rank.key === "instantDeath") {
            // 耐性が「death（即死）」かつダメージが1以上通った場合、戦闘不能を付加
            this.addState(this.deathStateId());
            this._instantDeath = true;
            BattleManager._logWindow.push("addText", `${this.name()}は${rank.name}した！`);
          }
        }
      }
    }
  };

  Game_Battler.prototype.onAbsorb = function (value) {
    // 戦闘中のダメージ処理である場合
    if ($gameParty.inBattle() && TERS.isEnabledAbsorb) {
      const action = BattleManager._action;
      if (action && action.item()) {
        const elementId = action.item().damage.elementId;
        // 通常攻撃（elementId === -1）の場合は、攻撃側の属性を取得
        const actualElementId = elementId === -1 ? action.subject().attackElements()[0] : elementId;

        if (actualElementId > 0) {
          const rankIndex = this._elementRanks[actualElementId];
          const rank = TERS.elementRanks[rankIndex];
          if (rank.key === "absorb") {
            BattleManager._logWindow.push("addText", `${this.name()}はダメージを吸収した！`);
          }
        }
      }
    }
  };

  Game_Battler.prototype.onNullDamage = function () {
    // 戦闘中のダメージ処理である場合
    if ($gameParty.inBattle() && TERS.isEnabledAbsorb) {
      const action = BattleManager._action;
      if (action && action.item()) {
        const elementId = action.item().damage.elementId;
        // 通常攻撃（elementId === -1）の場合は、攻撃側の属性を取得
        const actualElementId = elementId === -1 ? action.subject().attackElements()[0] : elementId;

        if (actualElementId > 0) {
          const rankIndex = this._elementRanks[actualElementId];
          const rank = TERS.elementRanks[rankIndex];
          if (rank.key === "null") {
            BattleManager._logWindow.push("addText", `${this.name()}はダメージを無効にした！`);
          }
        }
      }
    }
  };

  const _Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
  Game_Battler.prototype.onTurnEnd = function () {
    _Game_Battler_onTurnEnd.call(this);

    console.debug(this._elementRankTurns);

    this._elementRankTurns.forEach((turn, index) => {
      if (turn > 0) {
        const newTurn = this._elementRankTurns[index] - 1;
        this._elementRankTurns[index] = newTurn;

        if (newTurn === 0) {
          this._elementRanks[index] = TERS.normalIndex;
          const elementName = $dataSystem.elements[index];
          BattleManager._logWindow.push("addText", `${this.name()}の${elementName}属性耐性が戻った！`);
        }
      }
    });
  };

  Game_Battler.prototype.elementPlus = function (elementId) {
    return this._elementRankPlus[elementId];
  };

  // ----------------------------------------------------------------------------
  // Game_Actor
  // ----------------------------------------------------------------------------
  const _Game_Actor_setup = Game_Actor.prototype.setup;
  Game_Actor.prototype.setup = function (actorId) {
    _Game_Actor_setup.call(this, actorId);
    this.setupElementRank();
  };

  /**
   * @override
   */
  Game_Actor.prototype.setupElementRank = function () {
    Game_BattlerBase.prototype.setupElementRank.call(this);

    const actor = this.actor();
    const cls = this.currentClass();
    console.debug(actor.name, this._elementRanks);

    // 初期ランクはアクターと職業参照
    for (let i = 0; i < $dataSystem.elements.length; i++) {
      let value = TERS.normalIndex;

      /**
       * @type {string}
       */
      const actorConfigRaw = actor.meta[`elementRank_${i}`];
      let actorConfig = actorConfigRaw?.trim().replace("!", "");
      switch (actorConfig) {
        case undefined:
          actorConfig = NaN;
          break;
        case "absorb":
          actorConfig = TERS.isEnabledAbsorb ? 0 - TERS.normalIndex : NaN;
          break;
        case "null":
        case null:
          actorConfig = 1 - TERS.normalIndex;
          break;
        case "instantDeath":
          actorConfig = TERS.isEnabledInstantDeath ? TERS.maxIndex - TERS.normalIndex : NaN;
          break;
        default:
          actorConfig = Number(actorConfigRaw?.trim().replace("!", ""));
      }
      /**
       * @type {string}
       */
      const classConfigRaw = cls.meta[`elementRank_${i}`];
      let classConfig = classConfigRaw?.trim().replace("!", "");
      switch (classConfig) {
        case undefined:
          classConfig = NaN;
          break;
        case "absorb":
          classConfig = TERS.isEnabledAbsorb ? 0 - TERS.normalIndex : NaN;
          break;
        case "null":
        case null:
          classConfig = 1 - TERS.normalIndex;
          break;
        case "instantDeath":
          classConfig = TERS.isEnabledInstantDeath ? TERS.maxIndex - TERS.normalIndex : NaN;
          break;
        default:
          classConfig = Number(classConfigRaw?.trim().replace("!", ""));
      }

      if (Number.isNaN(actorConfig) && Number.isNaN(classConfig)) continue;

      if (!Number.isNaN(actorConfig)) {
        value += actorConfig;
      }
      if (!actorConfigRaw.includes("!") && !Number.isNaN(classConfig)) {
        if (classConfigRaw.includes("!")) {
          value = TERS.normalIndex + classConfig;
        } else {
          value += classConfig;
        }
      }

      this._elementRanks[i] = value.clamp(0, TERS.maxIndex);
    }
    console.debug(actor.name, this._elementRanks);
  };

  Game_Actor.prototype.elementPlus = function (elementId) {
    let value = Game_Battler.prototype.elementPlus.call(this, elementId);
    for (const item of this.equips() || []) {
      if (item && item.meta[`addElementRate_${elementId}`] !== undefined) {
        value += Number(item.meta[`addElementRate_${elementId}`]) || 0;
      }
    }
    for (const item of this.states() || []) {
      if (item && item.meta[`addElementRate_${elementId}`] !== undefined) {
        value += Number(item.meta[`addElementRate_${elementId}`]) || 0;
      }
    }

    return value;
  };

  Game_Actor.prototype.elementRate = function (elementId) {
    let value = Game_BattlerBase.prototype.elementRate.call(this, elementId);

    for (const item of this.equips() || []) {
      if (item && item.meta[`prodElementRate_${elementId}`] !== undefined) {
        value *= Number(item.meta[`prodElementRate_${elementId}`]);
      }
    }
    for (const state of this.states()) {
      if (state && state.meta[`prodElementRate_${elementId}`] !== undefined) {
        value *= Number(state.meta[`prodElementRate_${elementId}`]);
      }
    }

    return value;
  };

  // ----------------------------------------------------------------------------
  // Game_Enemy
  // ----------------------------------------------------------------------------
  const _Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function (enemyId, x, y) {
    _Game_Enemy_setup.apply(this, arguments);
    this.setupElementRank();
  };

  Game_Enemy.prototype.setupElementRank = function () {
    Game_BattlerBase.prototype.setupElementRank.call(this);

    const enemy = this.enemy();
    let cls = undefined;
    if (this._classId !== undefined) {
      cls = this.currentClass();
    }
    console.debug(enemy.name, this._elementRanks);

    // 初期ランクはアクターと職業参照
    for (let i = 0; i < $dataSystem.elements.length; i++) {
      let value = TERS.normalIndex;

      /**
       * @type {string}
       */
      const enemyConfigRaw = enemy.meta[`elementRank_${i}`];
      let enemyConfig = enemyConfigRaw?.trim().replace("!", "");
      switch (enemyConfig) {
        case undefined:
          enemyConfig = NaN;
          break;
        case "absorb":
          enemyConfig = TERS.isEnabledAbsorb ? 0 - TERS.normalIndex : NaN;
          break;
        case "null":
        case null:
          enemyConfig = 1 - TERS.normalIndex;
          break;
        case "instantDeath":
          enemyConfig = TERS.isEnabledInstantDeath ? TERS.maxIndex - TERS.normalIndex : NaN;
          break;
        default:
          enemyConfig = Number(enemyConfigRaw?.trim().replace("!", ""));
      }
      /**
       * @type {string}
       */
      const classConfigRaw = cls.meta[`elementRank_${i}`];
      let classConfig = classConfigRaw?.trim().replace("!", "");
      switch (classConfig) {
        case undefined:
          classConfig = NaN;
          break;
        case "absorb":
          classConfig = TERS.isEnabledAbsorb ? 0 - TERS.normalIndex : NaN;
          break;
        case "null":
        case null:
          classConfig = 1 - TERS.normalIndex;
          break;
        case "instantDeath":
          classConfig = TERS.isEnabledInstantDeath ? TERS.maxIndex - TERS.normalIndex : NaN;
          break;
        default:
          classConfig = Number(classConfigRaw?.trim().replace("!", ""));
      }

      if (Number.isNaN(enemyConfig) && Number.isNaN(classConfig)) continue;

      if (!Number.isNaN(enemyConfig)) {
        value += enemyConfig;
      }
      if (!enemyConfigRaw.includes("!") && !Number.isNaN(classConfig)) {
        if (classConfigRaw.includes("!")) {
          value = TERS.normalIndex + classConfig;
        } else {
          value += classConfig;
        }
      }

      this._elementRanks[i] = value.clamp(0, TERS.maxIndex);
    }

    console.debug(enemy.name, this._elementRanks);
  };

  Game_Enemy.prototype.elementRate = function (elementId) {
    return Game_BattlerBase.prototype.elementRate.apply(this, arguments);
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Windows
  // -------------------------------------------------------------------------------------------------------------------
})();
