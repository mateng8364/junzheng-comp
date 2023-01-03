import CompButton from './src/Index.vue'
// 提供 install 安装方法，供按需引入
CompButton.install = function (Vue) {
  Vue.component(CompButton.name, CompButton)
}

export default CompButton
