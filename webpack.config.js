const path = require('path')

module.exports = {
  module: {
    rules: [{
      include: [path.resolve(__dirname, 'src')],
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          '@babel/plugin-proposal-object-rest-spread'
        ],
        presets: [
          ['@babel/preset-env', {modules: false}],
          ['@babel/preset-react']
        ]
      }
    },
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  entry: './src/main.js',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  mode: 'development'
}
