//=============================================================================
// RPG Maker MZ - T_CustomParameters
//=============================================================================

/*:
  @target MZ
  @plugindesc 能力値カスタムプラグイン
  @author tosshie
  @base PluginCommonBase
  @orderAfter PluginCommonBase

  @param -*-*-*- 通常能力値 -*-*-*-
  @default

  @param MaximumHitPoints
  @text 最大HP [mhp]
  @type struct<BuiltInParam1Def>
  @default {"visible":"false","displayOrder":"0"}

  @param MaximumMagicPoints
  @text 最大MP [mmp]
  @type struct<BuiltInParam1Def>
  @default {"visible":"false","displayOrder":"0"}

  @param AttackPower
  @text 攻撃力 [atk]
  @type struct<BuiltInParam1Def>
  @default {"visible":"true","displayOrder":"0"}

  @param DefensePower
  @text 防御力 [def]
  @type struct<BuiltInParam1Def>
  @default {"visible":"true","displayOrder":"1"}

  @param MagicAttackPower
  @text 魔法力 [mat]
  @type struct<BuiltInParam1Def>
  @default {"visible":"true","displayOrder":"2"}

  @param MagicDefensePower
  @text 魔法防御 [mdf]
  @type struct<BuiltInParam1Def>
  @default {"visible":"true","displayOrder":"3"}

  @param Agility
  @text 敏捷性 [agi]
  @type struct<BuiltInParam1Def>
  @default {"visible":"true","displayOrder":"4"}

  @param Luck
  @text 運 [luk]
  @type struct<BuiltInParam1Def>
  @default {"visible":"true","displayOrder":"5"}

  @param -*-*-*- 追加能力値 -*-*-*-
  @default

  @param HitRate
  @text 命中率 [hit]
  @type struct<BuiltInParam1Def>
  @default {"visible":"false"}

  @param EvasionRate
  @text 回避率 [eva]
  @type struct<BuiltInParam1Def>
  @default {"visible":"false"}

  @param CriticalRate
  @text 会心率 [cri]
  @type struct<BuiltInParam2Def>
  @default {"name":"会心率","visible":"false"}

  @param CriticalEvasionRate
  @text 会心回避率 [cev]
  @type struct<BuiltInParam2Def>
  @default {"name":"会心回避率","visible":"false"}

  @param MagicEvasionRate
  @text 魔法回避率 [mev]
  @type struct<BuiltInParam2Def>
  @default {"name":"魔法回避率","visible":"false"}

  @param MagicReflectionRate
  @text 魔法反射率 [mrf]
  @type struct<BuiltInParam2Def>
  @default {"name":"魔法反射率","visible":"false"}

  @param CounterAttackRate
  @text 反撃率 [cnt]
  @type struct<BuiltInParam2Def>
  @default {"name":"反撃率","visible":"false"}

  @param HPRegenerationRate
  @text HP再生率 [hrg]
  @type struct<BuiltInParam2Def>
  @default {"name":"HP再生率","visible":"false"}

  @param MPRegenerationRate
  @text MP再生率 [mrg]
  @type struct<BuiltInParam2Def>
  @default {"name":"MP再生率","visible":"false"}

  @param TPRegenerationRate
  @text TP再生率 [trg]
  @type struct<BuiltInParam2Def>
  @default {"name":"TP再生率","visible":"false"}

  @param -*-*-*- 特殊能力値 -*-*-*-
  @default

  @param TargetRate
  @text 狙われ率 [tgr]
  @type struct<BuiltInParam2Def>
  @default {"name":"狙われ率","visible":"false"}

  @param GuardEffectRate
  @text 防御効果率 [grd]
  @type struct<BuiltInParam2Def>
  @default {"name":"防御効果率","visible":"false"}

  @param RecoverEffectRate
  @text 回復効果率 [rec]
  @type struct<BuiltInParam2Def>
  @default {"name":"回復効果率","visible":"false"}

  @param Pharmocology
  @text 薬の知識 [pha]
  @type struct<BuiltInParam2Def>
  @default {"name":"薬の知識","visible":"false"}

  @param MPCostRate
  @text MP消費率 [mcr]
  @type struct<BuiltInParam2Def>
  @default {"name":"MP消費率","visible":"false"}

  @param TPChargeRate
  @text TPチャージ率 [tcr]
  @type struct<BuiltInParam2Def>
  @default {"name":"TPチャージ率","visible":"false"}

  @param PhysicalDamageRate
  @text 物理ダメージ率 [pdr]
  @type struct<BuiltInParam2Def>
  @default {"name":"物理ダメージ率","visible":"false"}

  @param MagicDamageRate
  @text 魔法ダメージ率 [mdr]
  @type struct<BuiltInParam2Def>
  @default {"name":"魔法ダメージ率","visible":"false"}

  @param FloorDamageRate
  @text 床ダメージ率 [fdr]
  @type struct<BuiltInParam2Def>
  @default {"name":"床ダメージ率","visible":"false"}

  @param ExperienceRate
  @text 経験獲得率 [exr]
  @type struct<BuiltInParam2Def>
  @default {"name":"経験獲得率","visible":"false"}

  @param -*-*-*- 独自能力値 -*-*-*-
  @default

  @param ParamJson
  @text パラメータ定義
  @type struct<ParamDef>[]

  @help
  ================================
  CustomParameters.js [ja] v1.0.0
  ================================

  # Dependencies
  
  - PluginCommonBase.js
  　> {RPG Maker MZ のインストール場所}/dlc/BasicResources/plugins/official
  　> にあるものを、ゲームプロジェクトのプラグインディレクトリにコピーし、
  　> プラグイン管理から有効化してください

  # できること

  - 既存の能力値(通常能力値・追加能力値・特殊能力値)の表示/非表示を切り替える
  - オリジナルの能力値(独自能力値)を追加する
  - 別の能力値の値を合算した能力値を作成する
  - 命中率や回避率のような隠し能力値をステータス欄に表示させる
  - 能力値の表示順を変更する

  # ⚠️注意点⚠️

  1. 能力値表示を変更するプラグインと競合する可能性があります
  2. 通常能力値および命中率、回避率の表示名はデータベースの用語から変更してくだ
  　 さい
  3. 最大ＨＰおよび最大ＭＰの表示/非表示は、装備ステータス欄にのみ適用されます
  4. 同じ表示順を指定した場合は、定義順に表示されます

  # つかいかた(例)

  - 設定を変更する場合には、該当行をダブルクリックします
  - 設定を追加/作成する場合には、空行をダブルクリックします

  ## ステータス画面から「運」の表示を消したい
  1. 通常能力値「運 [luk]」の「表示/非表示」を「false」に変更する

  ## 隠しパラメータの「会心率」をステータス画面に表示させたい
  1. 追加能力値「会心率 [cri]」の「表示/非表示」を「true」に変更する

  ## 「敏捷性」を「会心率」より下に表示させたい
  1. 追加能力値「会心率 [cri]」の「表示順」を確認する
  2. 通常能力値「敏捷性 [agi]」の「表示順」を手順1で確認した値より大きい数値
  　 に変更する

  ## 「反撃率」の表示名を「カウンター率」に変更したい
  1. 追加能力値「反撃率 [cnt]」の「能力値名」を「カウンター率」に変更する

  ## 以下の条件の独自能力値を追加したい
  - 総合耐久力 [end]
  - 能力値は「防御力」と「魔法防御」の合計
  - 表示位置は「魔法防御」と「敏捷性」の間

  1. 「魔法防御」と「敏捷性」の表示順を確認する
  2. 独自能力値「パラメータ定義」をダブルクリックする
  3. パラメータ定義の空行をダブルクリックする
  4. 「能力値キー」を「end」に変更する
  5. 「能力値名」を「総合耐久力」に変更する
  6. 「合算能力値」をダブルクリックする
  7. 空行をダブルクリックし、「def」をセットする
  8. 空行をダブルクリックし、「mdf」をセットする --> OK
  9. 「表示順」を「魔法防御」と「敏捷性」の間の数値に変更する
  　※ 「魔法防御」と「敏捷性」の表示順が同じ数値の場合は、間に表示できません
  　※ 「魔法防御」と「敏捷性」の表示順が1しか異ならない場合は、「魔法防御」と
  　　 同じ数値にすると間に表示されます (cf. 注意点4)

  ## 追加した独自能力値「総合耐久力 [end]」が10上がる防具を作りたい
  1. データベースで該当防具の設定を開く
  2. メモに以下の形式で記載する
  　 <add_end: 10>
  ※ アクターや敵キャラに独自能力値を付与する場合も、メモ欄に同様の記述をすれ
  　 ばOKです。ただしこれは固定値の追加であり、レベルによって変動しません

  ## スキルの計算式に独自能力値「総合耐久力 [end]」を使いたい
  1. データベースで該当スキルの設定を開く
  2. メモに以下の形式(キーの前にアンダースコア"_"を2つ付ける)で記載する
  　 a.atk * 4 - b.__end * 2  # 攻撃力の4倍マイナス総合耐久力の2倍

  # 今後について
  ※すべて希望的展望であり、実現できるとは限りません

  - 独自能力値をアクターのレベルアップによって成長させたい
  - 合算能力値を単なる合計ではなく、より複雑な計算も受け付けるようにしたい

  ================
  Version History
  ================
  Ver.   Date        Desc.
  1.0.0  2026/05/29  初版
 */

