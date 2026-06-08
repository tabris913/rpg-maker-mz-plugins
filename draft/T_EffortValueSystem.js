/*:
 * @target MZ
 * @plugindesc ポケモン風努力値（EV）システム v1.0
 * @author 学習アシスタント
 *
 * @param evThreshold
 * @text 上昇閾値 (N)
 * @desc 努力値が何ポイント溜まるとステータスが1上がるか。
 * @type number
 * @default 4
 *
 * @param totalEvMax
 * @text 努力値合計上限
 * @desc 1アクターが獲得できる全能力の努力値合計の上限。
 * @type number
 * @default 510
 *
 * @param individualEvMax
 * @text 個別努力値上限
 * @desc 各能力値ごとに獲得できる努力値の上限。
 * @type number
 * @default 252
 *
 * @help
 * 【敵キャラのメモ欄設定】
 * 敵を倒した時に得られる努力値を能力値ID（0〜7）ごとに設定します。
 * <EV_Gain[ID]: [値]>
 * 例: <EV_Gain2: 2> （攻撃の努力値を2獲得）
 * ※ ID: 0:HP, 1:MP, 2:攻撃, 3:防御, 4:魔法力, 5:魔法防御, 6:敏捷性, 7:運
 *
 * 【アイテムのメモ欄設定】
 * アイテムで努力値を増減させたり、リセットしたりできます。
 * <EV_Change[ID]: [値]> : 指定した能力の努力値を増減（マイナス可）
 * <EV_Reset: 1> : 全ての努力値を0にリセット
 */

(() => {
    'use strict';

    const pluginName = "EffortValueSystem";
    const parameters = PluginManager.parameters(pluginName);
    const EV_THRESHOLD = Number(parameters['evThreshold'] || 4);
    const TOTAL_EV_MAX = Number(parameters['totalEvMax'] || 510);
    const INDIVIDUAL_EV_MAX = Number(parameters['individualEvMax'] || 252);

    //--- Game_Actor: 努力値の保持と計算 ---

    const _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        this._effortValues = []; // 各能力値の努力値 [1]
    };

    Game_Actor.prototype.effortValue = function(paramId) {
        return this._effortValues ? this._effortValues[paramId] || 0 : 0;
    };

    // 努力値の合計を計算
    Game_Actor.prototype.totalEffortValues = function() {
        return this._effortValues.reduce((a, b) => a + b, 0);
    };

    // 努力値を獲得/変更するメインロジック [2]
    Game_Actor.prototype.gainEV = function(paramId, value) {
        if (!this._effortValues) this._effortValues = ;
        
        let currentTotal = this.totalEffortValues();
        let currentVal = this._effortValues[paramId];

        // 合計上限と個別上限のチェック
        let gainable = Math.min(
            value,
            INDIVIDUAL_EV_MAX - currentVal,
            TOTAL_EV_MAX - currentTotal
        );

        if (value < 0) gainable = Math.max(value, -currentVal); // 減少時の処理

        this._effortValues[paramId] += gainable;
        
        // ステータス再計算を促す [3]
        this.refresh();
    };

    // 努力値をリセットする
    Game_Actor.prototype.resetEVs = function() {
        this._effortValues = [];
        this.refresh();
    };

    // 努力値を実際のパラメータ加算値に反映させる [2-4]
    const _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        let value = _Game_Actor_paramPlus.call(this, paramId);
        // Nポイントにつき1上昇 (端数切捨て)
        const evBonus = Math.floor(this.effortValue(paramId) / EV_THRESHOLD);
        return value + evBonus;
    };

    //--- 敵撃破時の努力値配布 ---

    const _BattleManager_gainRewards = BattleManager.gainRewards;
    BattleManager.gainRewards = function() {
        _BattleManager_gainRewards.call(this);
        this.gainEffortValues();
    };

    BattleManager.gainEffortValues = function() {
        const defeatedEnemies = $gameTroop.deadMembers();
        const survivors = $gameParty.battleMembers().filter(actor => actor.isAlive());

        defeatedEnemies.forEach(enemy => {
            for (let i = 0; i < 8; i++) {
                const tag = `EV_Gain${i}`;
                const gain = Number(enemy.enemy().meta[tag] || 0);
                if (gain > 0) {
                    survivors.forEach(actor => actor.gainEV(i, gain));
                }
            }
        });
    };

    //--- アイテムによる効果の実装 [5, 6] ---

    const _Game_Action_applyItemEffect = Game_Action.prototype.applyItemEffect;
    Game_Action.prototype.applyItemEffect = function(target, effect) {
        _Game_Action_applyItemEffect.call(this, target, effect);
        
        if (target.isActor()) {
            const item = this.item();
            
            // 努力値リセットアイテム
            if (item.meta.EV_Reset) {
                target.resetEVs();
            }

            // 努力値増減アイテム (EV_Change[ID])
            for (let i = 0; i < 8; i++) {
                const tag = `EV_Change${i}`;
                if (item.meta[tag]) {
                    const changeValue = Number(item.meta[tag]);
                    target.gainEV(i, changeValue);
                }
            }
        }
    };
})();
