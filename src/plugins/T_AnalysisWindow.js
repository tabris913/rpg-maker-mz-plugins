/// <reference path="./T_AnalysisWindow.d.ts" />

//=============================================================================
// RPG Maker MZ - T_AnalysisWindow
//=============================================================================

/*:
 * @target MZ
 * @plugindesc
 * @author tosshie
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter T_ElementRankSystem
 *
 * @param
 *   @text
 *   @desc
 *   @type
 *   @default
 *
 * @help
 * ================================
 * T_AnalysisWindow.js [ja] v0.0.1
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

// TODO
// 装備情報
// ステータス情報
// ページング

"use strict";

/**
 * Global variable
 */
const TAW = {};

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

  Scene_Battle.prototype.analysisToggleWindowRect = function () {
    const ww = 400;
    const wh = this.calcWindowHeight(1, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 40; // 画面上部寄りに配置

    return new Rectangle(wx, wy, ww, wh);
  };

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
      if (TERS !== undefined) {
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
    }

    drawHorzLine(y) {
      this.contents.fillRect(0, y, this.contentsWidth(), 2, ColorManager.normalColor());
    }
  }

  // ----------------------------------------------------------------------------
  // Window_BattleLog
  // ----------------------------------------------------------------------------
  /**
   *
   * @param {Game_Battler} subject
   * @param {Game_Battler} target
   * @override
   */
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
})();
