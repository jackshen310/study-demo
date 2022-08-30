module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 支持load wasm，参考：https://dev.to/nicolasrannou/wasm-in-create-react-app-4-in-5mn-without-ejecting-cf6
      const wasmExtensionRegExp = /\.wasm$/;
      webpackConfig.resolve.extensions.push(".wasm");

      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
            oneOf.exclude.push(wasmExtensionRegExp);
          }
        });
      });

      const wasmLoader = {
        test: /\.wasm$/,
        include: /wasm/,
        exclude: /node_modules/,
        type: "webassembly/async",
      };
      webpackConfig.module.rules.push(wasmLoader);

      webpackConfig.experiments = { asyncWebAssembly: true };

      return webpackConfig;
    },
  },
};
