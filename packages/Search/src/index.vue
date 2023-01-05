<template>
  <div class="z-search" :class="{ 'is-collpase': toggle, collapse }">
    <div class="z-search__main">
      <slot></slot>
    </div>
    <div class="z-search__ctrl">
      <el-button type="primary" :loading="loading" icon="el-icon-search" @click="$emit('search')"
        >查询</el-button
      >
      <el-button @click="$emit('reset')">重置</el-button>
      <!-- <el-button type="text" icon="el-icon-arrow-up"  @click="onCollapse">{{ collapseTitle }}</el-button> -->
      <el-tooltip :content="collapseTitle" placement="top-start">
        <el-button icon="el-icon-arrow-left" circle :title="collapseTitle" @click="onCollapse" />
      </el-tooltip>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ZSearch',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    toggle: { type: Boolean, default: false }
  },
  data () {
    return {
      collapse: true
    }
  },
  computed: {
    collapseTitle () {
      return this.collapse ? '展开' : '收起'
    }
  },
  methods: {
    onCollapse () {
      this.collapse = !this.collapse
    }
  }
}
</script>
<style lang="scss">
.z-search {
  display: flex;
  padding: 10px 10px 5px 10px;

  .z-search__main {
    flex: 1;
    padding-right: 12px;

    .el-form-item--mini.el-form-item,
    .el-form-item--mini.el-form-item {
      margin-bottom: 5px;
    }
  }

  .z-search__ctrl {
    flex: 0 0 125px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding-bottom: 5px;

    .el-button:last-child {
      display: none;

      i {
        transition: transform 0.3s;
        transform: rotate(-90deg);
      }
    }
  }

  &.is-collpase {
    .z-search__ctrl {
      flex: 0 0 160px;
      .el-button:last-child {
        display: initial;
      }
    }

    &.collapse {
      .z-search__main {
        height: 33px;
        overflow: hidden;
      }

      .z-search__ctrl .el-button:last-child i {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
