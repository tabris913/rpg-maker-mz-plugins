//=============================================================================
// RPG Maker MZ - T_ElementRankSystem
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 【自由拡張版】スキルで戦闘中に属性耐性レベルを動的に上下させるプラグイン
 * @author tosshie
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 *
 * @param ResistRanks
 * @text 耐性の追加段階（無効～通常の間）
 * @desc 無効と通常の間に入れる耐性段階を定義します。上から順に「無効」に近い順（倍率が低い順）で並べてください。
 * @type struct<CustomRank>[]
 * @default ["{\"key\":\"resist\",\"rate\":\"0.5\"}"]
 *
 * @param WeakRanks
 * @text 弱点の追加段階（通常～即死の間）
 * @desc 通常と即死の間に入れる弱点段階を定義します。上から順に「通常」に近い順（倍率が低い順）で並べてください。
 * @type struct<CustomRank>[]
 * @default ["{\"key\":\"weak\",\"rate\":\"1.5\"}"]
 *
 * @help
 * 【メモ欄の基本設定】
 * アクター、敵キャラ、装備、ステートのメモ欄に初期耐性を記述できます。
 * 省略された場合は自動的に「normal」になります。
 * <element_rank[2]: resist>  (属性2の初期耐性をパラメータで設定した「resist」にする)
 * <element_rank[3]: absorb>  (属性3の初期耐性を組み込みの「absorb(吸収)」にする)
 *
 * 【プラグインコマンド】
 * @command ChangeElementRank
 * @text 属性耐性レベルの変更
 * @desc 戦闘中、対象の特定の属性耐性レベルを上下させます。
 *
 * @arg targetType
 * @text 対象タイプ
 * @desc 耐性を変更する対象を指定します。
 * @type select
 * @option 行動の対象 (Last Target)
 * @value lastTarget
 * @option 使用者 (User)
 * @value user
 * @default lastTarget
 *
 * @arg elementId
 * @text 属性ID
 * @desc 変更する属性のIDを指定します。
 * @type number
 * @default 2
 *
 * @arg amount
 * @text 変動量
 * @desc 即死側（右）へはプラス、吸収側（左）へはマイナス。
 * @type number
 * @min -5
 * @max 5
 * @default 1
 */
/*~struct~CustomRank:
 * @param key
 * @text 段階名（キー）
 * @desc メモ欄やシステム内部で識別するための名前（例: resist1, weak_half）。半角英数が推奨。
 * @type string
 *
 * @param rate
 * @text 倍率
 * @desc この段階の属性有効度（倍率）を指定します（例: 0.5 で半減）。
 * @type string
 */

