import ZTableSelect from './src/Index.vue'
// 提供 install 安装方法，供按需引入
ZTableSelect.install = function (Vue) {
  Vue.component(ZTableSelect.name, ZTableSelect)
}

export default ZTableSelect
