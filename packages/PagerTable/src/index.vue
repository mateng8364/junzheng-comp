<template>
  <div class="z-pager-table" :class="{ 'is-disabled': disabled }">
    <div class="z-pager-table__inner">
      <vxe-grid
        v-if="isGrid"
        ref="table"
        v-bind="tableOptions"
        :columns="columns"
        v-on="$listeners"
        @custom="onCustom"
      />
      <vxe-table v-else ref="table" v-bind="tableOptions" v-on="$listeners" @custom="onCustom">
        <slot></slot>
      </vxe-table>
    </div>
    <vxe-pager
      v-if="showPager && !disabled"
      class="z-pager-table__pager"
      border
      align="left"
      :loading="loading"
      :current-page.sync="$pageIndex"
      :page-size.sync="$pageSize"
      :total="total"
      :page-sizes="pageSizes"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="onPageChange"
    />
  </div>
</template>
<script>
import Sortable from 'sortablejs'
// import VXETable from 'vxe-table'
// import XEUtils from 'xe-utils'

// VXETable.menus.add('DRAG_UP', (params, event) => {
//   // let { $table } = params
//   // $table.exportData()
//   console.log('DRAG_UP', params, event)
// })

// VXETable.menus.add('DRAG_DOWN', (params, event) => {
//   // let { $table, menu } = params
//   // // 读取自定义的参数
//   // $table.insert(menu.record)
//   console.log('DRAG_DOWN', params, event)
// })

const DEFAULT_EXPAND_CONFIG = {
  labelField: '展开',
  iconOpen: 'el-icon-caret-bottom',
  iconClose: 'el-icon-caret-right'
  // lazy: true,
  // loadMethod: this.loadDesc
}