(() => {
    'use strict';
    const pluginName = "ElementRankDynamicSystem";

    // --- 1. 耐性配列と倍率マップの動的構築 ---
    const RANK_ORDER = ["absorb", "null"];
    const RANK_RATES = {
        "absorb": -1.0,
        "null": 0.0,
        "normal": 1.0,
        "death": 2.0
    };

    // プラグインパラメータの解析
    const params = PluginManager.parameters(pluginName);
    
    // ① 無効(null) と 通常(normal) の間の耐性段階を挿入
    if (params.ResistRanks) {
        try {
            JSON.parse(params.ResistRanks).forEach(itemStr => {
                const item = JSON.parse(itemStr);
                if (item.key) {
                    RANK_ORDER.push(item.key);
                    RANK_RATES[item.key] = Number(item.rate || 0.5);
                }
            });
        } catch (e) { console.error(e); }
    }

    // 通常を挿入
    RANK_ORDER.push("normal");

    // ② 通常(normal) と 即死(death) の間の弱点段階を挿入
    if (params.WeakRanks) {
        try {
            JSON.parse(params.WeakRanks).forEach(itemStr => {
                const item = JSON.parse(itemStr);
                if (item.key) {
                    RANK_ORDER.push(item.key);
                    RANK_RATES[item.key] = Number(item.rate || 1.5);
                }
            });
        } catch (e) { console.error(e); }
    }

    // 最後に即死を挿入
    RANK_ORDER.push("death");

    // デバッグ用に最終的な配列構造をコンソールに出力
    console.log("【耐性段階システム】構築された耐性ライン:", RANK_ORDER);
    console.log("【耐性段階システム】各段階の倍率:", RANK_RATES);


    // --- 2. バトラーに一時的な耐性変動値を保存する領域を作る ---
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._dynamicElementRankModifiers = {}; // { elementId: modifier(整数) }
    };

    // 戦闘開始時に動的変化をリセット
    const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function() {
        _Game_Battler_onBattleStart.call(this);
        this._dynamicElementRankModifiers = {};
    };


    // --- 3. 現在の最終的な耐性レベル（インデックス）を計算する関数 ---
    Game_BattlerBase.prototype.getCurrentElementRankIndex = function(elementId) {
        // ① まずベース（メモ欄など）のランクを取得
        let baseRankKey = "normal";
        
        // 特徴オブジェクト（アクター・職業・装備・ステート）のメモ欄を走査
        for (const obj of this.traitObjects()) {
            if (obj && obj.note) {
                const tagPattern = new RegExp(`<element_rank\\[${elementId}\\]:\\s*([^>]+)>`);
                const match = obj.note.match(tagPattern);
                if (match) {
                    baseRankKey = match[1].trim();
                    break; // 最初に見つかったものを優先
                }
            }
        }

        // RANK_ORDER 上の現在の位置（インデックス）を取得
        let rankIndex = RANK_ORDER.indexOf(baseRankKey);
        if (rankIndex === -1) {
            rankIndex = RANK_ORDER.indexOf("normal"); // 見つからなければ通常
        }

        // ② スキルによる変動量を加算
        const modifier = this._dynamicElementRankModifiers[elementId] || 0;
        rankIndex += modifier;

        // 配列の範囲内（最左翼の吸収 ～ 最右翼の即死）に収める
        return Math.max(0, Math.min(RANK_ORDER.length - 1, rankIndex));
    };


    // --- 4. 属性有効度のオーバーライド ---
    const _Game_BattlerBase_elementRate = Game_BattlerBase.prototype.elementRate;
    Game_BattlerBase.prototype.elementRate = function(elementId) {
        const rankIndex = this.getCurrentElementRankIndex(elementId);
        const rankKey = RANK_ORDER[rankIndex];
        
        if (RANK_RATES[rankKey] !== undefined) {
            return RANK_RATES[rankKey];
        }
        return _Game_BattlerBase_elementRate.call(this, elementId);
    };


    // --- 5. ダメージ計算時に「即死(death)」状態なら即死させる処理 ---
    const _Game_Battler_onDamage = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function(value) {
        _Game_Battler_onDamage.call(this, value);
        
        // 戦闘中のダメージ処理である場合
        if ($gameParty.inBattle()) {
            const action = BattleManager._action;
            if (action && action.item()) {
                const elementId = action.item().damage.elementId;
                // 通常攻撃（elementId === -1）の場合は、攻撃側の属性を取得
                const actualElementId = elementId === -1 ? action.subject().attackElements()[0] : elementId;

                if (actualElementId > 0) {
                    const rankIndex = this.getCurrentElementRankIndex(actualElementId);
                    if (RANK_ORDER[rankIndex] === "death" && value > 0) {
                        // 耐性が「death（即死）」かつダメージが1以上通った場合、戦闘不能を付加
                        this.addState(this.deathStateId());
                        BattleManager._logWindow.push("addText", `${this.name()}は弱点属性が限界を迎え即死した！`);
                    }
                }
            }
        }
    };


    // --- 6. プラグインコマンドの登録 ---
    PluginManager.registerCommand(pluginName, "ChangeElementRank", args => {
        const targetType = args.targetType;
        const elementId = Number(args.elementId);
        const amount = Number(args.amount);

        let targets = [];
        if (targetType === "lastTarget") {
            targets = BattleManager._targets || [];
        } else if (targetType === "user") {
            if (BattleManager._action) {
                targets = [BattleManager._action.subject()];
            }
        }

        targets.forEach(battler => {
            if (battler && battler._dynamicElementRankModifiers) {
                if (!battler._dynamicElementRankModifiers[elementId]) {
                    battler._dynamicElementRankModifiers[elementId] = 0;
                }
                battler._dynamicElementRankModifiers[elementId] += amount;
                
                // デバッグログ用（F8キーのコンソールで確認可能）
                const rankIndex = battler.getCurrentElementRankIndex(elementId);
                console.log(`${battler.name()} の属性 ${elementId} の現在の耐性段階: ${RANK_ORDER[rankIndex]} (倍率: ${RANK_RATES[RANK_ORDER[rankIndex]]})`);
            }
        });
    });

})();
