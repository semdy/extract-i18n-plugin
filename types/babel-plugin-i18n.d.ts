import { PluginObj, PluginPass } from "@babel/core";
import { I18nOptions } from "./options";

declare const babelPluginI18n: (
  api: any,
  options?: Partial<I18nOptions>
) => PluginObj<PluginPass>;

export { babelPluginI18n };

export default babelPluginI18n;
