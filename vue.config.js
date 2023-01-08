// commonjs
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const { resolve, getComponentsEntries } = require('./build/utils')

module.exports = {
  // pages: {
  //   index: {
  //   // page 的入口
  //     entry: 'src/main.js',
  //     // 模板来源
  //     template: 'public/index.html',
  //     // 在 dist/index.html 的输出
  //     filename: 'index.html',
  //     // 提取通用的chunk和vendor chunk
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   }
  // },
  outputDir: resolve('lib'),
  configureWebpack: {
    entry: {
      ...getComponentsEntries('packages')
    },
    output: {
      filename: '[name]/index.js',
      libraryTarget: 'umd',
      libraryExport: 'default',
      library: 'junzheng-comp'
    },
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    externals: {
      vue: 'Vue',
      'element-ui': 'ELEMENT',
      sortablejs: 'Sortable'
    }
  },
  css: {
    sourceMap: true,
    extract: {
      filename: '[name]/style.css'
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.delete('splitChunks')
      config.plugins.delete('copy')
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')
      config.plugins.delete('html')
      config.plugins.delete('hmr')
      config.plugins.delete('app')

      config.module.rule('fonts').use('url-loader').tap(option => {
        option.fallback.options.name = 'static/fonts/[name].[hash:10].[ext]'
        return option
      })
    }

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