/*~struct~ParamDef:
  @param key
  @text 能力値キー
  @type string

  @param name
  @text 能力値名
  @type string
  
  @param min
  @text 最小値
  @desc 負の値を許可するために文字列入力
  @type string
  @default 0

  @param max
  @text 最大値
  @type number
  @default 999

  @param formula
  @text 合算能力値
  @type string[]

  @param visible
  @text 表示/非表示
  @type boolean
  @default true

  @param displayOrder
  @text 表示順
  @type number
  @default 100
 */
/*~struct~BuiltInParam2Def:
  @param name
  @text 能力値名
  @type string
  
  @param visible
  @text 表示/非表示
  @type boolean
  @default true

  @param displayOrder
  @text 表示順
  @type number
  @default 100
 */
/*~struct~BuiltInParam1Def:
  @param visible
  @text 表示/非表示
  @type boolean
  @default true

  @param displayOrder
  @text 表示順
  @type number
  @default 100
 */

/**
 * 組み込み能力値定義
 *
 * @type Array<{ key: string; name: string; type: '' | 'param' | 'xparam' | 'sparam'; paramId?: number; nameId?: number }>
 */
const EXISTING_PARAMS = [
  { key: "hp", name: "ＨＰ", type: "" },
  { key: "mp", name: "ＭＰ", type: "" },
  { key: "tp", name: "ＴＰ", type: "" },
  { key: "mhp", name: "最大HP", type: "param", paramId: 0, nameId: 0 },
  { key: "mmp", name: "最大MP", type: "param", paramId: 1, nameId: 1 },
  { key: "atk", name: "攻撃力", type: "param", paramId: 2, nameId: 2 },
  { key: "def", name: "防御力", type: "param", paramId: 3, nameId: 3 },
  { key: "mat", name: "魔法力", type: "param", paramId: 4, nameId: 4 },
  { key: "mdf", name: "魔法防御", type: "param", paramId: 5, nameId: 5 },
  { key: "agi", name: "敏捷性", type: "param", paramId: 6, nameId: 6 },
  { key: "luk", name: "運", type: "param", paramId: 7, nameId: 7 },
  { key: "hit", name: "命中率", type: "xparam", paramId: 0, nameId: 8 },
  { key: "eva", name: "回避率", type: "xparam", paramId: 1, nameId: 9 },
  { key: "cri", name: "会心率", type: "xparam", paramId: 2 },
  { key: "cev", name: "会心回避率", type: "xparam", paramId: 3 },
  { key: "mev", name: "魔法回避率", type: "xparam", paramId: 4 },
  { key: "mrf", name: "魔法反射率", type: "xparam", paramId: 5 },
  { key: "cnt", name: "反撃率", type: "xparam", paramId: 6 },
  { key: "hrg", name: "HP再生率", type: "xparam", paramId: 7 },
  { key: "mrg", name: "MP再生率", type: "xparam", paramId: 8 },
  { key: "trg", name: "TP再生率", type: "xparam", paramId: 9 },
  { key: "tgr", name: "狙われ率", type: "sparam", paramId: 0 },
  { key: "grd", name: "防御効果率", type: "sparam", paramId: 1 },
  { key: "rec", name: "回復効果率", type: "sparam", paramId: 2 },
  { key: "pha", name: "薬の知識", type: "sparam", paramId: 3 },
  { key: "mcr", name: "MP消費率", type: "sparam", paramId: 4 },
  { key: "tcr", name: "TPチャージ率", type: "sparam", paramId: 5 },
  { key: "pdr", name: "物理ダメージ率", type: "sparam", paramId: 6 },
  { key: "mdr", name: "魔法ダメージ率", type: "sparam", paramId: 7 },
  { key: "fdr", name: "床ダメージ率", type: "sparam", paramId: 8 },
  { key: "exr", name: "経験獲得率", type: "sparam", paramId: 9 },
];
console.debug(EXISTING_PARAMS);
/**
 * 組み込み能力値名リスト
 *
 * @type Array<string>
 */
