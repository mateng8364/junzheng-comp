// commonjs
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

module.exports = {
  pages: {
    index: {
    // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html'
    }
  },
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  chainWebpack: config => {
  // packages和examples目录需要加入编译
    config.module
      .rule('js')
      .include.add(/packages/)
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
      // 修改它的选项...
        return options
      })
  }

}
