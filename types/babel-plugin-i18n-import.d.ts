import { PluginObj } from "@babel/core";
import { I18nOptions } from "./options";

declare function babelPluginI18nImport(
  options?: Partial<I18nOptions>
): PluginObj;

export { babelPluginI18nImport };

export default babelPluginI18nImport;
