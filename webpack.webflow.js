const path = require('path');

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  module: {
    rules: (currentRules) => {
      return currentRules.map((rule) => {
        // Update CSS rule to use our PostCSS config
        if (
          rule.test instanceof RegExp &&
          rule.test.test("test.css") &&
          Array.isArray(rule.use)
        ) {
          return {
            ...rule,
            use: rule.use.map((loader) => {
              if (typeof loader === 'object' && loader.loader && loader.loader.includes('postcss-loader')) {
                return {
                  ...loader,
                  options: {
                    ...loader.options,
                    postcssOptions: {
                      config: path.resolve(__dirname, './postcss.config.mjs'),
                    },
                  },
                };
              }
              return loader;
            }),
          };
        }
        return rule;
      });
    },
  },
};
