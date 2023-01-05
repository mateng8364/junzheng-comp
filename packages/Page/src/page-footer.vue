<template>
  <div class="z-page-footer" :style="zPage.calcWidth">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ZPageFooter',
  inject: ['zPage']
}
</script>
<style lang="scss">
.z-page-footer {
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // > div {
  // }
}
</style>
