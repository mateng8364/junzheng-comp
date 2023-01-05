<template>
  <div class="z-page-footer-item" :style="`text-align: ${align}`">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ZPageFooterItem',
  props: {
    align: {
      type: String,
      default: 'left'
    }
  },
  inject: ['zPage']
}
</script>
<style lang="scss">
.z-page-footer-item {
  flex: 1;
  // display: flex;
  // align-items: center;
  // justify-content: space-between;
  // > div {
  // }
}
</style>
