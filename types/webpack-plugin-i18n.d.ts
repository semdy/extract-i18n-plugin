import type { I18nOptions } from "./options";

// Compiler APIs shared by Webpack and Rspack that the plugin uses.
interface I18nCompiler {
  hooks: {
    environment: { tap(name: string, callback: () => void): void };
  };
  options: { module?: { rules?: unknown[] } };
}

export declare class WebpackPluginI18n {
  options: Partial<I18nOptions>;
  constructor(optionInfo?: Partial<I18nOptions>);
  apply(compiler: I18nCompiler): void;
}
