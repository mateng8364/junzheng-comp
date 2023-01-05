<template>
  <div>
    <el-row type="flex">
      <el-col>
        <el-input v-model="keyword" placeholder="请输入关键字查询" clearable />
      </el-col>
      <el-col style="flex: 0 0 75px; text-align: right">
        <el-button type="primary" icon="el-icon-search" :loading="loading" @click="onSearch"
          >查询</el-button
        >
      </el-col>
    </el-row>
    <el-table
      ref="table"
      v-loading="loading"
      class="z-multi-table-select--table"
      border
      stripe
      max-height="300"
      :data="tableData"
      :row-key="rowKey"
      @row-click="onRowClick"
      @select-all="onSelectAll"
      @select="onSelect"
    >
      <el-table-column type="selection" reserve-selection align="center" width="60" />
      <el-table-column v-for="c in columns" :key="c.property" v-bind="c">
        <template slot-scope="{ row, column }">
          <div v-html="highlight(row, column)"></div>
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
  name: 'ZMultiTableSelectPopoverContent',
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
      type: [Object, Array],
      default: undefined
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
      data_: undefined,
      selection: []
    }
  },
  computed: {
    _data_ () {
      return this.data_ || this.data
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
    highlightReg () {
      return this.keyword ? new RegExp('(' + this.keyword.replace(/ /, '|') + ')', 'g') : null
    }
  },
  created () {
    this.debounceSearch = debounce(300, this.onSearch)
  },
  mounted () {
    if (this.search) {
      this.onSearch()
    }
  },
  methods: {
    highlight (row, column) {
      if (row[column.property] && this.highlightReg) {
        return row[column.property].replace(this.highlightReg, '<font color="red">$1</font>')
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
      this.loading = true
      this.data_ = await this.search({
        pageIndex: this.pageIndex - 1,
        pageSize: this.pageSize,
        [this.searchProp]: this.keyword,
        [this.labelProp]: this.keyword
      })
      this.loading = false
    },
    onRowClick (row) {
      const selection = []
      let exists = false
      for (const current of this.selection) {
        if (current[this.rowKey] === row[this.rowKey]) {
          this.$refs.table.toggleRowSelection(current, false)
          exists = true
        } else {
          selection.push(current)
        }
      }
      if (!exists) {
        selection.push(row)
        this.$refs.table.toggleRowSelection(row, true)
      }
      this.selection = selection
      this.onChoose()
    },
    onSelectAll (selection) {
      this.selection = [...selection]
      this.onChoose()
    },
    onSelect (selection) {
      this.selection = [...selection]
      this.onChoose()
    },
    scrollIntoView () {
      this.$nextTick(function () {
        if (this.selection && this.selection.length > 0) {
          const indexList = []
          for (let index = 0, size = this.tableData.length; index < size; index++) {
            if (this.selection.includes(this.tableData[index])) {
              indexList.push(index)
            }
          }
          const firstIndex = Math.min(...indexList)
          const trs = this.$refs.table.bodyWrapper.querySelectorAll('tbody tr')
          if (trs[firstIndex].scrollIntoView) {
            trs[firstIndex].scrollIntoView()
          } else {
            scrollIntoView(this.$refs.table.bodyWrapper, trs[firstIndex])
          }
        }
      })
    },
    clear () {
      this.selection = []
      this.$refs.table.clearSelection()
    },
    onChoose () {
      this.$emit('choose', this.selection)
    }
  }
}
</script>
<style lang="scss">
.z-multi-table-select--table {
  margin-top: 6px;
  & + .el-pagination {
    padding: 0;
  }
}
</style>
