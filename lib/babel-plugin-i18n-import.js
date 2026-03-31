import { declare } from "@babel/helper-plugin-utils";
import { babelI18nImportTransform } from "./i18n-import-transform.js";
import { hasI18nUsage } from "./cache.js";
import { createFilterFn } from "./utils.js";
import { defaultOptions } from "./options.js";

const babelPluginI18nImport = declare((api, options) => {
  api.assertVersion(7);

  options = { ...defaultOptions, ...options };

  if (!options.enabled || !options.autoImportI18n) {
    return {
      name: "babel-extract-i18n-import",
      visitor: {}
    };
  }

  const filter = createFilterFn(options);

  return {
    name: "babel-extract-i18n-import",
    pre(file) {
      const filename = file.opts.filename || "";
      const [path, query] = filename.split("?");
      if (query?.includes("type=style")) {
        this.__enabled = false;
      } else {
        this.__enabled = filter(path) && hasI18nUsage(path);
      }
      this.__runInBabelPlugin = true;
    },
    visitor: {
      Program(path, state) {
        babelI18nImportTransform(path, options, state);
      }
    }
  };
});

export { babelPluginI18nImport };

export default babelPluginI18nImport;

/**
 * // babel.config.js
export default {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "extract-i18n-plugin/babel-plugin-i18n-import",
      {
        ...options
      }
    ]
  ]
};
*/
