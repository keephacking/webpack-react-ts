const { resolve } = require("path");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === "production";

const config = {
  mode: isProd ? "production" : "development",
  name: 'commonjs',
  entry: {
    lib1: {
      import:'@shared/lib1',
      library: {
        // all options under `output.library` can be used here
        type: "umd",
        name: "lib1"
      },
    },
    // polyfills: "./src/shared/polyfills.ts",
    page1: {
      import: './src/pages/page1/index.tsx',
    },
    page2: {
      import: './src/pages/page2/index.tsx',
      dependOn: ['lib1']
    },
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "[name].js",
    iife: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@shared/lib1": resolve(__dirname, "src/shared/lib1")
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: resolve(__dirname, "node_modules"),
          name: 'vendor',
          chunks: 'all',
        },
      },
    }
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disable'
    })
  ]
};

if (isProd) {
  config.optimization = {
    ...config.optimization,
    // minimizer: [new TerserWebpackPlugin()],
  };
}

module.exports = config;