import { WebpackPluginI18n } from "./webpack-plugin-i18n.js";

export function rsbuildPluginI18n(options = {}) {
  const name = "rsbuild-plugin-extract-i18n";
  return {
    name,
    setup(api) {
      api.modifyBundlerChain(chain => {
        chain.plugin(name).use(WebpackPluginI18n, [options]);
      });
    }
  };
}
