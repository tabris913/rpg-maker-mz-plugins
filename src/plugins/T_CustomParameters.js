//=============================================================================
// RPG Maker MZ - T_CustomParameters
//=============================================================================

"use strict";

/*:
 * @target MZ
 * @plugindesc 能力値カスタムプラグイン
 * @author tosshie
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @base T_PluginBase
 * @orderAfter T_PluginBase
 *
 * @param HitPointsVisible
 *   @text HP表示
 *   @desc
 *   @type boolean
 *   @default true
 * @param MagicPointsVisible
 *   @text MP表示
 *   @desc
 *   @type boolean
 *   @default true
 * @param -*-*-*- 通常能力値 -*-*-*-
 *   @text
 *   @desc
 *   @type
 *   @default
 * @param MaximumHitPoints
 *   @text 最大HP [mhp]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"2","maxDebuff":"2","visible":"false","displayOrder":"0"}
 * @param MaximumMagicPoints
 *   @text 最大MP [mmp]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"2","maxDebuff":"2","visible":"false","displayOrder":"0"}
 * @param AttackPower
 *   @text 攻撃力 [atk]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"2","maxDebuff":"2","visible":"true","displayOrder":"0"}
 * @param DefensePower
 *   @text 防御力 [def]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"2","maxDebuff":"2","visible":"true","displayOrder":"1"}
 * @param MagicAttackPower
 *   @text 魔法力 [mat]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"2","maxDebuff":"2","visible":"true","displayOrder":"2"}
 * @param MagicDefensePower
 *   @text 魔法防御 [mdf]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"2","maxDebuff":"2","visible":"true","displayOrder":"3"}
 * @param Agility
 *   @text 敏捷性 [agi]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"2","maxDebuff":"2","visible":"true","displayOrder":"4"}
 * @param Luck
 *   @text 運 [luk]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"2","maxDebuff":"2","visible":"true","displayOrder":"5"}
 * @param -*-*-*- 追加能力値 -*-*-*-
 *   @text
 *   @desc
 *   @type
 *   @default
 * @param HitRate
 *   @text 命中率 [hit]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"6"}
 * @param EvasionRate
 *   @text 回避率 [eva]
 *   @desc
 *   @type struct<BuiltInParam1Def>
 *   @default {"maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"7"}
 * @param CriticalRate
 *   @text 会心率 [cri]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"会心率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"8"}
 * @param CriticalEvasionRate
 *   @text 会心回避率 [cev]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"会心回避率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"9"}
 * @param MagicEvasionRate
 *   @text 魔法回避率 [mev]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"魔法回避率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"10"}
 * @param MagicReflectionRate
 *   @text 魔法反射率 [mrf]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"魔法反射率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"11"}
 * @param CounterAttackRate
 *   @text 反撃率 [cnt]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"反撃率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"12"}
 * @param HPRegenerationRate
 *   @text HP再生率 [hrg]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"HP再生率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"13"}
 * @param MPRegenerationRate
 *   @text MP再生率 [mrg]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"MP再生率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"14"}
 * @param TPRegenerationRate
 *   @text TP再生率 [trg]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"TP再生率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"15"}
 * @param -*-*-*- 特殊能力値 -*-*-*-
 *   @text
 *   @desc
 *   @type
 *   @default
 * @param TargetRate
 *   @text 狙われ率 [tgr]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"狙われ率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"16"}
 * @param GuardEffectRate
 *   @text 防御効果率 [grd]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"防御効果率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"17"}
 * @param RecoverEffectRate
 *   @text 回復効果率 [rec]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"回復効果率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"18"}
 * @param Pharmocology
 *   @text 薬の知識 [pha]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"薬の知識","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"19"}
 * @param MPCostRate
 *   @text MP消費率 [mcr]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"MP消費率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"20"}
 * @param TPChargeRate
 *   @text TPチャージ率 [tcr]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"TPチャージ率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"21"}
 * @param PhysicalDamageRate
 *   @text 物理ダメージ率 [pdr]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"物理ダメージ率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"22"}
 * @param MagicDamageRate
 *   @text 魔法ダメージ率 [mdr]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"魔法ダメージ率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"23"}
 * @param FloorDamageRate
 *   @text 床ダメージ率 [fdr]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"床ダメージ率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"24"}
 * @param ExperienceRate
 *   @text 経験獲得率 [exr]
 *   @desc
 *   @type struct<BuiltInParam2Def>
 *   @default {"name":"経験獲得率","maxBuff":"0","maxDebuff":"0","visible":"false","displayOrder":"25"}
 * @param -*-*-*- 独自能力値 -*-*-*-
 *   @text
 *   @desc
 *   @type
 *   @default
 * @param ParamJson
 *   @text パラメータ定義
 *   @desc
 *   @type struct<ParamDef>[]
 *   @default []
 * @param -*-*-*- その他設定 -*-*-*-
 *   @text
 *   @desc
 *   @type
 *   @default
 * @param buffRate
 *   @text バフ変動率
 *   @desc
 *   @type number
 *   @default 0.25
 *
 * @help
 * ================================
 * CustomParameters.js [ja] v1.0.0
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
 * - 既存の能力値(通常能力値・追加能力値・特殊能力値)の表示/非表示を切り替える
 * - オリジナルの能力値(独自能力値)を追加する
 * - 別の能力値の値を合算した能力値を作成する
 * - 命中率や回避率のような隠し能力値をステータス欄に表示させる
 * - 能力値の表示順を変更する
 * - バフ/デバフ1段階あたりの変化率を変更する
 *
 * # ⚠️注意点⚠️
 *
 * 能力値表示を変更するプラグインと競合する可能性があります
 *
 * # 設定方法
 * ## プラグイン設定
 * ### HP表示・MP表示
 * トップメニューやバトル画面での表示を切り替えます．
 * TPの表示切り替えはデータベース「システム1」のオプションで行ってください．
 *
 * ### 能力値(共通)
 * - 能力値名
 * 　表示する能力値の名称を設定します．通常能力値および命中率・回避率の名称は，
 * 　データベース「用語」で設定してください．
 * - 最大のバフ/デバフ段階
 * 　バフないしデバフを何段階まで重ねがけできるかを設定します．デフォルトではい
 * 　ずれも2段階まで重ねがけ可能です．
 * - 表示/非表示
 * 　ステータス画面および装備画面でのステータスの表示を切り替えます．最大HPおよ
 * 　び最大MPに関しては，装備画面での表示のみ切り替わります．
 * - 表示順
 * 　ステータスの表示順を設定します．設定値が小さい順に表示され，同じ値が指定さ
 * 　れている場合は，設定画面の上にあるパラメータから順に表示されます．
 *
 * ### 独自能力値
 * - 能力値キー
 * 　能力値をシステム的に区別するためのキーを設定します．
 * - 最小値/最大値
 * 　能力値が取りうる最小/最大の値を設定します．デフォルトでは最小値が0，最大値
 * 　は正の無限大です．
 * - 確率能力値
 * 　能力値が確率を表すものであるかを設定します．確率能力値に指定すると，最大値
 *   が内部的に自動で1になります．
 * - 成長タイプ
 * 　レベルアップと共に能力値が上昇する場合は「レベル成長」(grow)を指定してくだ
 * 　さい．他の能力値の合算を含め，それ以外の場合は「固定」(fixed)を指定してく
 * 　ださい．
 * - 合算能力値
 * 　他の能力値の値から計算する場合は，計算式を指定してください．既存能力値の能
 * 　力値キーは，名前の後ろにカッコ[]で示してあります．リストで複数の計算式を指
 * 　定可能ですが，すべて合算になります．
 * 　e.g. 「2 * a.atk + a.mat」
 * 　     --> 「2 * a.atk」と「a.mat」を別々に指定するのと等しい
 *
 * ### その他設定
 * - バフ変動率
 * 　デフォルトではバフが1段階つくと数値が25%上昇(1.25倍)になります．デバフが1
 * 　段階つくと数値が25%下降(0.75倍)になります．この変化率を変更できます．
 *
 * ## データベース
 * データベースのメモ欄に1行ずつタグを記述することで，さまざまな設定が可能です．
 *
 * ### 職業
 * 能力値の成長の仕方をメモに設定します．プラグイン設定で成長タイプを「レベル成
 * 長 (grow)」にした能力値のみ反映されます．
 * 成長曲線を指定するか，あるいはすべてのレベルに対して値を個別設定する必要があ
 * ります．
 *
 * <{key}_growCurve: {value}>
 * 　成長曲線を設定します．カンマ区切りで3つの値を受け付け，それぞれレベル1での
 * 　数値，最大レベルでの数値，成長タイプです．成長タイプは曲線生成と同じく21段
 * 　階で，標準を0として10に近づくほど晩熟，-10に近づくほど早熟になります．
 * 　e.g. <dex_growCurve: 10,500,0>
 * 　     --> レベル1では10，最大レベルでは500，成長タイプは標準です
 * <{key}_mode: drastic>
 * 　成長タイプを急進モードに設定します．このタグを未指定の場合は通常能力値と同
 * 　じ上がり方になるので，具体的な値は能力値曲線を参照してください．急進モード
 * 　は，通常よりも早熟・晩熟の特徴の出方が激しくなります．
 * <{key}_maxLevel: {value}>
 * 　成長する最大レベルを設定します．このタグで指定したレベルまでに最大値に達し，
 * 　それ以降はレベルアップしても成長しません．設定しない場合は，99が最大になり
 * 　ます．
 * 　e.g. <dex_maxLevel: 50>
 * 　     --> レベル50で器用さの成長が止まります
 * <{key}_lv{value}: {value}>
 * 　任意のレベルの値を設定します．成長曲線での値よりもこのタグの指定が勝ちます．
 *   能力値の最大値が決まっている場合は，それ以上の値を指定していても最大値にな
 *   ります．
 * 　e.g. <dex_lv99: 900>
 * 　     --> レベル99の器用さは900になります
 *
 * ### スキル
 * 計算式に独自能力値を組み込めます．能力値キーの前にアンダースコア(_)が2つ必要
 * です．
 *
 * e.g. a.atk * 4 + a.__dex - b.def * 2
 * 　   --> 攻撃者の攻撃力の4倍 + 器用さ - 相手の防御力の2倍
 *
 * ### アイテム
 * 能力値の変化をメモに設定します．
 *
 * <add_{key}: {value}>
 * 　能力値を上昇させます．
 * 　e.g. <add_dex: 10>
 * 　     --> 使用すると器用さが10上がります
 *
 * ### 武器・防具
 * 能力値の変化をメモに設定します．
 *
 * <add_{key}: {value}>
 * 　能力値を上昇させます．
 * 　e.g. <add_dex: 10>
 * 　     --> 装備すると器用さが10上がります
 * <prod_{key}: {value}>
 * 　能力値に補正をかけます．
 * 　e.g. <prod_dex: 1.5>
 * 　     --> 装備すると器用さが1.5倍になります
 *
 * ### 敵キャラ
 * 敵キャラの能力値をメモに設定します．
 *
 * <add_{key}: {value}>
 * 　能力値を設定します．
 * 　e.g. <add_dex: 10>
 * 　     --> 敵キャラの器用さが10上がります
 *
 * ### ステート
 * 能力値の変化をメモに設定します．
 *
 * <add_{key}: {value}>
 * 　能力値を上昇させます．
 * 　e.g. <add_dex: 10>
 * 　     --> ステートが付くと器用さが10上がります
 * <prod_{key}: {value}>
 * 　能力値に補正をかけます．
 * 　e.g. <prod_dex: 1.5>
 * 　     --> ステートが付くと器用さが1.5倍になります
 *
 * # つかいかた(例)
 *
 * - 設定を変更する場合には，該当行をダブルクリックします
 * - 設定を追加/作成する場合には，空行をダブルクリックします
 *
 * ## ステータス画面から「運」の表示を消したい
 * 1. 通常能力値「運 [luk]」の「表示/非表示」を「false」に変更する
 *
 * ## 隠しパラメータの「会心率」をステータス画面に表示させたい
 * 1. 追加能力値「会心率 [cri]」の「表示/非表示」を「true」に変更する
 *
 * ## 「敏捷性」を「会心率」より下に表示させたい
 * 1. 追加能力値「会心率 [cri]」の「表示順」を確認する
 * 2. 通常能力値「敏捷性 [agi]」の「表示順」を手順1で確認した値より大きい数値
 * 　 に変更する
 *
 * ## 「反撃率」の表示名を「カウンター率」に変更したい
 * 1. 追加能力値「反撃率 [cnt]」の「能力値名」を「カウンター率」に変更する
 *
 * ## 以下の条件の独自能力値を追加したい
 * - 総合耐久力 [end]
 * - 能力値は「防御力」と「魔法防御」の合計
 * - 表示位置は「魔法防御」と「敏捷性」の間
 *
 * 1. 「魔法防御」と「敏捷性」の表示順を確認する
 * 2. 独自能力値「パラメータ定義」をダブルクリックする
 * 3. パラメータ定義の空行をダブルクリックする
 * 4. 「能力値キー」を「end」に変更する
 * 5. 「能力値名」を「総合耐久力」に変更する
 * 6. 「合算能力値」をダブルクリックする
 * 7. 空行をダブルクリックし，「a.def」をセットする
 * 8. 空行をダブルクリックし，「a.mdf」をセットする --> OK
 * 9. 「表示順」を「魔法防御」と「敏捷性」の間の数値に変更する
 * 　※ 「魔法防御」と「敏捷性」の表示順が同じ数値の場合は，間に表示できません
 * 　※ 「魔法防御」と「敏捷性」の表示順が1しか異ならない場合は，「魔法防御」と
 * 　　 同じ数値にすると間に表示されます
 *
 * ## 以下の条件の独自能力値を追加したい(2)
 * - 器用さ [dex]
 * - レベルアップで成長する
 *
 * 1. 独自能力値「パラメータ定義」をダブルクリックする
 * 2. パラメータ定義の空行をダブルクリックする
 * 3. 「能力値キー」を「dex」に変更する
 * 4. 「能力値名」を「器用さ」に変更する
 * 5. 「成長タイプ」を「レベル成長」(grow)に変更する
 * 6. データベースで職業を開く
 * 7. 各職業に以下の形式で記載する
 * 　 <dex_growCurve: 10,900,0>  #
 *
 * ## 追加した独自能力値「総合耐久力 [end]」が10上がる防具を作りたい
 * 1. データベースで該当防具の設定を開く
 * 2. メモに以下の形式で記載する
 * 　 <add_end: 10>
 * ※ アクターや敵キャラに独自能力値を付与する場合も，メモ欄に同様の記述をすれ
 * 　 ばOKです．ただしこれは固定値の追加であり，レベルによって変動しません
 * ※ 総合耐久力を1.5倍にする装備であれば，以下の形式で記載する
 * 　 <prod_end: 1.5>
 *
 * ## スキルの計算式に独自能力値「総合耐久力 [end]」を使いたい
 * 1. データベースで該当スキルの設定を開く
 * 2. メモに以下の形式(キーの前にアンダースコア"_"を2つ付ける)で記載する
 * 　 a.atk * 4 - b.__end * 2  # 攻撃力の4倍マイナス総合耐久力の2倍
 *
 * # 今後について
 * ※すべて希望的展望であり，実現できるとは限りません
 *
 * - 独自能力値をアクターのレベルアップによって成長させたい
 * - 合算能力値を単なる合計ではなく，より複雑な計算も受け付けるようにしたい
 *
 * ================
 * Version History
 * ================
 * Ver.   Date        Desc.
 * 1.0.0  2026/05/29  初版
 */

