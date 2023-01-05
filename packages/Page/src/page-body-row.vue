<template>
  <div class="z-page-body-row" :class="className" :style="zPage.calcWidth">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ZPageBodyRow',
  props: {
    wrap: Boolean
  },
  inject: ['zPage'],
  computed: {
    className () {
      return {
        wrap: this.wrap
      }
    }
  }
}
</script>
<style lang="scss">
.z-page-body-row {
  padding: 3px;
  display: flex;
  width: 100%;
  flex: 1;
  // overflow: hidden;
  &.wrap {
    flex-wrap: wrap;
    align-content: flex-start;
  }
}
</style>
