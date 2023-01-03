import CompText from './src/Index.vue'
// 提供 install 安装方法，供按需引入
CompText.install = function (Vue) {
  Vue.component(CompText.name, CompText)
}

export default CompText
