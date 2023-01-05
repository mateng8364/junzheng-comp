import component from './src'
// 提供 install 安装方法，供按需引入
component.install = function (Vue) {
  Vue.component(component.name, component)
}

export default component
