/// <reference path="./T_ElementRankSystem.d.ts" />
//=============================================================================
// RPG Maker MZ - T_ElementRankSystem
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 動的に属性耐性レベルを上下させるシステムを導入するプラグイン
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
 *
 * @param WeakRanks
 *   @text 弱点段階
 *   @desc 通常(倍率1倍)と即死(倍率+∞)の間の弱点段階を定義する
 *   @type struct<CustomRank>[]
 *   @default ["{\"key\":\"weak\",\"name\":\"弱点\",\"rate\":\"1.5\"}"]
 *
 * @param NormalRankName
 *   @text 通常段階名
 *   @desc 倍率1倍の段階の表示名を定義する
 *   @type string
 *   @default 通常
 *
 * @param AbsorbRank
 *   @text 吸収段階
 *   @desc ダメージを吸収する段階を定義する
 *   @type struct<AbsorbRank>
 *   @default {"rate":"-1","isEnabled":"true"}
 *
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
 * - 従来の属性有効度の設定はすべて無視されます
 *
 * ================
 * Version History
 * ================
 * Ver.   Date        Desc.
 * 0.0.1  yyyy/MM/dd  初版作成
 */

/*~struct~CustomRank:
 * @param key
 *   @text 属性有効段階キー
 *   @desc
 *   @type string
 *
 * @param name
 *   @text 属性有効段階名
 *   @desc
 *   @type string
 *
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
 *
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
 *
 * @param isEnabled
 *   @text 有効
 *   @desc 属性有効度を指定する
 *   @type boolean
 *   @on 有効
 *   @off 無効
 *   @default on
 */

