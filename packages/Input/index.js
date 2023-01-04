import CompInput from './src/Index.vue'
// 提供 install 安装方法，供按需引入
CompInput.install = function (Vue) {
  Vue.component(CompInput.name, CompInput)
}

export default CompInput
