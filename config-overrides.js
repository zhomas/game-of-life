const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const WorkerPlugin = require('worker-plugin');

module.exports = function override(config, env) {
  //do stuff with the webpack config...

  const cfg = { ...config };
  cfg.plugins.push(new WorkerPlugin());
  cfg.module.rules = [
    {
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      use: [
        { loader: 'babel-loader' },
        {
          loader: 'linaria/loader',
          options: {
            sourceMap: process.env.NODE_ENV !== 'production',
            cacheDirectory: 'src/.linaria-cache',
          },
        },
      ],
    },

    {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: process.env.NODE_ENV !== 'production',
          },
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: process.env.NODE_ENV !== 'production',
          },
        },
      ],
    },
  ];

  cfg.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    })
  );

  return cfg;
};
