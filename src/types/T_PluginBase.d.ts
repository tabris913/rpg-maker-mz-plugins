declare const PluginParamParser: {
  array: <T>(value: string | Array<T>) => Array<T>;
  boolean: (value: unknown, defaultValue?: boolean | undefined) => boolean | undefined;
  number: (value: unknown, defaultValue?: number | undefined) => number | undefined;
  string: (value: unknown, defaultValue?: string | undefined) => string | undefined;
  struct: <T>(value: string | T) => T | undefined;
};

type ParamInput = string | number | boolean | null | Array<ParamInput> | Record<string, ParamInput>;

declare global {
  interface Window {
    PluginParamParser: PluginParamParser;
  }
}

interface Math {
  randomRangeInt: (min: number, max: number) => number;
}
