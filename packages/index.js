import CompInput from './Input'
import Page from './Page'
import PageBodyRow from './Page/src/page-body-row'
import PageBodyCol from './Page/src/page-body-col'
import PageFooter from './Page/src/page-footer'
import PageFooterItem from './Page/src/page-footer-item'
import Search from './Search'
import Combox from './Combox'
import RadioGroup from './RadioGroup'
import PagerTable from './PagerTable'
import Table from './Table'
import Popconfirm from './Popconfirm'
import TableSelect from './TableSelect'
import MultiTableSelect from './MultiTableSelect'
import Canton from './Canton'

const components = [
  CompInput,
  Page,
  PageBodyRow,
  PageBodyCol,
  PageFooter,
  PageFooterItem,
  Search,
  Combox,
  RadioGroup,
  PagerTable,
  Table,
  Popconfirm,
  TableSelect,
  MultiTableSelect,
  Canton
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
  CompInput,
  Page,
  PageBodyRow,
  PageBodyCol,
  PageFooter,
  PageFooterItem,
  Search,
  Combox,
  RadioGroup,
  PagerTable,
  Table,
  Popconfirm,
  TableSelect,
  MultiTableSelect,
  Canton
}
