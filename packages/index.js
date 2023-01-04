import CompButton from './Button'
import CompText from './Text'
import CompInput from './Input'

const components = [
  CompButton,
  CompText,
  CompInput
]

const install = function (Vue) {
  if (install.installed) {
    return false
  }
  components.map(component => {
    Vue.component(component.name, component)
  })

  // 判断是否是直接引入文件 CDN引用
  if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
  }
}

export default install

export {
  CompButton,
  CompText,
  CompInput
}
