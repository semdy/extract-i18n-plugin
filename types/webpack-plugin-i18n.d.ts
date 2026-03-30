import webpack from "webpack";
import { I18nOptions } from "./options";

export declare class WebpackPluginI18n {
  options: Partial<I18nOptions>;
  constructor(optionInfo?: Partial<I18nOptions>);
  apply(compiler: webpack.Compiler): void;
}
