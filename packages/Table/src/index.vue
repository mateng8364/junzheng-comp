<template>
  <div class="z-table-wrapper">
    <el-table ref="table" border height="100%" v-bind="$attrs" v-on="$listeners">
      <slot></slot>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'ZTable',
  inheritAttrs: false,
  methods: {
    clearSelection () {
      this.$refs.table.clearSelection()
    },
    toggleRowSelection (row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    }
  }
}
</script>
<style lang="scss">
.z-table-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  .el-table {
    flex-basis: 0;
  }
  .el-table th.el-table__cell {
    background-color: #f5f7fa;
  }
}
</style>
