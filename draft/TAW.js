(() => {
  "use strict";

  //--- Window_BattleAnalysis の拡張 ---

  const _Window_BattleAnalysis_initialize = Window_BattleAnalysis.prototype.initialize;
  Window_BattleAnalysis.prototype.initialize = function (rect) {
    _Window_BattleAnalysis_initialize.call(this, rect);
    this._pageIndex = 0; // 0:耐性, 1:ステータス, 2:装備
  };

  // ターゲット設定時にページを先頭に戻す
  const _Window_BattleAnalysis_setTarget = Window_BattleAnalysis.prototype.setTarget;
  Window_BattleAnalysis.prototype.setTarget = function (target) {
    _Window_BattleAnalysis_setTarget.call(this, target);
    this._pageIndex = 0;
    this.refresh();
  };

  // 入力更新：左右キーによるページング
  const _Window_BattleAnalysis_update = Window_BattleAnalysis.prototype.update;
  Window_BattleAnalysis.prototype.update = function () {
    _Window_BattleAnalysis_update.call(this);
    if (this.active) {
      if (Input.isRepeated("right")) {
        this.changePage(1);
      } else if (Input.isRepeated("left")) {
        this.changePage(-1);
      }
    }
  };

  Window_BattleAnalysis.prototype.changePage = function (delta) {
    this._pageIndex = (this._pageIndex + delta + 3) % 3;
    SoundManager.playCursor();
    this.refresh();
  };

  // 描画処理のメイン分岐
  Window_BattleAnalysis.prototype.refresh = function () {
    this.contents.clear();
    if (!this._target) return;

    const h = this.lineHeight();
    this.drawPageHeader();

    switch (this._pageIndex) {
      case 0:
        // 従来の耐性表示処理を呼び出し
        if (this.drawResistancePage) this.drawResistancePage();
        break;
      case 1:
        this.drawStatusPage();
        break;
      case 2:
        this.drawEquipPage();
        break;
    }
  };

  // ページヘッダーの描画
  Window_BattleAnalysis.prototype.drawPageHeader = function () {
    const pages = ["【耐性情報】", "【詳細ステータス】", "【装備情報】"];
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(pages[this._pageIndex], 0, 0, this.contentsWidth(), "center");
    this.resetTextColor();
    this.drawText("Q/W(L/R):切替", 0, 0, this.contentsWidth(), "right");
  };

  // ページ1: 詳細ステータス (バフ・デバフ反映)
  Window_BattleAnalysis.prototype.drawStatusPage = function () {
    const target = this._target;
    const x = this.itemPadding();
    let y = this.lineHeight();

    for (let i = 0; i < 8; i++) {
      const paramName = TextManager.param(i);
      // 元の数値 (レベル + 装備 + 成長アイテム加算) [1-3]
      const baseVal = target.paramBase(i) + target.paramPlus(i);
      // 現在の最終値 (バフ・デバフ・特徴倍率反映後) [1]
      const currentVal = target.param(i);
      const buffLevel = target.buff(i); // バフ段階 (-2 ～ +2)

      this.changeTextColor(ColorManager.systemColor());
      this.drawText(paramName, x, y, 120);
      this.resetTextColor();

      // 数値比較表示
      this.drawText(baseVal, x + 130, y, 60, "right");
      this.drawText("→", x + 190, y, 40, "center");

      // 変動に応じて数値の色を変える
      if (currentVal > baseVal) this.changeTextColor(ColorManager.powerUpColor());
      if (currentVal < baseVal) this.changeTextColor(ColorManager.powerDownColor());
      this.drawText(currentVal, x + 230, y, 70, "right");
      this.resetTextColor();

      // バフ/デバフ状態の簡易表示
      if (buffLevel !== 0) {
        const iconIndex = buffLevel > 0 ? 32 + i : 48 + i; // 標準のバフ/デバフアイコン
        this.drawIcon(iconIndex, x + 310, y + 2);
        const mark = buffLevel > 0 ? "▲".repeat(buffLevel) : "▼".repeat(Math.abs(buffLevel));
        this.drawText(mark, x + 345, y, 60);
      }
      y += this.lineHeight();
    }
  };

  // ページ2: 装備情報 (アクターのみ)
  Window_BattleAnalysis.prototype.drawEquipPage = function () {
    const target = this._target;
    if (!target.isActor()) {
      this.drawText("敵キャラの装備情報はありません。", 0, this.contentsHeight() / 2, this.contentsWidth(), "center");
      return;
    }

    const equips = target.equips(); // 現在の装備品を取得 [2]
    let y = this.lineHeight();
    const x = this.itemPadding();

    equips.forEach((item) => {
      if (item) {
        this.drawItemName(item, x, y, this.contentsWidth() - x * 2);

        // 装備による能力上昇値を右側に小さく表示 [2]
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
        this.drawText("（未装備）", x + ImageManager.iconWidth + 4, y, this.contentsWidth());
        this.changePaintOpacity(true);
      }
      y += this.lineHeight();
    });
  };

  // 注意：既存の drawResistancePage (耐性描画) が T_AnalysisWindow.js 内にあることを前提としています。
})();
