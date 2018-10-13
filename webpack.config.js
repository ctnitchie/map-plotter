const path = require('path')

const babelOpts = {
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread'
  ],
  presets: [
    ['@babel/preset-env', {modules: false}],
    ['@babel/preset-react']
  ]
};

module.exports = {
  module: {
    rules: [{
      include: [path.resolve(__dirname, 'src')],
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: babelOpts
      }]
    },
    {
      test: /\.tsx?$/,
      use: [{
        loader: 'babel-loader',
        options: babelOpts
      }, {
        loader: 'ts-loader'
      }],
      exclude: /node_modules/
    },
    {
      test: /\.s[ac]ss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss']
  },

  entry: './src/main.ts',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  mode: 'development'
}
