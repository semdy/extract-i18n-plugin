import { transformAsync } from "@babel/core";
import { createI18nPlugin } from "./visitors.js";
import { hasI18nUsage } from "./cache.js";
import { createFilterFn } from "./utils.js";
import { globalI18nMap } from "./core/index.js";
import { loadConfigFileByC12 } from "./loadConfigFile.js";
import { defaultOptions } from "./options.js";

export function vitePluginI18n(userConfig = {}) {
  let filter;
  let resolvedConfig = {};
  let resolvedOptions = userConfig;

  return {
    name: "vite-plugin-extract-i18n",
    enforce: "post",
    async configResolved(config) {
      resolvedConfig = config;

      const configFromFile = await loadConfigFileByC12();
      resolvedOptions = { ...defaultOptions, ...configFromFile, ...userConfig };
      filter = createFilterFn(resolvedOptions);
    },
    async transform(code, id) {
      if (!resolvedOptions.enabled) return;

      const [path, query] = id.split("?");

      if (
        query?.includes("type=style") ||
        !filter?.(path) ||
        !hasI18nUsage(path)
      ) {
        return;
      }

      const enableSourceMap =
        resolvedConfig.command === "serve"
          ? true
          : !!resolvedConfig.build?.sourcemap;

      const result = await transformAsync(code, {
        filename: path,
        babelrc: false,
        configFile: false,
        sourceMaps: enableSourceMap,
        inputSourceMap: resolvedOptions.enableCombinedSourcemap
          ? this.getCombinedSourcemap()
          : undefined,
        plugins: [createI18nPlugin(resolvedOptions, globalI18nMap)]
      });

      if (!result) return;

      return {
        code: result.code,
        map: enableSourceMap ? result.map : null
      };
    }
  };
}

/*
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginI18n } from 'extract-i18n-plugin'

export default defineConfig({
    plugins: [
        vue(),
        vitePluginI18n()
    ]
}) */
