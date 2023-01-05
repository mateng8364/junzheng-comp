<template>
  <el-select v-model="_value" v-bind="$attrs" v-on="$listeners">
    <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.value" />
  </el-select>
</template>
<script>
export default {
  name: 'ZCombox',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Object, Number, Array],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    _value: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