const EXISTING_PARAM_KEYS = EXISTING_PARAMS.map((p) => p.key);
console.debug(EXISTING_PARAM_KEYS);

/**
 *
 * @param {Array<unknown>} array
 * @param {unknown} element
 * @returns
 */
const includes = (array, element) => array.some((e) => e === element);

const applyPlugin = () => {
  "use strict";

  const paramsDef = getParams();
  console.debug(paramsDef);

  for (const param of paramsDef.filter(
    (p) => !includes(EXISTING_PARAM_KEYS, p.key),
  )) {
    console.debug(`Add custom param: ${param.key} (${param.name})`);
    // register params as property
    Object.defineProperty(Game_BattlerBase.prototype, `__${param.key}`, {
      get: function () {
        return this[`param_${param.key}`]();
      },
      configurable: true,
    });

    // 計算ロジック
    Game_BattlerBase.prototype[`param_${param.key}`] = function () {
      // 最低値・最大値を設定
      return Math.min(
        param.max ?? 999,
        Math.max(param.min, this.customParamPlus(param.key)),
      );
    };
  }

  // メモ欄（ノートタグ）から値を集計する共通処理
  Game_BattlerBase.prototype.customParamPlus = function (paramName) {
    let value = 0;
    const traitObjects = this.traitObjects();

    for (const obj of traitObjects) {
      if (obj && obj.meta) {
        // <add_${paramName}: X> の処理
        if (obj.meta[`add_${paramName}`]) {
          value += Number(obj.meta[`add_${paramName}`]);
        }
        // <sub_${paramName}: X> の処理
        if (obj.meta[`sub_${paramName}`]) {
          value -= Number(obj.meta[`sub_${paramName}`]);
        }
      }
    }
    for (const f of paramsDef.find((p) => p.key === paramName).formula || []) {
      if (f.length === 0) continue;
      value +=
        (includes(EXISTING_PARAMS_KEYS, f) ? this[f] : this[`__${f}`]) ?? 0;
    }
    return value;
  };

  //=============================================================================
  // Window_StatusParams (ステータス画面の能力値ウィンドウ)
  //=============================================================================
  const statusParams = paramsDef.filter(
    (p) => p.visible && p.key !== "mhp" && p.key !== "mmp",
  );

  // 表示する項目の総数を増やす
  Window_StatusParams.prototype.maxItems = function () {
    // visible のパラメータの個数をセット
    // ただし mhp, mmp は表示しない
    return statusParams.length;
  };

  // 項目の描画処理を拡張
  Window_StatusParams.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const param = statusParams[index];
    const exParam = EXISTING_PARAMS.find((p) => p.key === param.key);
    this.changeTextColor(ColorManager.systemColor());
    // パラメータ名描画
    this.drawText(
      exParam?.nameId === undefined
        ? param.name
        : TextManager.param(exParam.nameId),
      rect.x,
      rect.y,
      160,
    );
    // パラメータ値描画
    this.resetTextColor();
    this.drawText(
      exParam?.paramId === undefined
        ? this._actor[`__${param.key}`]
        : this._actor[exParam.type](exParam.paramId),
      rect.x + 160,
      rect.y,
      60,
      "right",
    );
  };

  //=============================================================================
  // Window_EquipStatus (ステータス画面の能力値ウィンドウ)
  //=============================================================================
  const equipParams = paramsDef.filter((p) => p.visible);
  console.debug(equipParams);

  Window_EquipStatus.prototype.drawAllParams = function () {
    for (let i = 0; i < equipParams.length; i++) {
      const x = this.itemPadding();
      const y = this.paramY(i);
      this.drawItem(x, y, i);
    }
  };

  Window_EquipStatus.prototype.drawParamName = function (x, y, paramId) {
    const param = equipParams[paramId];
    const exParam = EXISTING_PARAMS.find((p) => p.key === param.key);
    const width = this.paramX() - this.itemPadding() * 2;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(
      exParam?.nameId === undefined
        ? param.name
        : TextManager.param(exParam.nameId),
      x,
      y,
      width,
    );
  };

  Window_EquipStatus.prototype.drawCurrentParam = function (x, y, paramId) {
    const param = equipParams[paramId];
    const exParam = EXISTING_PARAMS.find((p) => p.key === param.key);
    const paramWidth = this.paramWidth();
    this.resetTextColor();
    this.drawText(
      exParam?.paramId === undefined
        ? this._actor[`__${param.key}`]
        : this._actor[exParam.type](exParam.paramId),
      x,
      y,
      paramWidth,
      "right",
    );
  };

  Window_EquipStatus.prototype.drawNewParam = function (x, y, paramId) {
    const param = equipParams[paramId];
    const exParam = EXISTING_PARAMS.find((p) => p.key === param.key);
    const paramWidth = this.paramWidth();
    let newValue, diffValue;
    if (exParam?.paramId === undefined) {
      newValue = this._tempActor[`__${param.key}`];
      diffValue = this._actor[`__${param.key}`];
    } else {
      newValue = this._tempActor[exParam.type](exParam.paramId);
      diffValue = this._actor[exParam.type](exParam.paramId);
    }
    // 変化しない場合は非表示
    if (newValue === diffValue) return;
    this.changeTextColor(ColorManager.paramchangeTextColor(diffValue));
    this.drawText(newValue, x, y, paramWidth, "right");
  };
};