"use strict";

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
  class Window_AnalysisToggle extends Window_HorzCommand {
    initialize(rect) {
      super.initialize(rect);
      this._openness = 0;
      this.deactivate();
      this.deselect();
    }

    maxCols() {
      return 2;
    }

    makeCommandList() {
      this.addCommand("敵の情報", "enemy");
      this.addCommand("味方の情報", "actor");
    }
  }

  class Window_BattleAnalysis extends Window_Selectable {
    /**
     *
     * @param {Rectangle} rect
     */
    initialize(rect) {
      super.initialize(rect);
      this._battler = null;
      this.openness = 0;
      this.deactivate();
    }

    get battler() {
      return this._battler;
    }

    /**
     * @param {Game_Actor | Game_Enemy} battler
     */
    set battler(battler) {
      this._battler = battler;
      this.refresh();
    }

    // Window_Selectableのデフォルトカーソル表示等を無効化
    maxItems() {
      return 0;
    }

    onTouch() {}

    refresh() {
      this.contents.clear();
      if (!this._battler) return;

      const b = this._battler;
      let y = 0;

      // 名前・識別表示
      const sideText = b.isActor() ? "【味方】" : "【敵】";
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(`${sideText} ${b.name()} の解析情報`, 0, y, this.contentsWidth(), "left");
      y += this.lineHeight();
      this.drawHorzLine(y);
      y += 10;

      // --- ステートの表示 ---
      this.changeTextColor(ColorManager.systemColor());
      this.drawText("【付与されているステート】", 0, y, this.contentsWidth());
      y += this.lineHeight();

      const states = b.states();
      if (states.length === 0) {
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(" なし", 10, y, this.contentsWidth());
        y += this.lineHeight();
      } else {
        let x = 10;
        states.forEach((state) => {
          this.drawIcon(state.iconIndex, x, y);
          this.changeTextColor(ColorManager.normalColor());
          this.drawText(state.name, x + 36, y, 150);
          x += 200;
          if (x > this.contentsWidth() - 150) {
            x = 10;
            y += this.lineHeight();
          }
        });
        if (x !== 10) y += this.lineHeight();
      }

      y += 10;

      // --- 耐性情報の表示 ---
      this.changeTextColor(this.systemColor());
      this.drawText("【現在の属性耐性】", 0, y, this.contentsWidth());
      y += this.lineHeight();

      for (let elementId = 0; elementId < $dataSystem.elements.length; elementId++) {
        const elementName = $dataSystem.elements[elementId];
        let rankText = "通常";
        let rate = 1.0;
        if (b._elementRanks !== undefined) {
          const rank = TERS.elementRanks[b._elementRanks[elementId]];
          rankText = rank.name;
          rate = rank.rate;
        } else {
          // ツクール標準の計算値（プラグインの変動も反映された最終有効度）
          rate = b.elementRate(elementId);

          if (rate < 0) rankText = "吸収";
          else if (rate === 0) rankText = "無効";
          else if (rate < 1.0) rankText = "耐性";
          else if (rate > 1.0) rankText = "弱点";
        }

        this.changeTextColor(ColorManager.normalColor());
        this.drawText(` ${elementName}属性:`, 10, y, 150);

        // 倍率に応じて色を変える演出
        if (rate < 1.0) this.changeTextColor(ColorManager.powerUpColor()); // 味方に有利/敵が堅い
        if (rate > 1.0) this.changeTextColor(ColorManager.powerDownColor()); // 弱点
        if (rate === Infinity) {
          this.drawText(`${rankText}`, 160, y, 200);
        } else {
          this.drawText(`${rankText} (${Math.floor(rate * 100)}%)`, 160, y, 200);
        }

        y += this.lineHeight();
      }
    }

    drawHorzLine(y) {
      this.contents.fillRect(0, y, this.contentsWidth(), 2, ColorManager.normalColor());
    }
  }

  // ----------------------------------------------------------------------------
  // Window_BattleLog
  // ----------------------------------------------------------------------------
  Window_BattleLog.prototype.displayActionResults = function (subject, target) {
    const result = target.result();
    const instantDeathCondition =
      target.isDead() && result.isStatusAffected(target.deathStateId()) && target._instantDeath;

    if (target.result().used) {
      this.push("pushBaseLine");
      this.displayCritical(target);
      if (!instantDeathCondition) {
        this.push("popupDamage", target);
      }
      this.push("popupDamage", subject);
      if (!instantDeathCondition) {
        this.displayDamage(target);
      }
      this.displayAffectedStatus(target);
      this.displayFailure(target);
      this.push("waitForNewLine");
      this.push("popBaseLine");
    }
  };

  // ----------------------------------------------------------------------------
  // Window_PartyCommand
  // ----------------------------------------------------------------------------
  // パーティコマンドに「情報確認」を追加
  const _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
  Window_PartyCommand.prototype.makeCommandList = function () {
    _Window_PartyCommand_makeCommandList.call(this);
    this.addCommand("情報確認", "analysis");
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Scenes
  // -------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // Scene_Battle
  // ----------------------------------------------------------------------------
  const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function () {
    _Scene_Battle_createAllWindows.call(this);
    this.createAnalysisToggleWindow();
    this.createAnalysisInfoWindow();
  };

  Scene_Battle.prototype.createAnalysisToggleWindow = function () {
    const rect = this.analysisToggleWindowRect();
    this._analysisToggleWindow = new Window_AnalysisToggle(rect);

    // トグルウィンドウのハンドラ紐付け
    this._analysisToggleWindow.setHandler("enemy", this.onAnalysisToggleOk.bind(this, "enemy"));
    this._analysisToggleWindow.setHandler("actor", this.onAnalysisToggleOk.bind(this, "actor"));
    this._analysisToggleWindow.setHandler("cancel", this.onAnalysisToggleCancel.bind(this));

    this.addWindow(this._analysisToggleWindow);
  };

  /**
   * 情報確認ウィンドウ作成
   */
  Scene_Battle.prototype.createAnalysisInfoWindow = function () {
    const rect = this.analysisInfoWindowRect();
    this._analysisInfoWindow = new Window_BattleAnalysis(rect);
    // 情報ウィンドウ自体にキャンセル時の挙動を設定
    this._analysisInfoWindow.setHandler("cancel", this.onAnalysisInfoCancel.bind(this));
    this.addWindow(this._analysisInfoWindow);
  };

  // バトルシーンでのコマンド処理とハンドラ紐付け
  const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
  Scene_Battle.prototype.createPartyCommandWindow = function () {
    _Scene_Battle_createPartyCommandWindow.call(this);
    this._partyCommandWindow.setHandler("analysis", this.commandAnalysis.bind(this));
  };

  /**
   *
   * @returns {Rectangle}
   */
  Scene_Battle.prototype.analysisToggleWindowRect = function () {
    const ww = 400;
    const wh = this.calcWindowHeight(1, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 40; // 画面上部寄りに配置

    return new Rectangle(wx, wy, ww, wh);
  };

  /**
   *
   * @returns {Rectangle}
   */
  Scene_Battle.prototype.analysisInfoWindowRect = function () {
    const wx = 100;
    const wy = 60;
    const ww = Graphics.boxWidth - 200;
    const wh = Graphics.boxHeight - 160;

    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_Battle.prototype.commandAnalysis = function () {
    this._partyCommandWindow.deactivate();

    // 情報確認が選ばれたら、まずは上部のトグルウィンドウをアクティブにする
    this._analysisToggleWindow.show();
    this._analysisToggleWindow.open();
    this._analysisToggleWindow.activate();
    this._analysisToggleWindow.select(0);

    // ターゲットウィンドウ側の決定・キャンセルハンドラを情報確認用に紐付け
    this._actorWindow.setHandler("ok", this.onAnalysisTargetOk.bind(this, "actor"));
    this._actorWindow.setHandler("cancel", this.onAnalysisTargetCancel.bind(this));
    this._enemyWindow.setHandler("ok", this.onAnalysisTargetOk.bind(this, "enemy"));
    this._enemyWindow.setHandler("cancel", this.onAnalysisTargetCancel.bind(this));
  };

  // パーティコマンドが「情報確認」かどうかを判定するヘルパー（既存のコマンド定義に合わせて調整してください）
  Scene_Battle.prototype.isCurrentCommandAnalysis = function () {
    return this._partyCommandWindow.currentSymbol() === "analysis";
  };

  /**
   *
   * @param {Window_BattleActor | Window_BattleEnemy} oldWindow
   * @param {Window_BattleActor | Window_BattleEnemy} newWindow
   * @param {"left" | "right" | undefined} from
   */
  Scene_Battle.prototype.selectSelectionForAnalysis = function (oldWindow, newWindow, from) {
    oldWindow.hide();
    oldWindow.deactivate();
    oldWindow.deselect();

    newWindow.refresh();
    newWindow.show();

    // 戻ってきた時は一番右端（最後のアクターから左で戻るため、右端のエネミー）を選択
    const lastIndex = Math.max(0, newWindow.maxItems() - 1);
    const targetIndex = from === "left" ? lastIndex : 0;

    newWindow.select(targetIndex);
    this._analysisCurrentIndex = targetIndex;
    newWindow.activate();

    if (newWindow === this._enemyWindow) {
      this._analysisToggleWindow.select(0);
    } else {
      this._analysisToggleWindow.select(1);
    }
  };

  // 敵・味方のターゲット選択中に左右キーでの切り替えを監視
  let current = 0;
  const _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    _Scene_Battle_update.call(this);

    // 詳細情報ウィンドウが閉じていて、選択中のときのみ切り替え判定を行う
    if (this._analysisInfoWindow && !this._analysisInfoWindow.isOpen()) {
      const [activeWindow, inactiveWindow] = this._enemyWindow.active
        ? [this._enemyWindow, this._actorWindow]
        : this._actorWindow.active
          ? [this._actorWindow, this._enemyWindow]
          : [undefined, undefined];

      if (activeWindow) {
        // -------------------------------------------------------------
        // 既存のキーボード（左右キー）による切り替え処理
        // -------------------------------------------------------------
        // 移動後のインデックスであることに注意
        const index = activeWindow.index();
        const maxCols = activeWindow.maxCols();
        if (Input.isTriggered("right")) {
          // 横並びの右端、またはリスト全体の末尾にいるかチェック
          if (current === maxCols - 1 || (current + 1) % maxCols === 0) {
            this.selectSelectionForAnalysis(activeWindow, inactiveWindow, "right");
            SoundManager.playCursor();
          }
        } else if (Input.isTriggered("left")) {
          // 横並びの左端、またはリスト全体の冒頭にいるかチェック
          if (current === 0 || current % maxCols === 0) {
            this.selectSelectionForAnalysis(activeWindow, inactiveWindow, "left");
            SoundManager.playCursor();
          }
        } else {
          current = index;
        }
      }
    }
  };

  Scene_Battle.prototype.onAnalysisToggleOk = function (type) {
    this._analysisToggleWindow.deactivate();

    if (type === "enemy") {
      this._actorWindow.deactivate();
      this._actorWindow.deselect();
      this._actorWindow.hide();

      this._enemyWindow.refresh();
      this._enemyWindow.show();
      this._enemyWindow.activate();
      this._enemyWindow.select(0);
    } else {
      this._enemyWindow.deactivate();
      this._enemyWindow.deselect();
      this._enemyWindow.hide();

      this._actorWindow.refresh();
      this._actorWindow.show();
      this._actorWindow.activate();
      this._actorWindow.select(0);
    }
  };

  // ボタン選択中にキャンセルされたらパーティコマンドに戻る
  Scene_Battle.prototype.onAnalysisToggleCancel = function () {
    this._analysisToggleWindow.close();
    this._analysisToggleWindow.hide();
    this._analysisToggleWindow.deselect();
    this._partyCommandWindow.activate();
  };

  // ターゲットが決定されたら、情報をセットしてウィンドウを開く
  Scene_Battle.prototype.onAnalysisTargetOk = function (type) {
    const target = type === "enemy" ? this._enemyWindow.enemy() : $gameParty.battleMembers()[this._actorWindow.index()];
    if (target) {
      // 選択ウィンドウの入力を一時停止
      this._enemyWindow.deactivate();
      this._actorWindow.deactivate();

      // 情報ウィンドウを表示してアクティブ化
      this._analysisInfoWindow.battler = target;
      this._analysisInfoWindow.open();
      this._analysisInfoWindow.activate();
    } else {
      this.onAnalysisTargetCancel();
    }
  };

  // ターゲット選択中にキャンセルされたらパーティコマンドに戻る
  Scene_Battle.prototype.onAnalysisTargetCancel = function () {
    this._enemyWindow.hide();
    this._enemyWindow.deactivate();
    this._enemyWindow.deselect();

    this._actorWindow.hide();
    this._actorWindow.deactivate();
    this._actorWindow.deselect();

    if (this._analysisInfoWindow) this._analysisInfoWindow.close();
    this._analysisToggleWindow.activate();
  };

  // 情報ウィンドウ側でキャンセル（戻る）された時の処理
  Scene_Battle.prototype.onAnalysisInfoCancel = function () {
    this._analysisInfoWindow.close();
    this._analysisInfoWindow.deactivate();

    // 直前にアクティブだった方の選択ウィンドウを再開
    if (this._enemyWindow.visible) {
      this._enemyWindow.activate();
    } else {
      this._actorWindow.activate();
    }
  };

  // 各ターゲットウィンドウ（敵・味方）でのキャンセル処理を上書き
  // ターゲット選択中にキャンセルしたら、上のトグルボタン選択に戻す
  const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
  Scene_Battle.prototype.onEnemyCancel = function () {
    if (this.isCurrentCommandAnalysis()) {
      this.onAnalysisTargetCancel();
    } else {
      // 通常のスキル対象選択などの挙動
      _Scene_Battle_onEnemyCancel.call(this);
    }
  };

  const _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
  Scene_Battle.prototype.onActorCancel = function () {
    if (this.isCurrentCommandAnalysis()) {
      this.onAnalysisTargetCancel();
    } else {
      _Scene_Battle_onActorCancel.call(this);
    }
  };
})();