// データベースで名称変更できる組み込み能力値
/*~struct~BuiltInParam1Def:
 * @param maxBuff
 *   @text 最大のバフ段階
 *   @desc
 *   @type number
 *   @default 2
 * @param maxDebuff
 *   @text 最大のデバフ段階
 *   @desc
 *   @type number
 *   @default 2
 * @param visible
 *   @text 表示/非表示
 *   @desc
 *   @type boolean
 *   @on 表示
 *   @off 非表示
 *   @default true
 * @param displayOrder
 *   @text 表示順
 *   @desc
 *   @type number
 *   @default 100
 */
// データベースで名称変更できない組み込み能力値
/*~struct~BuiltInParam2Def:
 * @param name
 *   @text 能力値名
 *   @desc
 *   @type string
 *   @default
 * @param maxBuff
 *   @text 最大のバフ段階
 *   @desc
 *   @type number
 *   @default 2
 * @param maxDebuff
 *   @text 最大のデバフ段階
 *   @desc
 *   @type number
 *   @default 2
 * @param visible
 *   @text 表示/非表示
 *   @desc
 *   @type boolean
 *   @on 表示
 *   @off 非表示
 *   @default true
 * @param displayOrder
 *   @text 表示順
 *   @desc
 *   @type number
 *   @default 100
 */
