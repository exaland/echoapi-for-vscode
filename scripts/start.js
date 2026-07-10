const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
const path = require('path');

const devConfig = {
  entry: {
    sidePanel: path.resolve(__dirname, '../src/webviews/sidePanel.tsx'),
    tagPanel: path.resolve(__dirname, '../src/webviews/tagPanel.tsx'),
    environmentPanel: path.resolve(__dirname, '../src/webviews/environmentPanel.tsx'),
    loginPanel: path.resolve(__dirname, '../src/webviews/loginPanel.tsx'),
    pushPanel: path.resolve(__dirname, '../src/webviews/pushPanel.tsx'),
    importDataPanel: path.resolve(__dirname, '../src/webviews/importDataPanel.tsx'),
    folderTestPanel: path.resolve(__dirname, '../src/webviews/folderTestPanel.tsx'),
    folderTestReportPanel: path.resolve(__dirname, '../src/webviews/folderTestReportPanel.tsx'),
    designPanel: path.resolve(__dirname, '../src/webviews/designPanel.tsx'),
    shareListPanel: path.resolve(__dirname, '../src/webviews/shareListPanel.tsx'),
    exportDataPanel: path.resolve(__dirname, '../src/webviews/exportDataPanel.tsx'),
  },
  output: {
    filename: '[name].bundle.js', // Use different names for output files
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  mode: 'development',
  devServer: {
    static: path.join(__dirname, '../dist'), // Tell server to serve static files from dist folder
    allowedHosts: 'all',
    client: {
      overlay: false, // Completely disable error and warning overlay display
    },
    // port: 3008, // Development server port
    // hot: true, // Enable Hot Module Replacement (HMR)
    // open: true, // Auto-open browser on startup
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
    new CopyWebpackPlugin({
      patterns: [
        'node_modules/web-curl-to-har/assets/tree-sitter.wasm',
        'node_modules/web-curl-to-har/assets/tree-sitter-bash.wasm',
        { from: path.resolve(__dirname, '../public'), to: './' },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'sidePanel.html',
      template: path.resolve(__dirname, '../src/index.html'),
      chunks: ['sidePanel'], // Corresponds to page 1
    }),

  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
    fallback: {
      fs: false,
      child_process: false,
      path: false,
    },
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx', '.ico', '.less', '.css', '.svg'],
  },
};

module.exports = devConfig;