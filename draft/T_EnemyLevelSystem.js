/*:
 * @target MZ
 * @plugindesc 敵キャラにレベルを導入（マップ側でenemyIdごとのレベル指定・シンクに対応）
 * @author RPGMZ
 *
 * @param DefaultClassId
 * @text デフォルト職業ID
 * @desc レベルシンク時、敵のメモ欄に職業IDが未記入の場合に参照する職業IDです。
 * @type class
 * @default 1
 *
 * @param DefaultLevel
 * @text デフォルトレベル
 * @desc マップや敵に何の指定もない場合の初期レベルです。
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

  // 1. プロパティ定義
  Object.defineProperty(Game_Enemy.prototype, "level", {
    get: function () {
      return this._level !== undefined ? this._level : this.setupEnemyLevel();
    },
    set: function (value) {
      this._level = value;
      this.refresh();
    },
    configurable: true,
  });

  Object.defineProperty(Game_Enemy.prototype, "enemyClassId", {
    get: function () {
      const metaClassId = this.enemy().meta.class_id;
      return metaClassId ? Number(metaClassId) : defaultClassId;
    },
    configurable: true,
  });

  // 2. ★レベル計算（マップ側のメモ欄から全体・個別の指定を解析する）
  Game_Enemy.prototype.setupEnemyLevel = function () {
    const meta = this.enemy().meta;
    const enemyId = this.enemyId();

    // 【データベース最優先】敵自体のメモ欄に直接 <level: X> があればそれが最優先（固定ステータス）
    if (meta.level) {
      this._level = Number(meta.level);
      return this._level;
    }

    // マップのメモ欄チェック
    if ($dataMap && $dataMap.meta && $dataMap.meta.level_sync !== undefined) {
      const mapSyncMeta = $dataMap.meta.level_sync;

      // マップの設定文字列を解析するための変数を準備
      let finalTarget = null; // 決定したレベル（または 'sync'）
      let baseTarget = null; // マップ全体のデフォルト設定

      // カンマ区切りの文字列をバラバラにして解析する
      // 例: "10, enemy[3]: 15, enemy[5]: 18"
      const settings = mapSyncMeta.toString().split(",");

      for (let setting of settings) {
        setting = setting.trim();

        // パターンA: enemy[ID]: レベル の個別指定があるかチェック
        const match = setting.match(/^enemy\[(\d+)\]\s*:\s*(\w+)/);
        if (match) {
          const targetEnemyId = parseInt(match[1], 10);
          if (targetEnemyId === enemyId) {
            finalTarget = match[2]; // この敵専用の設定を発見
          }
        } else if (!setting.includes(":")) {
          // パターンB: コロンを含まない値は「マップ全体の基本設定」とする
          baseTarget = setting;
        }
      }

      // 個別指定が見つからなかった場合は、マップ全体の基本設定を使う
      if (!finalTarget) {
        finalTarget = baseTarget || "sync";
      }

      // --- レベル決定処理 ---
      let targetLevel = 1;

      if (finalTarget === "sync" || finalTarget === "true" || finalTarget === "") {
        // プレイヤー追従シンクの場合
        targetLevel = $gameParty.highestLevel();
      } else {
        // 数値直接指定の場合
        targetLevel = Number(finalTarget) || defaultLevel;
      }

      // 敵個別のボーナス補正値があれば加算
      if (meta.level_bonus) {
        targetLevel += Number(meta.level_bonus);
      }

      // 下限・上限キャップ処理
      const minLevel = meta.min_level ? Number(meta.min_level) : 1;
      const maxLevel = meta.max_level ? Number(meta.max_level) : 99;

      this._level = Math.clamped(targetLevel, minLevel, maxLevel);
      return this._level;
    }

    // マップに指定がない場合はプラグインのデフォルト値
    this._level = defaultLevel;
    return this._level;
  };

  // 3. 通常能力値(paramBase)の計算（敵個別の<level: X>指定時は素のステータスを利用）
  const _Game_Enemy_paramBase = Game_Enemy.prototype.paramBase;
  Game_Enemy.prototype.paramBase = function (paramId) {
    // 敵キャラのメモ欄に直接 <level: X> の指定がある（＝完全固定ボス）場合のみ素のステータス
    if (this.enemy().meta.level) {
      return _Game_Enemy_paramBase.call(this, paramId);
    }

    // それ以外（マップ側の数値指定、またはプレイヤーシンク）は職業の能力値曲線を参照
    const classData = $dataClasses[this.enemyClassId];
    if (classData && classData.params) {
      return classData.params[paramId][this.level];
    }

    return _Game_Enemy_paramBase.call(this, paramId);
  };

  // 4. バトル画面でのレベル自動表示
  if (showLevelInBattle) {
    const _Game_Enemy_name = Game_Enemy.prototype.name;
    Game_Enemy.prototype.name = function () {
      const baseName = _Game_Enemy_name.call(this);
      return `${baseName} Lv.${this.level}`;
    };
  }
})();