// 独自能力値
/*~struct~ParamDef:
 * @param key
 *   @text 能力値キー
 *   @desc
 *   @type string
 *   @default
 * @param name
 *   @text 能力値名
 *   @desc
 *   @type string
 *   @default
 * @param min
 *   @text 最小値
 *   @desc
 *   @type number
 *   @min -9007199254740991
 *   @default 0
 * @param max
 *   @text 最大値
 *   @desc
 *   @type number
 *   @default
 * @param maxBuff
 *   @text 最大のバフ段階
 *   @desc
 *   @type number
 *   @default 2
 * @param maxDebuff
 *   @text 最大のデバフ段階
 *   @desc
 *   @type number
 *   @default 2
 * @param isRate
 *   @text 確率能力値
 *   @desc
 *   @type boolean
 *   @on 確率能力値
 *   @off 非確率能力値
 *   @default false
 * @param growType
 *   @text 成長タイプ
 *   @desc
 *   @type select
 *   @default fixed
 *   @option レベル成長
 *     @value grow
 *   @option 固定
 *     @value fixed
 * @param formula
 *   @text 合算能力値
 *   @desc
 *   @type string[]
 *   @default
 * @param visible
 *   @text 表示/非表示
 *   @desc
 *   @type boolean
 *   @on 表示
 *   @off 非表示
 *   @default true
 * @param displayOrder
 *   @text 表示順
 *   @desc
 *   @type number
 *   @default 100
 */

/**
 * Global variable
 *
 * @type {import('./T_CustomParameters').GlobalV}
 */
const TCP = {};

// ---------------------------------------------------------------------------------------------------------------------
// Parameters
// ---------------------------------------------------------------------------------------------------------------------
/**
 *
 * @param {import('./T_CustomParameters').BuiltInParam2Input} definition
 * @param {Partial<import('./T_CustomParameters').BuiltInParam>} _default
 * @returns {import('./T_CustomParameters').BuiltInParam}
 */
