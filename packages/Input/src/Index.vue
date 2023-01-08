<template>
  <div class="comp-input">
    <el-input v-model="input" v-bind="$attrs" v-on="$listeners"></el-input>
  </div>
</template>

<script>
// import Vue from 'vue'
// import { Input } from 'element-ui'

// Vue.component(Input.name, Input)

export default {
  name: 'CompInput',
  props: {
    title: {
      type: String
    },
    value: {
      type: String || Number
    }
  },
  computed: {
    input: {
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

<style lang="scss">
.comp-input {}
</style>
