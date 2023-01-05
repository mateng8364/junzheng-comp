<template>
  <div>
    <el-table
      ref="table"
      v-loading="loading"
      class="z-table-select--table"
      border
      stripe
      max-height="300"
      :data="tableData"
      :row-key="rowKey"
      highlight-current-row
      @row-click="onRowClick"
    >
      <el-table-column v-for="c in columns" :key="c.prop || c.type" v-bind="c">
        <template slot-scope="{ row, column, $index }">
          <div v-if="column.type === 'index'">{{ $index + 1 }}</div>
          <div v-else v-html="highlight(row, column)"></div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="showPager"
      :current-page.sync="pageIndex"
      :page-size.sync="pageSize"
      :total="total"
      :disabled="loading"
      :page-sizes="[10, 20, 30, 50, 100]"
      :pager-count="5"
      small
      layout="total, prev, pager, next"
      @current-change="onPageIndexChange"
      @size-change="onPageSizeChange"
    />
  </div>
</template>

<script>
import debounce from 'throttle-debounce/debounce'
import scrollIntoView from 'element-ui/src/utils/scroll-into-view'

export default {
  name: 'ZTableSelectPopoverContent',
  props: {
    searchProp: {
      type: String,
      default: undefined
    },
    labelProp: {
      type: String,
      default: undefined
    },
    rowKey: {
      type: String,
      default: undefined
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    search: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {
      loading: false,
      keyword: undefined,
      pageIndex: 1,
      pageSize: 20,
      dataSource: undefined,
      currentIndex: -1
    }
  },
  computed: {
    _data_ () {
      return this.dataSource || this.data
    },
    // 简单通过data是否是数组来判断是否显示分页条
    showPager () {
      if (this._data_) {
        return !Array.isArray(this._data_)
      }
      return false
    },
    tableData () {
      return this.showPager ? this._data_.data || [] : this._data_
    },
    total () {
      return this.showPager ? this._data_.total || 0 : 0
    },
    disabled () {
      return this.selection.length === 0
    },
    pattern () {
      return this.keyword ? new RegExp('(' + this.keyword.replace(/ /, '|') + ')', 'g') : null
    }
  },
  created () {
    // 外部调用，传入改变的搜索关键字，并且跳转到首页
    this.debounceSearch = debounce(300, this.__search__)
  },
  methods: {
    highlight (row, column) {
      if (row[column.property] && this.pattern) {
        return row[column.property].replace(this.pattern, '<font color="red">$1</font>')
      }
      return row[column.property]
    },
    onPageIndexChange () {
      this.onSearch()
    },
    onPageSizeChange () {
      this.pageIndex = 1
      this.onSearch()
    },
    async onSearch () {
      this.$refs.table.setCurrentRow()
      this.currentIndex = -1
      this.loading = true
      this.dataSource = await this.search({
        pageIndex: this.pageIndex - 1,
        pageSize: this.pageSize,
        [this.searchProp]: this.keyword,
        [this.labelProp]: this.keyword
      })
      this.loading = false
    },
    __search__ (keyword) {
      this.keyword = keyword || this.keyword
      this.pageIndex = 1
      this.onSearch()
    },
    next () {
      if (this.tableData.length) {
        this.currentIndex++
        if (this.currentIndex === this.tableData.length) {
          this.currentIndex = 0
        }
        this.$refs.table.setCurrentRow(this.tableData[this.currentIndex])
        this.scrollIntoView()
      }
    },
    prev () {
      if (this.tableData.length) {
        this.currentIndex--
        if (this.currentIndex < 0) {
          this.currentIndex = this.tableData.length - 1
        }
        this.$refs.table.setCurrentRow(this.tableData[this.currentIndex])
        this.scrollIntoView()
      }
    },
    scrollIntoView () {
      this.$nextTick(function () {
        if (this.currentIndex !== -1) {
          const trs = this.$refs.table.bodyWrapper.querySelectorAll('tbody tr')
          if (trs[this.currentIndex].scrollIntoView) {
            trs[this.currentIndex].scrollIntoView()
          } else {
            scrollIntoView(this.$refs.table.bodyWrapper, trs[this.currentIndex])
          }
        }
      })
    },
    select () {
      if (this.currentIndex !== -1) {
        this.onRowClick(this.tableData[this.currentIndex])
      }
    },
    onRowClick (row) {
      this.currentIndex = this.tableData.indexOf(row)
      this.$emit('choose', row)
    },
    clear () {
      this.currentIndex = -1
      this.$refs.table.setCurrentRow()
    }
  }
}
</script>
<style lang="scss">
.z-table-select--table {
  .el-table__body tr > td {
    // 在方向键快速切换的时候，背景色渐变动画播放没完成就进入下一行高亮，导致之前的背景色没消除掉
    transition: unset;
  }
  & + .el-pagination {
    padding: 0;
  }
}
</style>
