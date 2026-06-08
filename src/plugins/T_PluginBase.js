/// <reference path="./T_PluginBase.d.ts" />
//=============================================================================
// RPG Maker MZ - T_PluginBase
//=============================================================================

/*:
 * @target MZ
 * @plugindesc プラグイン基盤
 * @author tosshie
 *
 * @help
 * ================================
 * T_PluginBase.js [ja] v1.0.0
 * ================================
 *
 * # PluginParamParser
 * すべてのプラグインパラメータはテキスト欄を直接操作することで空文字列になり得
 * ます．このとき未設定(undefined)として扱うためのパーサーです．第2引数でデフォ
 * ルト値を与えることも可能です．
 *
 * PluginParamParser.boolean("")        --> undefined
 * PluginParamParser.boolean("", false) --> false
 * PluginParamParser.boolean(true)      --> true
 * PluginParamParser.boolean(0)         --> undefined
 * PluginParamParser.boolean(0, true)   --> true
 *
 * PluginParamParser.number("")         --> undefiend
 * PluginParamParser.number("", 1)      --> 1
 * PluginParamParser.number(0)          --> 0
 * PluginParamParser.number("hello")    --> undefined
 * PluginParamParser.number("hello", 1) --> 1
 *
 * PluginParamParser.string("")                 --> ""
 * PluginParamParser.string("hello")            --> "hello"
 * PluginParamParser.string(0)                  --> "0"
 * PluginParamParser.string(undefined)          --> undefined
 * PluginParamParser.string(undefined, "hello") --> "hello"
 *
 * ================
 * Version History
 * ================
 * Ver.   Date        Desc.
 * 1.0.0  yyyy/MM/dd  初版作成
 */

"use strict";

const PluginParamParser = {
  array: (value) => {
    if (Array.isArray(value)) return value;

    return [];
  },
  boolean: (value, defaultValue = undefined) => {
    if (defaultValue !== undefined && typeof defaultValue !== "boolean") {
      throw new Error("Default value must be a boolean value or undefined.");
    }

    if (value === undefined || value === null || value === "") {
      return defaultValue;
    }
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      if (["true", "t", "on", "yes", "y"].includes(value.toLowerCase())) return true;
      if (["false", "f", "off", "no", "n"].includes(value.toLocaleLowerCase())) return false;
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "boolean" ? parsed : defaultValue;
      } catch (error) {
        return defaultValue;
      }
    }

    return defaultValue;
  },
  number: (value, defaultValue = undefined) => {
    if (defaultValue !== undefined && typeof defaultValue !== "number") {
      throw new Error("Default value must be a number or undefined.");
    }

    if (value === undefined || value === null || value === "") {
      return defaultValue;
    }
    if (typeof value === "number") {
      return Number.isNaN(value) ? defaultValue : value;
    }
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "number" && !Number.isNaN(parsed) ? parsed : defaultValue;
      } catch (error) {
        return defaultValue;
      }
    }

    return defaultValue;
  },
  string: (value, defaultValue = undefined) => {
    if (defaultValue !== undefined && typeof defaultValue !== "string") {
      throw new Error("Default value must be a string or undefined.");
    }

    if (value === undefined || value === null) return defaultValue;

    if (typeof value === "string") return value;

    return String(value);
  },
  struct: (value) => {
    if (typeof value === "object") return value;

    return undefined;
  },
};

(() => {
  window.PluginParamParser = PluginParamParser;

  /**
   * @memberof JsExtensions
   * @param {number} min
   * @param {number} max (excluded)
   * @returns {number}
   */
  Math.randomRangeInt = function (min, max) {
    if (max < min) {
      throw new RangeError("");
    }

    return Math.randomInt(max - min) + min;
  };
})();