export default {
  name: 'ZPagerTable',
  inheritAttrs: false,
  props: {
    id: {
      type: String,
      default: undefined
    },
    disabled: Boolean,
    loading: Boolean,
    pageIndex: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 50
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    data: {
      type: [Object, Array],
      default: () => ({})
    },
    dragable: {
      type: [Boolean, String],
      default: false,
      validator (value) {
        return [true, false, 'column', 'row'].includes(value)
      }
    },
    columns: {
      type: Array,
      default: undefined
    },
    scrollY: {
      type: Object,
      default: () => ({ enabled: true, gt: 40 })
    },
    scrollX: {
      type: Object,
      default: undefined
    },
    area: Boolean,
    treeConfig: {
      type: Object,
      default: undefined
    },
    expandConfig: {
      type: Object,
      default: undefined
    },
    showOverflow: {
      type: [Boolean, String],
      default: undefined
    },
    customConfig: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 判断是否使用vxe-grid渲染表格
    isGrid () {
      return this.dragable === 'column' || (this.columns && this.columns.length)
    },
    // 简单通过data是否是数组来判断是否显示分页条
    showPager () {
      return !Array.isArray(this.data)
    },
    tableOptions () {
      const options = {
        id: this.id,
        loading: this.loading,
        data: this.tableData,
        border: 'full',
        stripe: true,
        'auto-resize': true,
        height: 'auto',
        'scroll-x': this.scrollX,
        'scroll-y': this.scrollY,
        'print-config': {},
        'export-config': {},
        'clip-config': this.clipConfig,
        'mouse-config': this.mouseConfig,
        'keyboard-config': this.keyboardConfig,
        'menu-config': this.menuConfig,
        'show-overflow': this.showOverflow,
        'tree-config': this.treeConfig,
        ...this.$attrs
      }
      // console.log(options)

      if (options['merge-footer-items']) {
        options['merge-footer-items'] = [...options['merge-footer-items']]
      }

      if (this.expandConfig) {
        options['expand-config'] = {
          ...DEFAULT_EXPAND_CONFIG,
          ...this.expandConfig,
          lazy: !!this.expandConfig.loadMethod
        }
      }

      // :tree-config="{children: 'children'}"
      if (this.treeConfig || this.expandConfig) {
        if (options['scroll-y']) options['scroll-y'].enabled = false
        if (options['scroll-x']) options['scroll-x'].enabled = false
      }
      if (
        this.showOverflow === undefined &&
        !(options['scroll-y'].enabled === false || options['scroll-y'].gt === -1)
      ) {
        // scroll-y.enabled = false or scroll-y.gt = -1 关闭
        options['show-overflow'] = true
        options['show-header-overflow'] = true
        options['show-footer-overflow'] = true
      }

      if (this.dragable) {
        // dragable === true 或 dragable=== row，则需要行拖拽
        if (this.dragable === true || this.dragable === 'row') {
          options['row-key'] = true
          // 行拖拽，指的是数据行，这是区域选择功能会干扰拖拽，应该关闭
          options['clip-config'] = {
            ...this.mouseConfig,
            isCopy: false,
            isCut: false,
            isPaste: false
          }
          options['mouse-config'] = { ...this.mouseConfig, area: false }
          options['keyboard-config'] = { ...this.keyboardConfig, isClip: false, isArray: false }
          options['menu-config'] = {
            ...this.menuConfig,
            enabled: false
            // body: {
            //   options: [
            //     [
            //       { prefixIcon: 'el-icon-document-copy', code: 'COPY_CELL', name: '复制 (Ctrl+C)' },
            //       { prefixIcon: 'el-icon-arrow-up', code: 'DRAG_UP', name: '向上' },
            //       { prefixIcon: 'el-icon-arrow-down', code: 'DRAG_DOWN', name: '向下' }
            //     ]
            //   ]
            // }
          }
        } else {
          options['column-key'] = true
        }
      }

      if (!this.area) {
        options['mouse-config'] = { ...this.mouseConfig, area: false }
      }

      if (this.customConfig && this.customConfig.storage) {
        options['custom-config'] = { storage: true, ...this.customConfig }
      }

      // console.log(options)
      return options
    },
    $pageIndex: {
      get () {
        return this.pageIndex
      },
      set (pageIndex) {
        this.$emit('update:pageIndex', pageIndex)
      }
    },
    $pageSize: {
      get () {
        return this.pageSize
      },
      set (pageSize) {
        this.$emit('update:pageSize', pageSize)
      }
    },
    total () {
      return this.showPager && this.data ? this.data.total || 0 : 0
    },
    tableData () {
      return this.showPager && this.data ? this.data.data || [] : this.data
    },
    // vxe-table默认开启：复制、剪切、粘贴，这里将剪贴、粘贴关闭
    clipConfig () {
      return { isCopy: true, isCut: false, isPaste: false }
    },
    // 鼠标区域选择配置
    mouseConfig () {
      return {
        // 开启单元格选中功能（只对 edit-config.mode=cell 有效）
        selected: false,
        area: true, // 默认值：false，
        // 开启后可以通过鼠标左键按住区域内右下角扩展按钮，将区域横向或纵向扩大（支持扩大区域并复制值）
        extension: true // 默认值： true，但是需要area=true才有效；ps：这个功能体验不好
      }
    },
    keyboardConfig () {
      return {
        isClip: true, // 是否开启（Ctrl + X 键、Ctrl + C 键、Ctrl + V 键）复制粘贴功能
        isArrow: true // 是否开启（方向键）单元格上下左右移动功能
      }
    },
    menuConfig () {
      return {
        enabled: true, // 设为false，禁用自定义菜单（默认菜单全部恢复）
        header: { disabled: true },
        body: {
          // disabled: true, // enabled=true and disabled=true，可以禁用body区域的默认右键菜单和自定义右键菜单
          options: [
            [
              { code: 'COPY_CELL', name: '复制 (Ctrl+C)' },
              { code: 'CHART_LINE', name: '折线图' },
              { code: 'CHART_PIE', name: '饼图' },
              { code: 'CHART_BAR_X_AXIS', name: '横向柱状图' },
              { code: 'CHART_BAR_Y_AXIS', name: '纵向柱状图' }
            ]
          ]
        },
        footer: { disabled: true }
      }
    }
    // areaConfig() {
    //   return {
    //     extendByCopy: true, // 启用后有效，将被选取区域的值复制到扩展区域中
    //     extendByCalc: false
    //   }
    // },
    // expandConfig() {
    //   return {
    //     labelField: '展开',
    //     iconOpen: 'el-icon-caret-bottom',
    //     iconClose: 'el-icon-caret-right',
    //     lazy: true,
    //     loadMethod: this.loadDesc
    //   }
    // }
  },
  mounted () {
    if (this.dragable && this.dragable === 'column' && !this.columns) {
      // console.warn(
      //   '[z-pager-table warn]: 当dragable=column时，必须提供columns属性，使用vxe-table高级表格功能[vxe-grid]'
      // )
      throw new Error(
        '[z-pager-table warn]: 当dragable=column时，必须提供columns属性，使用vxe-table高级表格功能[vxe-grid]'
      )
    }
    // if (this.customStorage !== undefined && this.customStorage != null && !this.id) {
    //   console.warn(`[z-pager-table warn]: 当需要支持自定义列时（customStorage值不为空)，必须配置 id 属性`)
    // }

    if (this.dragable) {
      this.initDrag()
    }
  },
  methods: {
    initDrag () {
      // 行拖拽
      if (this.dragable === true || this.dragable === 'row') {
        if (this.isGrid) {
          this.$nextTick(() => {
            const $table = this.$refs.table
            this.sortable = Sortable.create(
              $table.$el.querySelector('.body--wrapper>.vxe-table--body tbody'),
              {
                handle: '.vxe-body--row',
                onEnd: ({ newIndex, oldIndex }) => {
                  const currRow = this.tableData.splice(oldIndex, 1)[0]
                  this.tableData.splice(newIndex, 0, currRow)
                }
                // onEnd: ({ item, oldIndex }) => {
                // const options = { children: 'children' }
                // const targetTrElem = item
                // const wrapperElem = targetTrElem.parentNode
                // const prevTrElem = targetTrElem.previousElementSibling
                // const tableData = this.tableData
                // const selfRow = $table.getRowNode(targetTrElem).item
                // const selfNode = XEUtils.findTree(tableData, (row) => row === selfRow, options)
                // if (prevTrElem) {
                //   // 移动到节点
                //   const prevRow = $table.getRowNode(prevTrElem).item
                //   const prevNode = XEUtils.findTree(tableData, (row) => row === prevRow, options)
                //   if (XEUtils.findTree(selfRow[options.children], (row) => prevRow === row, options)) {
                //     // 错误的移动
                //     const oldTrElem = wrapperElem.children[oldIndex]
                //     wrapperElem.insertBefore(targetTrElem, oldTrElem)
                //     return this.$XModal.message({ content: '不允许自己给自己拖动！', status: 'error' })
                //   }
                //   const currRow = selfNode.items.splice(selfNode.index, 1)[0]
                //   if ($table.isTreeExpandByRow(prevRow)) {
                //     // 移动到当前的子节点
                //     prevRow[options.children].splice(0, 0, currRow)
                //   } else {
                //     // 移动到相邻节点
                //     prevNode.items.splice(prevNode.index + (selfNode.index < prevNode.index ? 0 : 1), 0, currRow)
                //   }
                // } else {
                //   // 移动到第一行
                //   const currRow = selfNode.items.splice(selfNode.index, 1)[0]
                //   tableData.unshift(currRow)
                // }
                // // // 如果变动了树层级，需要刷新数据
                // // this.tableTreeData = [...tableTreeData]
                // }
              }
            )
          })
        } else {
          this.$nextTick(() => {
            const $table = this.$refs.table
            this.sortable = Sortable.create(
              $table.$el.querySelector('.body--wrapper>.vxe-table--body tbody'),
              {
                handle: '.vxe-body--row',
                onEnd: ({ newIndex, oldIndex }) => {
                  const currRow = this.tableData.splice(oldIndex, 1)[0]
                  this.tableData.splice(newIndex, 0, currRow)
                }
              }
            )
          })
        }
      } else {
        // 列拖拽
        this.$nextTick(() => {
          const $table = this.$refs.table
          this.sortable = Sortable.create(
            $table.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'),
            {
              handle: '.vxe-header--column:not(.col--fixed)',
              onEnd: ({ item, newIndex, oldIndex }) => {
                const { fullColumn, tableColumn } = $table.getTableColumn()
                const targetThElem = item
                const wrapperElem = targetThElem.parentNode
                const newColumn = fullColumn[newIndex]
                if (newColumn.fixed) {
                  // 错误的移动
                  if (newIndex > oldIndex) {
                    wrapperElem.insertBefore(targetThElem, wrapperElem.children[oldIndex])
                  } else {
                    wrapperElem.insertBefore(wrapperElem.children[oldIndex], targetThElem)
                  }
                  return this.$message({ message: '固定列不允许拖动！', type: 'error' })
                }
                // 转换真实索引
                const oldColumnIndex = $table.getColumnIndex(tableColumn[oldIndex])
                const newColumnIndex = $table.getColumnIndex(tableColumn[newIndex])
                // 移动到目标列
                const currRow = fullColumn.splice(oldColumnIndex, 1)[0]
                fullColumn.splice(newColumnIndex, 0, currRow)
                $table.loadColumn(fullColumn)
              }
            }
          )
        })
      }
    },
    // type: 'current' or 'size'
    onPageChange ({ currentPage, pageSize, type }) {
      if (type === 'size') {
        this.$pageIndex = 1
        currentPage = 1
      }
      this.$emit('search', { pageIndex: currentPage, pageSize })
    },

    connect (toolbar) {
      this.$refs.table.connect(toolbar)
    },

    updateData () {
      return this.$refs.table.updateData()
    },

    onCustom ({ type }) {
      if (type === 'confirm' || type === 'reset') {
        this.$emit('custom-store', localStorage.getItem('VXE_TABLE_CUSTOM_COLUMN_VISIBLE'))
      }
    },

    getColumns () {
      return this.$refs.table.getColumns()
    },
    openExport (options) {
      return this.$refs.table.openExport(options)
    },
    clearFilter (options) {
      this.$refs.table.clearFilter(options)
    }
  }
}
</script>
<style lang="scss">
.vxe-toolbar .vxe-custom--option-wrapper .vxe-custom--body > li,
.vxe-toolbar .vxe-custom--option-wrapper .vxe-custom--header > li {
  padding: 0.5em 1em 0.5em 2.3em;
}
.vxe-table--render-default .vxe-table--expanded {
  padding: 4.5px 10px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  border-radius: 3px;
}
.z-pager-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 6px;
  &.is-disabled {
    .vxe-table--render-default .vxe-table--border-line {
      border-width: 0;
    }
  }
  .z-pager-table__inner {
    flex: 1 1 0;
    overflow: auto;
    .vxe-loading {
      background-color: hsla(0, 0%, 100%, 0.4);
    }
  }
  .vxe-pager.z-pager-table__pager {
    margin-left: -0.25em;
    align-items: start;
    height: auto;
    margin-top: 6px;

    &.is--loading:after {
      background-color: rgba(0, 0, 0, 0);
    }
  }

  .vxe-header--column.col--filter {
    height: 60px !important;
    .vxe-cell {
      .vxe-cell--title > label {
        display: block;
      }
      max-height: 60px !important;
    }
  }
}
</style>