const parseNormalParam = (definition, _default) => ({
  key: _default.key,
  maxBuff: PluginParamParser.number(definition.maxBuff, _default.maxBuff ?? 2),
  maxDebuff: PluginParamParser.number(definition.maxDebuff, _default.maxDebuff ?? 2),
  isRate: false,
  visible: PluginParamParser.boolean(definition.visible, _default.visible ?? false),
  displayOrder: PluginParamParser.number(definition.displayOrder, _default.displayOrder),
  paramId: _default.paramId,
  nameId: _default.nameId,
  type: "param",
});
/**
 *
 * @param {import('./T_CustomParameters').BuiltInParam2Input} definition
 * @param {Partial<import('./T_CustomParameters').BuiltInParam>} _default
 * @returns {import('./T_CustomParameters').BuiltInParam}
 */
const parseXSParam = (definition, _default) => ({
  key: _default.key,
  name: definition.name || _default.name,
  maxBuff: PluginParamParser.number(definition.maxBuff, _default.maxBuff ?? 0),
  maxDebuff: PluginParamParser.number(definition.maxDebuff, _default.maxDebuff ?? 0),
  isRate: true,
  visible: PluginParamParser.boolean(definition.visible, _default.visible ?? false),
  displayOrder: PluginParamParser.number(definition.displayOrder, _default.displayOrder),
  paramId: _default.paramId,
  nameId: _default.nameId,
  type: _default.type,
});

/**
 * プラグインパラメータ処理
 *
 * @param {HTMLOrSVGScriptElement | null} script
 */
