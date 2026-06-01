/*:
 * @target MZ
 * @plugindesc 敵キャラに職業成長曲線とレベル（シンク・上限下限・画面表示対応）を導入
 * @author RPGMZ
 *
 * @param DefaultClassId
 * @text デフォルト職業ID
 * @desc メモ欄に職業IDが未記入の場合に参照するデータベースの職業IDです。
 * @type class
 * @default 1
 *
 * @param DefaultLevel
 * @text デフォルトレベル
 * @desc レベルシンクせず、メモ欄にもレベル未記入の場合の初期レベルです。
 * @type number
 * @default 1
 *
 * @param ShowLevelInBattle
 * @text バトル画面でレベル表示
 * @desc 敵の名前にレベル（例: スライム Lv.5）を自動付与するかどうか。
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true
 */

(() => {
    const pluginName = "EnemyClassLevelSystem";
    const parameters = PluginManager.parameters(pluginName);
    const defaultClassId = Number(parameters["DefaultClassId"] || 1);
    const defaultLevel = Number(parameters["DefaultLevel"] || 1);
    const showLevelInBattle = parameters["ShowLevelInBattle"] === "true";

    // 1. プロパティ定義 (level, enemyClassId)
    Object.defineProperty(Game_Enemy.prototype, "level", {
        get: function() {
            return this._level !== undefined ? this._level : this.setupEnemyLevel();
        },
        set: function(value) {
            this._level = value;
            this.refresh();
        },
        configurable: true
    });

    Object.defineProperty(Game_Enemy.prototype, "enemyClassId", {
        get: function() {
            const metaClassId = this.enemy().meta.class_id;
            return metaClassId ? Number(metaClassId) : defaultClassId;
        },
        configurable: true
    });

    // 2. レベル計算（固定設定 vs レベルシンク ＆ 上限・下限キャップ）
    Game_Enemy.prototype.setupEnemyLevel = function() {
        const meta = this.enemy().meta;

        // レベルシンク判定
        if (meta.level_sync !== undefined) {
            let targetLevel = $gameParty.highestLevel();
            
            // ボーナス補正値の加算
            if (meta.level_bonus) {
                targetLevel += Number(meta.level_bonus);
            }

            // 【拡張：下限・上限キャップ処理】
            const minLevel = meta.min_level ? Number(meta.min_level) : 1;
            const maxLevel = meta.max_level ? Number(meta.max_level) : 99;
            this._level = Math.clamped(targetLevel, minLevel, maxLevel);
        } else {
            // 固定レベル設定
            this._level = meta.level ? Number(meta.level) : defaultLevel;
        }

        return this._level;
    };

    // 3. 通常能力値(paramBase)を「職業の能力値曲線」で上書き
    Game_Enemy.prototype.paramBase = function(paramId) {
        const classData = $dataClasses[this.enemyClassId];
        if (classData && classData.params) {
            return classData.params[paramId][this.level];
        }
        return Game_Battler.prototype.paramBase.call(this, paramId);
    };

    // 4. 【拡張：バトル画面でのレベル自動表示】
    if (showLevelInBattle) {
        const _Game_Enemy_name = Game_Enemy.prototype.name;
        Game_Enemy.prototype.name = function() {
            const baseName = _Game_Enemy_name.call(this);
            // 名前の後ろに 「 Lv.XX」 を付与
            return `${baseName} Lv.${this.level}`;
        };
    }
})();
