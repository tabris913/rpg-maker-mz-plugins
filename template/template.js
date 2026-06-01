//=============================================================================
// RPG Maker MZ - 
//=============================================================================

"use strict";

/*:
 * @target MZ
 * @plugindesc
 * @author tosshie
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * 
 * @param
 *   @text
 *   @desc
 *   @type
 *   @default
 * 
 * @help 
 * ================================
 * .js [ja] v0.0.1
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

/**
 * プラグインメイン処理
 */
const mainProcess = () => {
    const script = document.currentScript;
    readParams(script);
};

/**
 * プラグインパラメータ処理
 * 
 * @param {HTMLOrSVGScriptElement | null} script 
 */
const readParams = (script) => {
    const params = PluginManagerEx.createParameter(script);
};

mainProcess();