/**
 * プラグイン設定からパラメータを取得し、パラメータ定義を生成する
 *
 * @returns パラメータ定義
 */
const getParams = () => {
  const script = document.currentScript;
  /**
   * @type Record<'MaximumHitPoints' | 'MaximumMagicPoints' | 'AttackPower' | 'DefensePower' | 'MagicAttackPower' | 'MagicDefensePower' | 'Agility' | 'Luck' | 'HitRate' | 'EvasionRate' | 'CriticalRate' | 'CriticalEvasionRate' | 'MagicEvasionRate' | 'MagicReflectionRate' | 'CounterAttackRate' | 'HPRegenerationRate' | 'MPRegenerationRate' | 'TPRegenerationRate' | 'TargetRate' | 'GuardEffectRate' | 'RecoverEffectRate' | 'Pharmocology' | 'MPCostRate' | 'TPChargeRate' | 'PhysicalDamageRate' | 'MagicDamageRate' | 'FloorDamageRate' | 'ExperienceRate', Partial<{ name: string; visible: boolean; displayOrder: number }>> & { ParamJson: Array<Partial<{ key: string; name: string; min: string; max: number; visible: boolean; displayOrder: number; formula: Array<string> }>>}
   */
  const params = PluginManagerEx.createParameter(script);

  /**
   * 組み込みパラメータ
   *
   * @type Record<'maximumHitPoints' | 'maximumMagicPoints' | 'attackPower' | 'defensePower' | 'magicAttackPower' | 'magicDefensePower' | 'agility' | 'luck' | 'hitRate' | 'evasionRate' | 'criticalRate' | 'criticalEvasionRate' | 'magicEvasionRate' | 'magicReflectionRate' | 'counterAttackRate' | 'hpRegenerationRate' | 'mpRegenerationRate' | 'tpRegenerationRate' | 'targetRate' | 'guardEffectRate' | 'recoverEffectRate' | 'pharmocology' | 'mpCostRate' | 'tpChargeRate' | 'physicalDamageRate' | 'magicDamageRate' | 'floorDamageRate' | 'experienceRate', { key: string; name?: string; visible: boolean; displayOrder?: number }>
   */
  const builtInParams = {
    // 通常能力値
    maximumHitPoints: {
      key: "mhp",
      visible: params.MaximumHitPoints.visible ?? false,
      displayOrder: params.MaximumHitPoints.displayOrder ?? -3,
    },
    maximumMagicPoints: {
      key: "mmp",
      visible: params.MaximumMagicPoints.visible ?? false,
      displayOrder: params.MaximumMagicPoints.displayOrder ?? -2,
    },
    attackPower: {
      key: "atk",
      visible: params.AttackPower.visible ?? true,
      displayOrder: params.AttackPower.displayOrder ?? 0,
    },
    defensePower: {
      key: "def",
      visible: params.DefensePower.visible ?? true,
      displayOrder: params.DefensePower.displayOrder ?? 1,
    },
    magicAttackPower: {
      key: "mat",
      visible: params.MagicAttackPower.visible ?? true,
      displayOrder: params.MagicAttackPower.displayOrder ?? 2,
    },
    magicDefensePower: {
      key: "mdf",
      visible: params.MagicDefensePower.visible ?? true,
      displayOrder: params.MagicDefensePower.displayOrder ?? 3,
    },
    agility: {
      key: "agi",
      visible: params.Agility.visible ?? true,
      displayOrder: params.Agility.displayOrder ?? 4,
    },
    luck: {
      key: "luk",
      visible: params.Luck.visible ?? true,
      displayOrder: params.Luck.displayOrder ?? 5,
    },
    // 追加能力値
    hitRate: {
      key: "hit",
      visible: params.HitRate.visible ?? false,
      displayOrder: params.HitRate.displayOrder,
    },
    evasionRate: {
      key: "eva",
      visible: params.EvasionRate.visible ?? false,
      displayOrder: params.EvasionRate.displayOrder,
    },
    criticalRate: {
      key: "cri",
      name: params.CriticalRate.name,
      visible: params.CriticalRate.visible ?? false,
      displayOrder: params.CriticalRate.displayOrder,
    },
    criticalEvasionRate: {
      key: "cev",
      name: params.CriticalEvasionRate.name,
      visible: params.CriticalEvasionRate.visible ?? false,
      displayOrder: params.CriticalEvasionRate.displayOrder,
    },
    magicEvasionRate: {
      key: "mev",
      name: params.MagicEvasionRate.name,
      visible: params.MagicEvasionRate.visible ?? false,
      displayOrder: params.MagicEvasionRate.displayOrder,
    },
    magicReflectionRate: {
      key: "mrf",
      name: params.MagicReflectionRate.name,
      visible: params.MagicReflectionRate.visible ?? false,
      displayOrder: params.MagicReflectionRate.displayOrder,
    },
    counterAttackRate: {
      key: "cnt",
      name: params.CounterAttackRate.name,
      visible: params.CounterAttackRate.visible ?? false,
      displayOrder: params.CounterAttackRate.displayOrder,
    },
    hpRegenerationRate: {
      key: "hrg",
      name: params.HPRegenerationRate.name,
      visible: params.HPRegenerationRate.visible ?? false,
      displayOrder: params.HPRegenerationRate.displayOrder,
    },
    mpRegenerationRate: {
      key: "mrg",
      name: params.MPRegenerationRate.name,
      visible: params.MPRegenerationRate.visible ?? false,
      displayOrder: params.MPRegenerationRate.displayOrder,
    },
    tpRegenerationRate: {
      key: "trg",
      name: params.TPRegenerationRate.name,
      visible: params.TPRegenerationRate.visible ?? false,
      displayOrder: params.TPRegenerationRate.displayOrder,
    },
    // 特殊能力値
    targetRate: {
      key: "tgr",
      name: params.TargetRate.name,
      visible: params.TargetRate.visible ?? false,
      displayOrder: params.TargetRate.displayOrder,
    },
    guardEffectRate: {
      key: "grd",
      name: params.GuardEffectRate.name,
      visible: params.GuardEffectRate.visible ?? false,
      displayOrder: params.GuardEffectRate.displayOrder,
    },
    recoverEffectRate: {
      key: "rec",
      name: params.RecoverEffectRate.name,
      visible: params.RecoverEffectRate.visible ?? false,
      displayOrder: params.RecoverEffectRate.displayOrder,
    },
    pharmocology: {
      key: "pha",
      name: params.Pharmocology.name,
      visible: params.Pharmocology.visible ?? false,
      displayOrder: params.Pharmocology.displayOrder,
    },
    mpCostRate: {
      key: "mcr",
      name: params.MPCostRate.name,
      visible: params.MPCostRate.visible ?? false,
      displayOrder: params.MPCostRate.displayOrder,
    },
    tpChargeRate: {
      key: "tcr",
      name: params.TPChargeRate.name,
      visible: params.TPChargeRate.visible ?? false,
      displayOrder: params.TPChargeRate.displayOrder,
    },
    physicalDamageRate: {
      key: "pdr",
      name: params.PhysicalDamageRate.name,
      visible: params.PhysicalDamageRate.visible || false,
      displayOrder: params.PhysicalDamageRate.displayOrder,
    },
    magicDamageRate: {
      key: "mdr",
      name: params.MagicDamageRate.name,
      visible: params.MagicDamageRate.visible ?? false,
      displayOrder: params.MagicDamageRate.displayOrder,
    },
    floorDamageRate: {
      key: "fdr",
      name: params.FloorDamageRate.name,
      visible: params.FloorDamageRate.visible ?? false,
      displayOrder: params.FloorDamageRate.displayOrder,
    },
    experienceRate: {
      key: "exr",
      name: params.ExperienceRate.name,
      visible: params.ExperienceRate.visible ?? false,
      displayOrder: params.ExperienceRate.displayOrder,
    },
  };

  /**
   * @type Array<Partial<{ key: string; name: string; min: string; max: number; visible: boolean; displayOrder: number; formula: Array<string> }>>
   */
  const temporaryParams = params.ParamJson || [];
  /**
   * @type Array<{ key: string; name: string; min: number; max?: number; visible: boolean; displayOrder?: number; builtInIndex?: boolean; formula: Array<string> }>
   */
  const additionalParams = temporaryParams.map((tp, index) => ({
    key: tp.key ?? `key_${index}`,
    name: tp.name ?? `パラメータ${index}`,
    min: Number(tp.min) || 0,
    max: tp.max,
    visible: tp.visible ?? true,
    formula: tp.formula ?? [],
    displayOrder: tp.displayOrder,
  }));
  /**
   * @type Array<{ key: string; name?: string; min?: number; max?: number; visible: boolean; displayOrder?: number; formula?: Array<string> }>
   */
  const paramsDef = [
    builtInParams.maximumHitPoints,
    builtInParams.maximumMagicPoints,
    builtInParams.attackPower,
    builtInParams.defensePower,
    builtInParams.magicAttackPower,
    builtInParams.magicDefensePower,
    builtInParams.agility,
    builtInParams.luck,
    builtInParams.hitRate,
    builtInParams.evasionRate,
    builtInParams.criticalRate,
    builtInParams.criticalEvasionRate,
    builtInParams.magicEvasionRate,
    builtInParams.magicReflectionRate,
    builtInParams.counterAttackRate,
    builtInParams.hpRegenerationRate,
    builtInParams.mpRegenerationRate,
    builtInParams.tpRegenerationRate,
    builtInParams.targetRate,
    builtInParams.guardEffectRate,
    builtInParams.recoverEffectRate,
    builtInParams.pharmocology,
    builtInParams.mpCostRate,
    builtInParams.tpChargeRate,
    builtInParams.physicalDamageRate,
    builtInParams.magicDamageRate,
    builtInParams.floorDamageRate,
    builtInParams.experienceRate,
  ].concat(additionalParams);

  return paramsDef.sort(
    (a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100),
  );
};

applyPlugin();
