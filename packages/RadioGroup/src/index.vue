<template>
  <el-radio-group v-model="_value" v-bind="$attrs" v-on="$listeners">
    <el-radio-button v-for="item in options" :key="item.value" :label="item.value">
      <span>{{ item.label }}</span>
    </el-radio-button>
  </el-radio-group>
</template>
<script>
export default {
  name: 'ZRadioGroup',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Object, Number],
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
