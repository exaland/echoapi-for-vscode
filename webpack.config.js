//@ts-check

'use strict';

const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { isArray } = require('lodash');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: 'node', // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
	mode: 'development', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2'
  },
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                },
              ],
              '@babel/preset-typescript',
            ],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
      },
    ]
  },
  devtool: 'nosources-source-map',
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        'node_modules/web-curl-to-har/assets/tree-sitter.wasm',
        'node_modules/web-curl-to-har/assets/tree-sitter-bash.wasm',
        { from: path.resolve(__dirname, 'public'), to: './' },
      ],
    }),
    // new CopyWebpackPlugin({
    //     patterns: [
    //         './node_modules/swagger-ui-dist/swagger-ui.css',
    //         './node_modules/swagger-ui-dist/swagger-ui-bundle.js',
    //         './node_modules/swagger-ui-dist/swagger-ui-standalone-preset.js',
    //         './node_modules/swagger-ui-dist/favicon-16x16.png',
    //         './node_modules/swagger-ui-dist/favicon-32x32.png'
    //     ]
    // })
]
};

const reactConfig = {
  entry:{
    sidePanel:'./src/webviews/sidePanel.tsx',
    tagPanel:'./src/webviews/tagPanel.tsx',
    // curlPanel:'./src/webviews/curlPanel.tsx',
    environmentPanel:'./src/webviews/environmentPanel.tsx',
    loginPanel:'./src/webviews/loginPanel.tsx',
    pushPanel:'./src/webviews/pushPanel.tsx',
    importDataPanel:'./src/webviews/importDataPanel.tsx',
    folderTestPanel:'./src/webviews/folderTestPanel.tsx',
    folderTestReportPanel:'./src/webviews/folderTestReportPanel.tsx',
    designPanel:'./src/webviews/designPanel.tsx',
    shareListPanel:'./src/webviews/shareListPanel.tsx',
    exportDataPanel:'./src/webviews/exportDataPanel.tsx'
  },
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  devtool: false,
  mode:'production',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'), 
    },
    fallback: {
      fs: false,
      child_process: false,
      path: false,
    },
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx', '.ico', '.less', '.css', '.svg'],
  },
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              [
                '@babel/preset-react',
                {
                  runtime: 'automatic',
                },
              ],
              '@babel/preset-typescript',
            ],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
      },
      {
        use: ['style-loader', 'css-loader', 'less-loader'],
        test: /\.(css|less)$/,
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        use: ['raw-loader'],
        test: /\.(txt)$/,
      },
      {
        type: 'asset',
        test: /\.(png|jpg|jpeg|gif)$/i,
      },
      {
        test: /\.(css|less)$|style\.ts$/,
        loader: 'string-replace-loader',
        exclude: /node_modules/,
        options: {
          search: /(\.apipost-)/g,
          replace: '.beautify-',
        },
      },
      {
        test: /globalStyle\.ts$/,
        loader: 'string-replace-loader',
        exclude: /node_modules/,
        options: {
          search: /(\.apipost-)/g,
          replace: '.beautify-',
        },
      },
    ]
  },
  plugins: [
    new NodePolyfillPlugin(),
  ],
};

const configArr = [extensionConfig];

if (process.env.NODE_ENV === 'production') {
  extensionConfig.mode = 'production';
  extensionConfig.devtool = false;
  reactConfig.devtool = false;
  if(isArray(extensionConfig?.module?.rules?.[0]?.use?.options?.plugins)){
    extensionConfig.module.rules[0].use.options.plugins.push('transform-remove-console');
  }
 
  if(isArray(reactConfig?.module?.rules?.[0]?.use?.options?.plugins)){
    reactConfig.module.rules[0].use.options.plugins.push('transform-remove-console');
  }

  extensionConfig.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console
            drop_debugger: true, // Remove debugger
          },
          output: {
            comments: false, // Remove comments
          },
        },
        extractComments: false, // Whether to extract comments to a separate file
        parallel: true, // Use multiprocessing to improve build speed
      }),
    ],
  };
  reactConfig.optimization  = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console
            drop_debugger: true, // Remove debugger
            passes: 3, // Number of compression passes
          },
          output: {
            comments: false, // Remove comments
          },
        },
        extractComments: false, // Whether to extract comments to a separate file
        parallel: true, // Use multiprocessing to improve build speed
      }),
    ],
  };
  // @ts-ignore
  configArr.push(reactConfig);
}

module.exports = configArr;