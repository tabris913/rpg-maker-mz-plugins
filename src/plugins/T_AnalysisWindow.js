//=============================================================================
// RPG Maker MZ - T_AnalysisWindow
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 戦闘中の情報を確認するウィンドウを追加するプラグイン
 * @author tosshie
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter T_ElementRankSystem
 *
 * @param showEnemyHpMp
 *   @text 敵HP/MP表示
 *   @desc ONにすると敵キャラのHP/MPを表示します
 *   @type boolean
 *   @on 表示
 *   @off 非表示
 *   @default false
 *
 * @param showEnemyParamChange
 *   @text 敵能力値変動表示
 *   @desc ONにすると敵キャラの能力値変動（基本値→現在値）を表示します
 *   @type boolean
 *   @on 表示
 *   @off 非表示
 *   @default false
 *
 * @help
 * ================================
 * T_AnalysisWindow.js [ja] v1.0.0
 * ================================
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
 *
 * @type {GlobalTAW}
 */
const TAW = {};

// ---------------------------------------------------------------------------------------------------------------------
// Parameters
// ---------------------------------------------------------------------------------------------------------------------
/**
 * プラグインパラメータ処理
 *
 * @param {HTMLOrSVGScriptElement | null} script
 */
TAW.readParams = (script) => {
  const params = PluginManagerEx.createParameter(script);

  TAW.isEnableTCP = typeof TCP !== "undefined";
  TAW.showEnemyHpMp = params.showEnemyHpMp;
  TAW.showEnemyParamChange = params.showEnemyParamChange;
};

