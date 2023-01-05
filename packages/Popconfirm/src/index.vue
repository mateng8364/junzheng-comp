<template>
  <el-popover
    ref="popover"
    v-model="visible"
    v-bind="{ title: '提示', ...$attrs }"
    class="el-popover--flexless"
    trigger="manual"
  >
    <slot name="content"></slot>
    <div v-if="btns && btns.length" style="text-align: right">
      <el-button v-for="btn in btns" :key="btn.action" v-bind="btn" @click="onClick(btn)">{{
        btn.text
      }}</el-button>
    </div>
    <el-button slot="reference" v-bind="confirm" @click="onConfirm">{{ confirm.text }}</el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'ZPopconfirm',
  props: {
    btns: {
      type: Array,
      default: () => []
    },
    confirm: {
      type: Object,
      default: () => ({
        text: '按钮'
      }),
      require: true
    }
  },
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    document.addEventListener('click', this.handleClose)
  },
  beforeDestroy () {
    document.removeEventListener('click', this.handleClose)
  },
  methods: {
    onClick (btn) {
      this.visible = false
      this.$emit('btns', btn)
    },
    onConfirm () {
      this.visible = true
    },
    handleClose (e) {
      if (e.target === this.$refs.popover.$el || this.$refs.popover.$el.contains(e.target)) return

      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.el-popover--flexless {
  align-self: start;
}
</style>