const readParams = (script) => {
  /**
   * @type {import('./T_CustomParameters').RawParams}
   */
  const params = PluginManagerEx.createParameter(script);
  console.debug(params);

  /**
   * 組み込みパラメータ
   *
   * @type {import('./T_CustomParameters').BuiltInParams}
   */
  const builtInParams = {
    // 通常能力値
    maximumHitPoints: parseNormalParam(params.MaximumHitPoints, {
      key: "mhp",
      displayOrder: -3,
      paramId: 0,
      nameId: 0,
    }),
    maximumMagicPoints: parseNormalParam(params.MaximumMagicPoints, {
      key: "mmp",
      displayOrder: -2,
      paramId: 1,
      nameId: 1,
    }),
    attackPower: parseNormalParam(params.AttackPower, {
      key: "atk",
      visible: true,
      displayOrder: 0,
      paramId: 2,
      nameId: 2,
    }),
    defensePower: parseNormalParam(params.DefensePower, {
      key: "def",
      visible: true,
      displayOrder: 1,
      paramId: 3,
      nameId: 3,
    }),
    magicAttackPower: parseNormalParam(params.MagicAttackPower, {
      key: "mat",
      visible: true,
      displayOrder: 2,
      paramId: 4,
      nameId: 4,
    }),
    magicDefensePower: parseNormalParam(params.MagicDefensePower, {
      key: "mdf",
      visible: true,
      displayOrder: 3,
      paramId: 5,
      nameId: 5,
    }),
    agility: parseNormalParam(params.Agility, { key: "agi", visible: true, displayOrder: 4, paramId: 6, nameId: 6 }),
    luck: parseNormalParam(params.Luck, { key: "luk", visible: true, displayOrder: 5, paramId: 7, nameId: 7 }),
    // 追加能力値
    hitRate: parseXSParam(params.HitRate, { key: "hit", displayOrder: 6, paramId: 0, nameId: 8, type: "xparam" }),
    evasionRate: parseXSParam(params.EvasionRate, {
      key: "eva",
      displayOrder: 7,
      paramId: 1,
      nameId: 9,
      type: "xparam",
    }),
    criticalRate: parseXSParam(params.EvasionRate, {
      key: "cri",
      name: params.CriticalRate.name ?? "会心率",
      displayOrder: 8,
      paramId: 2,
      type: "xparam",
    }),
    criticalEvasionRate: parseXSParam(params.EvasionRate, {
      key: "cev",
      name: params.CriticalEvasionRate.name ?? "会心回避率",
      displayOrder: 9,
      paramId: 3,
      type: "xparam",
    }),
    magicEvasionRate: parseXSParam(params.EvasionRate, {
      key: "mev",
      name: params.MagicEvasionRate.name ?? "魔法回避率",
      displayOrder: 10,
      paramId: 4,
      type: "xparam",
    }),
    magicReflectionRate: parseXSParam(params.EvasionRate, {
      key: "mrf",
      name: params.MagicReflectionRate.name ?? "魔法反射率",
      displayOrder: 11,
      paramId: 5,
      type: "xparam",
    }),
    counterAttackRate: parseXSParam(params.EvasionRate, {
      key: "cnt",
      name: params.CounterAttackRate.name ?? "反撃率",
      displayOrder: 12,
      paramId: 6,
      type: "xparam",
    }),
    hpRegenerationRate: parseXSParam(params.EvasionRate, {
      key: "hrg",
      name: params.HPRegenerationRate.name ?? "ＨＰ再生率",
      displayOrder: 13,
      paramId: 7,
      type: "xparam",
    }),
    mpRegenerationRate: parseXSParam(params.EvasionRate, {
      key: "mrg",
      name: params.MPRegenerationRate.name ?? "ＭＰ再生率",
      displayOrder: 14,
      paramId: 8,
      type: "xparam",
    }),
    tpRegenerationRate: parseXSParam(params.EvasionRate, {
      key: "trg",
      name: params.TPRegenerationRate.name ?? "ＴＰ再生率",
      displayOrder: 15,
      paramId: 9,
      type: "xparam",
    }),
    // 特殊能力値
    targetRate: parseXSParam(params.EvasionRate, {
      key: "tgr",
      name: params.TargetRate.name ?? "狙われ率",
      displayOrder: 16,
      paramId: 0,
      type: "sparam",
    }),
    guardEffectRate: parseXSParam(params.EvasionRate, {
      key: "grd",
      name: params.GuardEffectRate.name ?? "防御効果率",
      displayOrder: 17,
      paramId: 1,
      type: "sparam",
    }),
    recoverEffectRate: parseXSParam(params.EvasionRate, {
      key: "rec",
      name: params.RecoverEffectRate.name ?? "回復効果率",
      displayOrder: 18,
      paramId: 2,
      type: "sparam",
    }),
    pharmocology: parseXSParam(params.EvasionRate, {
      key: "pha",
      name: params.Pharmocology.name ?? "薬の知識",
      displayOrder: 19,
      paramId: 3,
      type: "sparam",
    }),
    mpCostRate: parseXSParam(params.EvasionRate, {
      key: "mcr",
      name: params.MPCostRate.name ?? "ＭＰ消費率",
      displayOrder: 20,
      paramId: 4,
      type: "sparam",
    }),
    tpChargeRate: parseXSParam(params.EvasionRate, {
      key: "tcr",
      name: params.TPChargeRate.name ?? "ＴＰチャージ率",
      displayOrder: 21,
      paramId: 5,
      type: "sparam",
    }),
    physicalDamageRate: parseXSParam(params.EvasionRate, {
      key: "pdr",
      name: params.PhysicalDamageRate.name ?? "物理ダメージ率",
      displayOrder: 22,
      paramId: 6,
      type: "sparam",
    }),
    magicDamageRate: parseXSParam(params.EvasionRate, {
      key: "mdr",
      name: params.MagicDamageRate.name ?? "魔法ダメージ率",
      displayOrder: 23,
      paramId: 7,
      type: "sparam",
    }),
    floorDamageRate: parseXSParam(params.EvasionRate, {
      key: "fdr",
      name: params.FloorDamageRate.name ?? "床ダメージ率",
      displayOrder: 24,
      paramId: 8,
      type: "sparam",
    }),
    experienceRate: parseXSParam(params.EvasionRate, {
      key: "exr",
      name: params.ExperienceRate.name ?? "経験獲得率",
      displayOrder: 25,
      paramId: 9,
      type: "sparam",
    }),
  };

  /**
   * @type Array<import('./T_CustomParameters').CustomParamInput>
   */
  const temporaryParams = params.ParamJson || [];
  console.debug(temporaryParams);
  /**
   * @type Array<import('./T_CustomParameters').Cparam>
   */
  const additionalParams = temporaryParams.map((tp, index) => ({
    key: tp.key || `key_${index}`,
    name: tp.name || `パラメータ${index}`,
    min: PluginParamParser.number(tp.min, 0),
    max: PluginParamParser.number(tp.isRate ? 1 : tp.max),
    maxBuff: PluginParamParser.number(tp.maxBuff, 2),
    maxDebuff: PluginParamParser.number(tp.maxDebuff, 2),
    isRate: PluginParamParser.boolean(tp.isRate, false),
    growType: tp.growType || "fixed",
    visible: PluginParamParser.boolean(tp.visible, true),
    formula: tp.formula || [],
    displayOrder: PluginParamParser.number(tp.displayOrder, 100),
    paramId: index,
    type: "cparam",
  }));
  /**
   * @type Array<import('./T_CustomParameters').ParamsDef>
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

  TCP.paramsDef = paramsDef.sort((a, b) => (a.displayOrder ?? 100) - (b.displayOrder ?? 100));
  TCP.buffRate = params.buffRate ?? 0.25;
  TCP.paramMemo = {};
  TCP.presentValues = { HP: params.HitPoints, MP: params.MagicPoints };
};

/**
 * 独自能力値を設定する
 */
const setCustomParams = () => {
  /**
   * @type Array<import('./T_CustomParameters').Cparam>
   */
  const customParameters = TCP.paramsDef.filter((p) => p.type === "cparam");

  for (const cparam of customParameters) {
    Object.defineProperty(Game_BattlerBase.prototype, `__${cparam.key}`, {
      get: function () {
        return this.cparam(cparam.paramId);
      },
      configurable: true,
    });
  }

  let isDatabaseLoaded = false;
  let customParamForClasses = {};
  _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function () {
    if (!_DataManager_isDatabaseLoaded.call(this)) return false;
    if (!isDatabaseLoaded) {
      for (const cls of $dataClasses) {
        if (cls) {
          customParamForClasses[cls.id] = {};
          for (const cparam of customParameters) {
            customParamForClasses[cls.id][cparam.key] = {};
            for (const [key, value] of Object.entries(cls.meta)) {
              if (key.startsWith(`${cparam.key}_`)) {
                switch (key) {
                  case `${cparam.key}_growCurve`:
                    customParamForClasses[cls.id][cparam.key].growCurve = value.split(",").map(Number);
                    break;
                  case `${cparam.key}_mode`:
                    customParamForClasses[cls.id][cparam.key].mode = value;
                    break;
                  case `${cparam.key}_maxLevel`:
                  default:
                    const tagName = classMetaKey.relace(`${cparam.key}_`, "");
                    customParamForClasses[cls.id][cparam.key][tagName] = Number(value);
                }
              }
            }
          }
        }
      }
      console.debug(customParamForClasses);
      isDatabaseLoaded = true;
    }
    return true;
  };
};

// ---------------------------------------------------------------------------------------------------------------------
// Plugin main
// ---------------------------------------------------------------------------------------------------------------------
(() => {
  const script = document.currentScript;
  readParams(script);

  setCustomParams();

  // -------------------------------------------------------------------------------------------------------------------
  // Objects
  // -------------------------------------------------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Game_Action
  // --------------------------------------------------------------------------
  Game_Action.prototype.apply = function (target) {
    const result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = result.used && Math.random() >= this.itemHit(target);
    result.evaded = !result.missed && Math.random() < this.itemEva(target);
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
      if (this.item().damage.type > 0) {
        result.critical = Math.random() < this.itemCri(target);
        const value = this.makeDamageValue(target, result.critical);
        this.executeDamage(target, value);
      }
      for (const effect of this.item().effects) {
        this.applyItemEffect(target, effect);
      }
      //====================
      // 独自能力値の加算効果
      const itemMeta = this.item().meta;
      Object.entries(itemMeta).forEach(([key, value]) => {
        if (key.startsWith("add_")) {
          const paramKey = key.replace("add_", "");
          const param = TCP.paramsDef.find((p) => p.key === paramKey);
          if (param) {
            target.addCustomParam(param.paramId, Number(value));
            this.makeSuccess(target);
          }
        }
      });
      //====================
      this.applyItemUserEffect(target);
    }
    this.updateLastTarget(target);
  };

  // --------------------------------------------------------------------------
  // Game_ActionResult
  // --------------------------------------------------------------------------
  _Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function () {
    _Game_ActionResult_clear.apply(this, arguments);
    this.addedCustomBuffs = [];
    this.addedCustomDebuffs = [];
    this.removedCustomBuffs = [];
  };

  _Game_ActionResult_isStatusAffected = Game_ActionResult.prototype.isStatusAffected;
  Game_ActionResult.prototype.isStatusAffected = function () {
    return (
      _Game_ActionResult_isStatusAffected.apply(this, arguments) ||
      this.addedCustomBuffs.length > 0 ||
      this.addedCustomDebuffs.length > 0 ||
      this.removedCustomBuffs.length > 0
    );
  };

  Game_ActionResult.prototype.isCustomBuffAdded = function (cparamId) {
    return this.addedCustomBuffs.includes(cparamId);
  };

  Game_ActionResult.prototype.pushAddedCustomBuff = function (cparamId) {
    if (!this.isCustomBuffAdded(cparamId)) {
      this.addedCustomBuffs.push(cparamId);
    }
  };

  Game_ActionResult.prototype.isCustomDebuffAdded = function (cparamId) {
    return this.addedCustomDebuffs.includes(cparamId);
  };

  Game_ActionResult.prototype.pushAddedCustomDebuff = function (cparamId) {
    if (!this.isCustomDebuffAdded(cparamId)) {
      this.addedCustomDebuffs.push(cparamId);
    }
  };

  Game_ActionResult.prototype.isCustomBuffRemoved = function (cparamId) {
    return this.removedCustomBuffs.includes(cparamId);
  };

  Game_ActionResult.prototype.pushRemovedCustomBuff = function (cparamId) {
    if (!this.isCustomBuffRemoved(cparamId)) {
      this.removedCustomBuffs.push(cparamId);
    }
  };

  // --------------------------------------------------------------------------
  // Game_BattlerBase
  // --------------------------------------------------------------------------
  _Game_BattlerBase_clearParamPlus = Game_BattlerBase.prototype.clearParamPlus;
  Game_BattlerBase.prototype.clearParamPlus = function () {
    _Game_BattlerBase_clearParamPlus.apply(this, arguments);
    this._customParamPlus = Array(customParameters.length).fill(0);
  };

  _Game_BattlerBase_clearBuffs = Game_BattlerBase.prototype.clearBuffs;
  Game_BattlerBase.prototype.clearBuffs = function () {
    _Game_BattlerBase_clearBuffs.apply(this, arguments);
    this._customBuffs = Array(customParameters.length).fill(0);
    this._customBuffTurns = Array(customParameters.length).fill(0);
  };

  Game_BattlerBase.prototype.eraseCustomBuff = function (cparamId) {
    this._customBuffs[cparamId] = 0;
    this._customBuffTurns[cparamId] = 0;
  };

  Game_BattlerBase.prototype.customBuffLength = function () {
    return this._customBuffs.length;
  };

  Game_BattlerBase.prototype.customBuff = function (cparamId) {
    return this._customBuffs[cparamId];
  };

  Game_BattlerBase.prototype.isCustomBuffAffected = function (cparamId) {
    return this._customBuffs[cparamId] > 0;
  };

  Game_BattlerBase.prototype.isCustomDebuffAffected = function (cparamId) {
    return this._customBuffs[cparamId] < 0;
  };

  Game_BattlerBase.prototype.isCustomBuffOrDebuffAffected = function (cparamId) {
    return this._customBuffs[cparamId] !== 0;
  };

  Game_BattlerBase.prototype.isMaxCustomBuffAffected = function (cparamId) {
    return this._customBuffs[cparamId] === 2;
  };

  Game_BattlerBase.prototype.isMaxCustomDebuffAffected = function (cparamId) {
    return this._customBuffs[cparamId] === -2;
  };

  Game_BattlerBase.prototype.increaseCustomBuff = function (cparamId) {
    if (!this.isMaxCustomBuffAffected(cparamId)) {
      this._customBuffs[cparamId]++;
    }
  };

  Game_BattlerBase.prototype.decreaseCustomBuff = function (cparamId) {
    if (!this.isMaxCustomDebuffAffected(cparamId)) {
      this._customBuffs[cparamId]--;
    }
  };

  Game_BattlerBase.prototype.overwriteCustomBuffTurns = function (cparamId, turns) {
    if (this._customBuffTurns[cparamId] < turns) {
      this._customBuffTurns[cparamId] = turns;
    }
  };

  Game_BattlerBase.prototype.isCustomBuffExpired = function (cparamId) {
    return this._customBuffTurns[cparamId] === 0;
  };

  _Game_BattlerBase_updateBuffTurns = Game_BattlerBase.prototype.updateBuffTurns;
  Game_BattlerBase.prototype.updateBuffTurns = function () {
    _Game_BattlerBase_updateBuffTurns.apply(this, arguments);
    for (let i = 0; i < this._customBuffTurns.length; i++) {
      if (this._customBuffTurns[i] > 0) {
        this._customBuffTurns[i]--;
      }
    }
  };

  /**
   * To be overridden in Game_Actor or Game_Enemy
   *
   * @param {import('./T_CustomParameters').Cparam} param
   * @returns
   */
  Game_BattlerBase.prototype.customParamBase = function (param) {
    return 0;
  };

  /**
   *
   * @param {import('./T_CustomParameters').Cparam} param
   * @returns
   */
  Game_BattlerBase.prototype.customParamPlus = function (param) {
    return this._customParamPlus[param.paramId];
  };

  /**
   *
   * @param {import('./T_CustomParameters').Cparam} param
   * @returns
   */
  Game_BattlerBase.prototype.customParamBasePlus = function (param) {
    return Math.max(param.min, this.customParamBase(param) + this.customParamPlus(param));
  };

  /**
   * To be overridden in Game_Actor or Game_Enemy
   *
   * @param {import('./T_CustomParameters').Cparam} param
   * @returns
   */
  Game_BattlerBase.prototype.customParamRate = function (param) {
    return 1;
  };

  /**
   *
   * @param {number} cparamId
   * @returns
   */
  Game_BattlerBase.prototype.customParamBuffRate = function (cparamId) {
    return this._customBuffs[cparamId] * TCP.buffRate + 1.0;
  };

  /**
   * 追加能力値を取得する
   *
   * @param {number} cparamId
   */
  Game_BattlerBase.prototype.cparam = function (cparamId) {
    const param = customParameters.find((p) => p.paramId === cparamId);
    if (param === undefined) {
      throw new Error("指定されたIDの独自能力値が見つかりませんでした");
    }

    const value = this.customParamBasePlus(param) * this.customParamRate(cparamId) * this.customParamBuffRate(cparamId);
    const clampedValue = value.clamp(param.min ?? 0, param.max ?? Infinity);
    return param.isRate ? clampedValue : Math.round(clampedValue);
  };

  Game_BattlerBase.prototype.addCustomParam = function (cparamId, value) {
    this._customParamPlus[cparamId] += value;
    this.refresh();
  };

  // --------------------------------------------------------------------------
  // Game_Battler
  // --------------------------------------------------------------------------
  Game_Battler.prototype.addCustomBuff = function (cparamId, turns) {
    if (this.isAlive()) {
      this.increaseCustomBuff(cparamId);
      if (this.isCustomBuffAffected(cparamId)) {
        this.overwriteCustomBuffTurns(cparamId, turns);
      }
      this._result.pushAddedCustomBuff(cparamId);
      this.refresh();
    }
  };

  Game_Battler.prototype.addCustomDebuff = function (cparamId, turns) {
    if (this.isAlive()) {
      this.decreaseCustomBuff(cparamId);
      if (this.isCustomDebuffAffected(cparamId)) {
        this.overwriteCustomBuffTurns(cparamId, turns);
      }
      this._result.pushAddedCustomDebuff(cparamId);
      this.refresh();
    }
  };

  Game_Battler.prototype.removeCustomBuff = function (cparamId) {
    if (this.isAlive() && this.isCustomBuffOrDebuffAffected(cparamId)) {
      this.eraseCustomBuff(cparamId);
      this._result.pushRemovedCustomBuff(cparamId);
      this.refresh();
    }
  };

  _Game_Battler_removeAllBuffs = Game_Battler.prototype.removeAllBuffs;
  Game_Battler.prototype.removeAllBuffs = function () {
    _Game_Battler_removeAllBuffs.apply(this, arguments);
    for (let i = 0; i < this.customBuffLength(); i++) {
      this.removeCustomBuff(i);
    }
  };

  _Game_Battler_removeBuffsAuto = Game_Battler.prototype.removeBuffsAuto;
  Game_Battler.prototype.removeBuffsAuto = function () {
    _Game_Battler_removeBuffsAuto.apply(this, arguments);
    for (let i = 0; i < this.customBuffLength(); i++) {
      if (this.isCustomBuffExpired(i)) {
        this.removeCustomBuff(i);
      }
    }
  };

  // --------------------------------------------------------------------------
  // Game_Actor
  // --------------------------------------------------------------------------
  _Game_Actor_paramRate = Game_Actor.prototype.paramRate;
  Game_Actor.prototype.paramRate = function (paramId) {
    let value = _Game_Actor_paramRate.call(this, paramId);
    const param = TCP.paramsDef.find((p) => p.type === "param" && p.paramId === paramId);
    if (param) {
      for (const item of this.equips() || []) {
        if (item && item.meta[`prod_${param.key}`] !== undefined) {
          value *= Number(item.meta[`prod_${param.key}`]);
        }
      }
    }
    return value;
  };

  /**
   *
   * @param {import('./T_CustomParameters').Cparam} cparam
   * @see Game_BattlerBase.prototype.customParamBase
   */
  Game_Actor.prototype.customParamBase = function (cparam) {
    /**
     * @type number
     */
    const currentClassId = this.currentClass().id;
    if (TCP.paramMemo[currentClassId]?.[cparam.key]?.[this._level] !== undefined) {
      return TCP.paramMemo[currentClassId][cparam.key][this._level];
    }

    let currentValue = 0;

    switch (cparam.growType) {
      case "fixed":
        if (cparam.formula.length) {
          const a = this;
          currentValue = cparam.formula.reduce((prev, cur) => {
            try {
              return prev + eval(cur) ?? 0;
            } catch (error) {
              console.error(error, cur);
              return prev;
            }
          }, 0);
        } else {
          // ベースは最小値，装備等で加算していく
          currentValue = cparam.min;
        }
        break;
      case "grow":
        const configs = customParamForClasses[currentClassId][cparam.key];
        const levelConfig = configs[`lv${this._level}`];
        if (typeof levelConfig === "number" && !Number.isNaN(levelConfig)) {
          currentValue = configs[`lv${this._level}`];
        } else {
          const growCurveConfig = configs.growCurve;
          if (!Array.isArray(growCurveConfig) || growCurveConfig.some((c) => typeof c !== "number")) {
            throw new Error(`${cparam.name}の計算/取得ができません (レベル ${this._level})`);
          }

          const [start, end, grow] = growCurveConfig;

          const maxLevel = configs.maxLevel ?? this.maxLevel();
          if (this._level >= maxLevel) {
            currentValue = end;
          } else {
            const VALUE_DIFF = end - start;
            const PREV_LEVEL = this._level - 1;
            const SEMI_MAX_LEVEL = maxLevel - 1;

            if (configs.mode?.trim() === "drastic") {
              currentValue =
                grow < 0
                  ? end - VALUE_DIFF * ((this._level - maxLevel) / -SEMI_MAX_LEVEL) ** -(grow - 1)
                  : start + VALUE_DIFF * (PREV_LEVEL / SEMI_MAX_LEVEL) ** (grow + 1);
            } else {
              const early =
                start +
                (PREV_LEVEL * (VALUE_DIFF / SEMI_MAX_LEVEL) * (SEMI_MAX_LEVEL * 2 - PREV_LEVEL)) / SEMI_MAX_LEVEL;
              const late = start + (PREV_LEVEL * (VALUE_DIFF / SEMI_MAX_LEVEL) * PREV_LEVEL) / SEMI_MAX_LEVEL;

              currentValue = early * ((20 - grow - 10) / 20) + late * ((grow + 10) / 20);
            }
          }
        }
    }

    // 確率ではない能力値なら整数化(切り上げ)
    if (!cparam.isRate) currentValue = Math.ceil(currentValue);

    if (TCP.paramMemo[currentClassId] === undefined) {
      TCP.paramMemo[currentClassId] = {};
    }
    if (TCP.paramMemo[currentClassId][cparam.key] === undefined) {
      TCP.paramMemo[currentClassId][cparam.key] = {};
    }
    TCP.paramMemo[currentClassId][cparam.key][this._level] = currentValue;

    return currentValue;
  };

  /**
   *
   * @param {import('./T_CustomParameters').Cparam} param
   * @see Game_BattlerBase.prototype.customParamPlus
   */
  Game_Actor.prototype.customParamPlus = function (param) {
    let value = Game_Battler.prototype.customParamPlus.call(this, param);
    // 加算のみ
    for (const item of this.equips() || []) {
      if (item && item.meta[`add_${param.key}`] !== undefined) {
        value += Number(item.meta[`add_${param.key}`]);
      }
    }
    for (const state of this.states()) {
      if (state && state.meta[`add_${param.key}`] !== undefined) {
        value += Number(state.meta[`add_${param.key}`]);
      }
    }

    return value;
  };

  /**
   *
   * @param {import('./T_CustomParameters').Cparam} param
   * @see Game_BattlerBase.prototype.customParamRate
   */
  Game_Actor.prototype.customParamRate = function (param) {
    let value = 1;
    for (const item of this.equips() || []) {
      if (item && item.meta[`prod_${param.key}`] !== undefined) {
        value *= Number(item.meta[`prod_${param.key}`]);
      }
    }
    for (const state of this.states()) {
      if (state && state.meta[`prod_${param.key}`] !== undefined) {
        value *= Number(state.meta[`prod_${param.key}`]);
      }
    }

    return value;
  };

  // --------------------------------------------------------------------------
  // Game_Enemy
  // --------------------------------------------------------------------------
  /**
   *
   * @param {import('./T_CustomParameters').Cparam} cparam
   * @see Game_BattlerBase.prototype.customParamBase
   */
  Game_Enemy.prototype.customParamBase = function (cparam) {
    // レベルアップ対応は別プラグイン化
    let value = 0;
    if (this.enemy().meta && this.enemy().meta[`add_${cparam.key}`] !== undefined) {
      value += Number(this.enemy().meta[`add_${cparam.key}`]) || 0;
    }

    return value;
  };

  /**
   *
   * @param {import('./T_CustomParameters').Cparam} cparam
   * @see Game_BattlerBase.prototype.customParamPlus
   */
  Game_Enemy.prototype.customParamPlus = function (cparam) {
    let value = Game_Battler.prototype.customParamPlus.call(this, cparam);
    // 加算のみ
    for (const state of this.states()) {
      if (state && state.meta[`add_${cparam.key}`] !== undefined) {
        value += Number(state.meta[`add_${cparam.key}`]) || 0;
      }
    }

    return value;
  };

  /**
   *
   * @param {import('./T_CustomParameters').Cparam} cparam
   * @see Game_BattlerBase.prototype.customParamRate
   */
  Game_Enemy.prototype.customParamRate = function (cparam) {
    let value = 1;
    for (const state of this.states()) {
      if (state && state.meta[`prod_${cparam.key}`] !== undefined) {
        value *= Number(state.meta[`prod_${cparam.key}`]) || 1;
      }
    }

    return value;
  };

  // -------------------------------------------------------------------------------------------------------------------
  // Windows
  // -------------------------------------------------------------------------------------------------------------------
  const visibleParams = TCP.paramsDef.filter((p) => p.visible);
  const visibleParamsInStatus = TCP.paramsDef.filter((p) => p.visible && p.key !== "mhp" && p.key !== "mmp");

  // --------------------------------------------------------------------------
  // Window_StatusBase
  // --------------------------------------------------------------------------
  /**
   *
   * @param {Game_Actor} actor
   * @param {number} x
   * @param {number} y
   * @override
   */
  Window_StatusBase.prototype.placeBasicGauges = function (actor, x, y) {
    let count = 0;
    if (TCP.presentValues.HP) {
      this.placeGauge(actor, "hp", x, y);
      count++;
    }
    if (TCP.presentValues.MP) {
      this.placeGauge(actor, "mp", x, y + this.gaugeLineHeight() * count);
      count++;
    }
    if ($dataSystem.optDisplayTp) {
      this.placeGauge(actor, "tp", x, y + this.gaugeLineHeight() * count);
      count++;
    }
  };

  // --------------------------------------------------------------------------
  // Window_EquipStatus
  // --------------------------------------------------------------------------
  Window_EquipStatus.prototype.drawAllParams = function () {
    for (let i = 0; i < visibleParams.length; i++) {
      const x = this.itemPadding();
      const y = this.paramY(i);
      this.drawItem(x, y, i);
    }
  };

  Window_EquipStatus.prototype.drawParamName = function (x, y, paramId) {
    const param = visibleParams[paramId];
    const width = this.paramX() - this.itemPadding() * 2;
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(
      (param.nameId === undefined ? param.name : TextManager.param(param.nameId)) + (param.isRate ? " [%]" : ""),
      x,
      y,
      width,
    );
  };

  Window_EquipStatus.prototype.drawCurrentParam = function (x, y, paramId) {
    const param = visibleParams[paramId];
    const paramWidth = this.paramWidth();
    const value = this._actor[param.type](param.paramId);
    this.resetTextColor();
    this.drawText(param.isRate ? Math.round(value * 100) : value, x, y, paramWidth, "right");
  };

  Window_EquipStatus.prototype.drawNewParam = function (x, y, paramId) {
    const param = visibleParams[paramId];
    const paramWidth = this.paramWidth();
    const newValue = this._tempActor[param.type](param.paramId);
    const diffValue = this._actor[param.type](param.paramId);
    // 変化しない場合は非表示
    if (newValue === diffValue) return;
    this.changeTextColor(ColorManager.paramchangeTextColor(diffValue));
    this.drawText(param.isRate ? Math.round(newValue * 100) : newValue, x, y, paramWidth, "right");
  };

  // --------------------------------------------------------------------------
  // Window_StatusParams
  // --------------------------------------------------------------------------
  // 表示する項目の総数を増やす
  Window_StatusParams.prototype.maxItems = function () {
    // visible のパラメータの個数をセット
    // ただし mhp, mmp は表示しない
    return visibleParamsInStatus.length;
  };

  // 項目の描画処理を拡張
  Window_StatusParams.prototype.drawItem = function (index) {
    const rect = this.itemLineRect(index);
    const param = visibleParamsInStatus[index];
    this.changeTextColor(ColorManager.systemColor());
    // パラメータ名描画
    this.drawText(
      (param.nameId === undefined ? param.name : TextManager.param(param.nameId)) + (param.isRate ? " [%]" : ""),
      rect.x,
      rect.y,
      160,
    );
    // パラメータ値描画
    const value = this._actor[param.type](param.paramId);
    this.resetTextColor();
    this.drawText(param.isRate ? Math.round(value * 100) : value, rect.x + 160, rect.y, 60, "right");
  };
})();