// ---------------------------------------------------------------------------------------------------------------------
// Plugin main
// ---------------------------------------------------------------------------------------------------------------------
(() => {
  const script = document.currentScript;
  TAW.readParams(script);

  // -------------------------------------------------------------------------------------------------------------------
  // Scenes
  // -------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // Scene_Battle
  // ----------------------------------------------------------------------------

  // 情報確認用のウィンドウを戦闘シーンに追加する
  const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function () {
    _Scene_Battle_createAllWindows.call(this);
    this.createAnalysisToggleWindow();
    this.createAnalysisInfoWindow();
  };

  /**
   * 敵/味方切り替え用トグルウィンドウを作成する
   */
  Scene_Battle.prototype.createAnalysisToggleWindow = function () {
    const rect = this.analysisToggleWindowRect();
    this._analysisToggleWindow = new Window_AnalysisToggle(rect);
    this._analysisToggleWindow.setHandler("enemy", this.onAnalysisToggleOk.bind(this, "enemy"));
    this._analysisToggleWindow.setHandler("actor", this.onAnalysisToggleOk.bind(this, "actor"));
    this._analysisToggleWindow.setHandler("cancel", this.onAnalysisToggleCancel.bind(this));
    this.addWindow(this._analysisToggleWindow);
  };

  /**
   * 情報確認ウィンドウを作成する
   */
  Scene_Battle.prototype.createAnalysisInfoWindow = function () {
    const rect = this.analysisInfoWindowRect();
    this._analysisInfoWindow = new Window_BattleAnalysis(rect);
    this._analysisInfoWindow.setHandler("cancel", this.onAnalysisInfoCancel.bind(this));
    this.addWindow(this._analysisInfoWindow);
  };

  // パーティコマンドに「情報確認」ハンドラを紐付ける
  const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
  Scene_Battle.prototype.createPartyCommandWindow = function () {
    _Scene_Battle_createPartyCommandWindow.call(this);
    this._partyCommandWindow.setHandler("analysis", this.commandAnalysis.bind(this));
  };

  /**
   * @returns {Rectangle}
   */
  Scene_Battle.prototype.analysisToggleWindowRect = function () {
    const ww = 400;
    const wh = this.calcWindowHeight(1, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 40;
    return new Rectangle(wx, wy, ww, wh);
  };

  /**
   * @returns {Rectangle}
   */
  Scene_Battle.prototype.analysisInfoWindowRect = function () {
    const wx = 100;
    const wy = 60;
    const ww = Graphics.boxWidth - 200;
    const wh = Graphics.boxHeight - 160;
    return new Rectangle(wx, wy, ww, wh);
  };

  /**
   * 「情報確認」コマンド選択時の処理
   */
  Scene_Battle.prototype.commandAnalysis = function () {
    this._partyCommandWindow.deactivate();
    this._analysisToggleWindow.show();
    this._analysisToggleWindow.open();
    this._analysisToggleWindow.activate();
    this._analysisToggleWindow.select(0);
    this._actorWindow.setHandler("ok", this.onAnalysisTargetOk.bind(this, "actor"));
    this._actorWindow.setHandler("cancel", this.onAnalysisTargetCancel.bind(this));
    this._enemyWindow.setHandler("ok", this.onAnalysisTargetOk.bind(this, "enemy"));
    this._enemyWindow.setHandler("cancel", this.onAnalysisTargetCancel.bind(this));
  };

  /**
   * @returns {boolean}
   */
  Scene_Battle.prototype.isCurrentCommandAnalysis = function () {
    return this._partyCommandWindow.currentSymbol() === "analysis";
  };

  /**
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

  // 情報確認モードで敵・味方の選択ウィンドウ間を左右キーで切り替えられるようにする
  let current = 0;
  const _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function () {
    _Scene_Battle_update.call(this);

    if (this._analysisInfoWindow && !this._analysisInfoWindow.isOpen()) {
      const [activeWindow, inactiveWindow] = this._enemyWindow.active
        ? [this._enemyWindow, this._actorWindow]
        : this._actorWindow.active
          ? [this._actorWindow, this._enemyWindow]
          : [undefined, undefined];

      if (activeWindow) {
        const index = activeWindow.index();
        const maxCols = activeWindow.maxCols();
        if (Input.isTriggered("right")) {
          if (current === maxCols - 1 || (current + 1) % maxCols === 0) {
            this.selectSelectionForAnalysis(activeWindow, inactiveWindow, "right");
            SoundManager.playCursor();
          }
        } else if (Input.isTriggered("left")) {
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

  /**
   * @param {"actor" | "enemy"} type
   */
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

  /** トグル選択中のキャンセル処理 */
  Scene_Battle.prototype.onAnalysisToggleCancel = function () {
    this._analysisToggleWindow.close();
    this._analysisToggleWindow.hide();
    this._analysisToggleWindow.deselect();
    this._partyCommandWindow.activate();
  };

  /**
   * @param {"actor" | "enemy"} type
   */
  Scene_Battle.prototype.onAnalysisTargetOk = function (type) {
    const target = type === "enemy" ? this._enemyWindow.enemy() : $gameParty.battleMembers()[this._actorWindow.index()];
    if (target) {
      this._enemyWindow.deactivate();
      this._actorWindow.deactivate();
      this._analysisInfoWindow.battler = target;
      this._analysisInfoWindow.open();
      this._analysisInfoWindow.activate();
    } else {
      this.onAnalysisTargetCancel();
    }
  };

  /** ターゲット選択中のキャンセル処理 */
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

  /** 情報ウィンドウでのキャンセル処理 */
  Scene_Battle.prototype.onAnalysisInfoCancel = function () {
    this._analysisInfoWindow.close();
    this._analysisInfoWindow.deactivate();
    if (this._enemyWindow.visible) {
      this._enemyWindow.activate();
    } else {
      this._actorWindow.activate();
    }
  };

  // 情報確認モード中のキャンセルはトグル選択に戻す
  const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
  Scene_Battle.prototype.onEnemyCancel = function () {
    if (this.isCurrentCommandAnalysis()) {
      this.onAnalysisTargetCancel();
    } else {
      _Scene_Battle_onEnemyCancel.call(this);
    }
  };

  // 情報確認モード中のキャンセルはトグル選択に戻す
  const _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
  Scene_Battle.prototype.onActorCancel = function () {
    if (this.isCurrentCommandAnalysis()) {
      this.onAnalysisTargetCancel();
    } else {
      _Scene_Battle_onActorCancel.call(this);
    }
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Windows
  // -------------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // Window_AnalysisToggle
  // ----------------------------------------------------------------------------
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

  // ----------------------------------------------------------------------------
  // Window_BattleAnalysis
  // ----------------------------------------------------------------------------
  class Window_BattleAnalysis extends Window_Selectable {
    /**
     * @param {Rectangle} rect
     */
    initialize(rect) {
      super.initialize(rect);
      this._battler = null;
      this._pageIndex = 0;
      this._contentHeight = 0;
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
      this._pageIndex = 0;
      this.scrollTo(0, 0);
      this.refresh();
    }

    // スクロール対応: コンテンツ全体の高さを返す
    overallHeight() {
      return Math.max(this._contentHeight, this.innerHeight);
    }

    // カーソル表示を無効化する
    maxItems() {
      return 0;
    }

    // タッチ操作を無効化する
    onTouch() {}

    refresh() {
      // まず高さを計算するためにダミー描画
      this._contentHeight = this.calcContentHeight();
      this.contents.resize(this.contentsWidth(), this.overallHeight());
      this.contents.clear();
      if (!this._battler) return;

      this.drawPageHeader();

      if (this._battler.isActor()) {
        switch (this._pageIndex) {
          case 0:
            this.drawStatusPage();
            break;
          case 1:
            this.drawEquipPage();
            break;
          case 2:
            this.drawResistPage();
            break;
        }
      } else {
        switch (this._pageIndex) {
          case 0:
            this.drawEnemyStatusPage();
            break;
          case 1:
            this.drawResistPage();
            break;
        }
      }
    }

    /**
     * コンテンツの高さを事前計算する
     * @returns {number}
     */
    calcContentHeight() {
      if (!this._battler) return this.innerHeight;

      if (this._battler.isActor()) {
        switch (this._pageIndex) {
          case 0: {
            const count = TAW.isEnableTCP ? TCP.paramsDef.length : 8;
            return this.lineHeight() + count * this.lineHeight() + this.lineHeight();
          }
          case 1: {
            const equips = this._battler.equips();
            return this.lineHeight() + equips.length * this.lineHeight() + this.lineHeight();
          }
          case 2:
            return this.calcResistPageHeight();
        }
      } else {
        switch (this._pageIndex) {
          case 0:
            return this.calcEnemyStatusPageHeight();
          case 1:
            return this.calcResistPageHeight();
        }
      }
      return this.innerHeight;
    }

    calcEnemyStatusPageHeight() {
      let lines = 1; // header
      if (TAW.showEnemyHpMp) {
        lines += 2;
      } else {
        lines += 2;
      }
      lines += 1; // spacing

      if (TAW.showEnemyParamChange) {
        lines += 1; // section header
        const count = TAW.isEnableTCP ? TCP.paramsDef.length : 8;
        lines += count;
        lines += 1; // spacing
      }

      if (!TAW.showEnemyParamChange) {
        lines += 1; // section header
        const count = TAW.isEnableTCP ? TCP.paramsDef.length : 8;
        // worst case: all have buffs
        lines += count;
      }
      return (lines + 2) * this.lineHeight();
    }

    calcResistPageHeight() {
      let lines = 3; // header + line + states header
      const states = this._battler.states();
      lines += Math.max(1, Math.ceil(states.length / Math.floor(this.contentsWidth() / 200)));
      lines += 1; // spacing
      if (typeof TERS !== "undefined") {
        lines += 1; // element header
        lines += $dataSystem.elements.length;
      }
      return (lines + 2) * this.lineHeight();
    }

    // 上下キーでスクロール、左右キー/Q/W/L/Rでページ切り替えを行う
    update() {
      super.update();
      if (this.active) {
        if (Input.isRepeated("right") || Input.isTriggered("pagedown")) {
          this.changePage(1);
        } else if (Input.isRepeated("left") || Input.isTriggered("pageup")) {
          this.changePage(-1);
        } else if (Input.isRepeated("down")) {
          this.smoothScrollDown(1);
        } else if (Input.isRepeated("up")) {
          this.smoothScrollUp(1);
        }
      }
    }

    /**
     * @param {number} delta
     */
    changePage(delta) {
      const pageCount = this._battler.isActor() ? 3 : 2;
      this._pageIndex = (this._pageIndex + delta + pageCount) % pageCount;
      this.scrollTo(0, 0);
      SoundManager.playCursor();
      this.refresh();
    }

    /**
     * @param {number} y
     */
    drawHorzLine(y) {
      this.contents.fillRect(0, y, this.contentsWidth(), 2, ColorManager.normalColor());
    }

    drawPageHeader() {
      const pages = this._battler.isActor()
        ? ["【詳細ステータス】", "【装備情報】", "【耐性情報】"]
        : ["【詳細ステータス】", "【耐性情報】"];
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(pages[this._pageIndex], 0, 0, this.contentsWidth(), "center");
      this.resetTextColor();
      this.drawText("Q/W(L/R):ページ切替", 0, 0, this.contentsWidth(), "right");
    }

    drawStatusPage() {
      const target = this._battler;
      const x = this.itemPadding();
      let y = this.lineHeight();

      const count = TAW.isEnableTCP ? TCP.paramsDef.length : 8;
      for (let i = 0; i < count; i++) {
        let paramName, baseVal, currentVal, buffLevel;
        if (TAW.isEnableTCP) {
          const param = TCP.paramsDef[i];
          paramName = param.nameId === undefined ? param.name : TextManager.param(param.nameId);
          switch (param.type) {
            case "param":
              baseVal = Math.round(
                (target.paramBasePlus(param.paramId) * target.paramRate(param.paramId)).clamp(
                  param.min ?? (param.paramId === 0 ? 1 : 0),
                  param.max ?? Infinity,
                ),
              );
              currentVal = target.param(param.paramId);
              buffLevel = target.buff(param.paramId);
              break;
            case "xparam":
              baseVal = (target.xparamBasePlus(param.paramId) * target.xparamRate(param.paramId)).clamp(0, 1);
              currentVal = target.xparam(param.paramId);
              buffLevel = target._xbuffs[param.paramId];
              break;
            case "sparam":
              baseVal = (target.sparamBasePlus(param.paramId) * target.sparamRate(param.paramId)).clamp(0, 1);
              currentVal = target.sparam(param.paramId);
              buffLevel = target._sbuffs[param.paramId];
              break;
            case "cparam":
              baseVal = target.cparamBasePlus(param.paramId) * target.cparamRate(param.paramId);
              if (param.isRate) {
                baseVal = baseVal.clamp(0, Infinity);
              } else {
                baseVal = Math.round(baseVal.clamp(param.min, param.max ?? Infinity));
              }
              currentVal = target.cparam(param.paramId);
              buffLevel = target.customBuff(param.paramId);
              break;
            case "":
              baseVal = (target.crdBasePlus() * target.crdRate()).clamp(0, Infinity);
              currentVal = target.crd();
              buffLevel = target._crdBuff;
              break;
          }
          if (param.isRate) {
            baseVal = `${Math.round(baseVal * 100)} %`;
            currentVal = `${Math.round(currentVal * 100)} %`;
          }
        } else {
          paramName = TextManager.param(i);
          baseVal = Math.round(
            (target.paramBasePlus(i) * target.paramRate(i)).clamp(target.paramMin(i), target.paramMax()),
          );
          currentVal = target.param(i);
          buffLevel = target.buff(i);
        }
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(paramName, x, y, 120);
        this.resetTextColor();
        this.drawText(baseVal, x + 130, y, 60, "right");
        if (buffLevel !== 0) {
          this.drawText("→", x + 190, y, 40, "center");
          if (currentVal > baseVal) this.changeTextColor(ColorManager.powerUpColor());
          if (currentVal < baseVal) this.changeTextColor(ColorManager.powerDownColor());
          this.drawText(currentVal, x + 230, y, 70, "right");
          this.resetTextColor();
          const iconIndex = buffLevel > 0 ? 32 + i : 48 + i;
          this.drawIcon(iconIndex, x + 310, y + 2);
          const mark = buffLevel > 0 ? "▲".repeat(buffLevel) : "▼".repeat(Math.abs(buffLevel));
          this.drawText(mark, x + 345, y, 60);
        }
        y += this.lineHeight();
      }
    }

    drawEnemyStatusPage() {
      const target = this._battler;
      const x = this.itemPadding();
      let y = this.lineHeight();

      if (TAW.showEnemyHpMp) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.basic(2), x, y, 60);
        this.resetTextColor();
        this.drawText(`${target.hp} / ${target.mhp}`, x + 70, y, 200);
        y += this.lineHeight();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.basic(4), x, y, 60);
        this.resetTextColor();
        this.drawText(`${target.mp} / ${target.mmp}`, x + 70, y, 200);
      } else {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("【与えたダメージ】", x, y, this.contentsWidth());
        y += this.lineHeight();
        this.resetTextColor();
        this.drawText(`HP: ${target.mhp - target.hp}`, x + 10, y, this.contentsWidth());
      }
      y += this.lineHeight() + 10;

      if (TAW.showEnemyParamChange) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("【能力値】", x, y, this.contentsWidth());
        y += this.lineHeight();

        const count = TAW.isEnableTCP ? TCP.paramsDef.length : 8;
        for (let i = 0; i < count; i++) {
          let paramName, baseVal, currentVal, buffLevel;
          if (TAW.isEnableTCP) {
            const param = TCP.paramsDef[i];
            paramName = param.nameId === undefined ? param.name : TextManager.param(param.nameId);
            switch (param.type) {
              case "param":
                baseVal = Math.round(
                  (target.paramBasePlus(param.paramId) * target.paramRate(param.paramId)).clamp(
                    param.min ?? (param.paramId === 0 ? 1 : 0),
                    param.max ?? Infinity,
                  ),
                );
                currentVal = target.param(param.paramId);
                buffLevel = target.buff(param.paramId);
                break;
              case "xparam":
                baseVal = (target.xparamBasePlus(param.paramId) * target.xparamRate(param.paramId)).clamp(0, 1);
                currentVal = target.xparam(param.paramId);
                buffLevel = target._xbuffs[param.paramId];
                break;
              case "sparam":
                baseVal = (target.sparamBasePlus(param.paramId) * target.sparamRate(param.paramId)).clamp(0, 1);
                currentVal = target.sparam(param.paramId);
                buffLevel = target._sbuffs[param.paramId];
                break;
              case "cparam":
                baseVal = target.cparamBasePlus(param.paramId) * target.cparamRate(param.paramId);
                if (param.isRate) baseVal = baseVal.clamp(0, Infinity);
                else baseVal = Math.round(baseVal.clamp(param.min, param.max ?? Infinity));
                currentVal = target.cparam(param.paramId);
                buffLevel = target.customBuff(param.paramId);
                break;
              case "":
                baseVal = (target.crdBasePlus() * target.crdRate()).clamp(0, Infinity);
                currentVal = target.crd();
                buffLevel = target._crdBuff;
                break;
            }
            if (param.isRate) {
              baseVal = `${Math.round(baseVal * 100)} %`;
              currentVal = `${Math.round(currentVal * 100)} %`;
            }
          } else {
            paramName = TextManager.param(i);
            baseVal = Math.round(
              (target.paramBasePlus(i) * target.paramRate(i)).clamp(target.paramMin(i), target.paramMax()),
            );
            currentVal = target.param(i);
            buffLevel = target.buff(i);
          }
          this.changeTextColor(ColorManager.systemColor());
          this.drawText(paramName, x, y, 120);
          this.resetTextColor();
          this.drawText(baseVal, x + 130, y, 60, "right");
          this.drawText("→", x + 190, y, 40, "center");
          if (currentVal > baseVal) this.changeTextColor(ColorManager.powerUpColor());
          if (currentVal < baseVal) this.changeTextColor(ColorManager.powerDownColor());
          this.drawText(currentVal, x + 230, y, 70, "right");
          this.resetTextColor();
          if (buffLevel !== 0) {
            const iconIndex = buffLevel > 0 ? 32 + i : 48 + i;
            this.drawIcon(iconIndex, x + 310, y + 2);
            const mark = buffLevel > 0 ? "▲".repeat(buffLevel) : "▼".repeat(Math.abs(buffLevel));
            this.drawText(mark, x + 345, y, 60);
          }
          y += this.lineHeight();
        }
        y += 10;
      }

      if (!TAW.showEnemyParamChange) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("【バフ/デバフ】", x, y, this.contentsWidth());
        y += this.lineHeight();

        const count = TAW.isEnableTCP ? TCP.paramsDef.length : 8;
        let hasAnyBuff = false;
        for (let i = 0; i < count; i++) {
          let paramName, buffLevel;
          if (TAW.isEnableTCP) {
            const param = TCP.paramsDef[i];
            paramName = param.name;
            switch (param.type) {
              case "param":
                buffLevel = target.buff(param.paramId);
                break;
              case "xparam":
                buffLevel = target._xbuffs[param.paramId];
                break;
              case "sparam":
                buffLevel = target._sbuffs[param.paramId];
                break;
              case "cparam":
                buffLevel = target.customBuff(param.paramId);
                break;
              case "":
                buffLevel = target._crdBuff;
                break;
            }
          } else {
            paramName = TextManager.param(i);
            buffLevel = target.buff(i);
          }
          if (buffLevel !== 0) {
            hasAnyBuff = true;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(paramName, x, y, 120);
            const iconIndex = buffLevel > 0 ? 32 + i : 48 + i;
            this.drawIcon(iconIndex, x + 130, y + 2);
            const mark = buffLevel > 0 ? "▲".repeat(buffLevel) : "▼".repeat(Math.abs(buffLevel));
            if (buffLevel > 0) this.changeTextColor(ColorManager.powerUpColor());
            else this.changeTextColor(ColorManager.powerDownColor());
            this.drawText(mark, x + 170, y, 60);
            this.resetTextColor();
            y += this.lineHeight();
          }
        }
        if (!hasAnyBuff) {
          this.resetTextColor();
          this.drawText("なし", x + 10, y, this.contentsWidth());
          y += this.lineHeight();
        }
      }
    }

    drawEquipPage() {
      const target = this._battler;
      if (!target.isActor()) return;

      const equips = target.equips();
      const slots = target.equipSlots();
      let y = this.lineHeight();
      const x = this.itemPadding();

      equips.forEach((item, index) => {
        const slotName = $dataSystem.equipTypes[slots[index]] || "";
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(slotName, x, y, 100);
        this.resetTextColor();
        if (item) {
          this.drawItemName(item, x + 110, y, this.contentsWidth() - x * 2 - 110);
          let bonusDesc = "";
          for (let i = 0; i < 8; i++) {
            const p = item.params[i];
            if (p !== 0) {
              bonusDesc += ` ${TextManager.param(i).charAt(0)}:${p > 0 ? "+" : ""}${p}`;
            }
          }
          this.contents.fontSize = 16;
          this.drawText(bonusDesc, x, y, this.contentsWidth() - x - 10, "right");
          this.contents.fontSize = $gameSystem.mainFontSize();
        } else {
          this.changePaintOpacity(false);
          this.drawText("（未装備）", x + 110 + ImageManager.iconWidth + 4, y, this.contentsWidth());
          this.changePaintOpacity(true);
        }
        y += this.lineHeight();
      });
    }

    drawResistPage() {
      const target = this._battler;
      let y = 0;

      const sideText = target.isActor() ? "【味方】" : "【敵】";
      this.changeTextColor(ColorManager.systemColor());
      this.drawText(`${sideText} ${target.name()} の解析情報`, 0, y, this.contentsWidth(), "left");
      y += this.lineHeight();
      this.drawHorzLine(y);
      y += 10;

      this.changeTextColor(ColorManager.systemColor());
      this.drawText("【付与されているステート】", 0, y, this.contentsWidth());
      y += this.lineHeight();

      const states = target.states();
      if (states.length === 0) {
        this.changeTextColor(ColorManager.normalColor());
        this.drawText(" なし", 10, y, this.contentsWidth());
        y += this.lineHeight();
      } else {
        let sx = 10;
        states.forEach((state) => {
          this.drawIcon(state.iconIndex, sx, y);
          this.changeTextColor(ColorManager.normalColor());
          this.drawText(state.name, sx + 36, y, 150);
          sx += 200;
          if (sx > this.contentsWidth() - 150) {
            sx = 10;
            y += this.lineHeight();
          }
        });
        if (sx !== 10) y += this.lineHeight();
      }

      y += 10;

      if (typeof TERS !== "undefined") {
        this.changeTextColor(this.systemColor());
        this.drawText("【現在の属性耐性】", 0, y, this.contentsWidth());
        y += this.lineHeight();

        for (let elementId = 0; elementId < $dataSystem.elements.length; elementId++) {
          const elementName = $dataSystem.elements[elementId];
          let rankText = "通常";
          let rate = 1.0;
          if (target._elementRanks !== undefined) {
            const rank = TERS.elementRanks[target._elementRanks[elementId]];
            rankText = rank.name;
            rate = rank.rate;
          } else {
            rate = target.elementRate(elementId);
            if (rate < 0) rankText = "吸収";
            else if (rate === 0) rankText = "無効";
            else if (rate < 1.0) rankText = "耐性";
            else if (rate > 1.0) rankText = "弱点";
          }

          this.changeTextColor(ColorManager.normalColor());
          this.drawText(` ${elementName}属性:`, 10, y, 150);
          if (rate < 1.0) this.changeTextColor(ColorManager.powerUpColor());
          if (rate > 1.0) this.changeTextColor(ColorManager.powerDownColor());
          if (rate === Infinity) {
            this.drawText(`${rankText}`, 160, y, 200);
          } else {
            this.drawText(`${rankText} (${Math.floor(rate * 100)}%)`, 160, y, 200);
          }
          y += this.lineHeight();
        }
      }
    }
  }

  // ----------------------------------------------------------------------------
  // Window_PartyCommand
  // ----------------------------------------------------------------------------

  // パーティコマンドに「情報確認」を追加する
  const _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
  Window_PartyCommand.prototype.makeCommandList = function () {
    _Window_PartyCommand_makeCommandList.call(this);
    this.addCommand("情報確認", "analysis");
  };
})();
