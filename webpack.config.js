module.exports = {
  entry: { app: './index.js' },

  // Enable live reload
  devServer: {
    stats: {
      warnings: false
    }
  },

  // Map compiled code to source
  devtool: 'source-maps',

  module: {
    rules: [
      // Sass and css integration
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      // Babel integration
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/]
      }
    ]
  }
};