<template>
  <el-cascader
    v-if="type === 'cascader'"
    ref="cascader"
    v-model="select"
    v-bind="$attrs"
    :props="__cascaderProps"
    :options="options"
    @change="onChange"
  />
  <Select v-else :levels="levels" />
</template>
<script>
import Select from './select'
const LEVELS = ['province', 'city', 'county', 'town']

export default {
  name: 'ZCanton',
  components: { Select },
  inheritAttrs: false,
  props: {
    value: {
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: 'cascader',
      validate: function (type) {
        return ['cascader', 'select'].includes(type)
      }
    },
    level: {
      type: String,
      default: 'city', // 'province-city'
      validate: function (level) {
        return LEVELS.includes(level)
      }
    },
    lazyLoad: {
      type: Function,
      default: null
    },
    cascaderProps: {
      type: Object,
      default: function () {
        return {
          value: 'value',
          label: 'label',
          children: 'children'
        }
      }
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: []
    }
  },
  computed: {
    select: {
      get () {
        return this.value
      },
      set (select) {
        this.$emit('input', select)
      }
    },
    levels () {
      return LEVELS.slice(0, this.levelIndex)
    },
    levelIndex () {
      return LEVELS.indexOf(this.level)
    },
    __cascaderProps () {
      const props = this.cascaderProps ? { ...this.cascaderProps } : {}
      if (this.type === 'cascader' && this.lazyLoad) {
        props.lazy = true
        props.lazyLoad = this.__lazyLoad
      }
      props.multiple = this.multiple
      return props
    }
  },
  created () {
    this.$__root = undefined
    this.$__cache = {}
    console.log(this.$__cache, this)
  },
  mounted () {
    this.$watch('defaultValue', this.resolveDefaultValue, { immediate: true })
  },
  methods: {
    getCache ({ value, root }) {
      if (root) {
        return this.$__root
      }
      return this.$__cache[value]
    },
    setCache ({ value, root }, data) {
      if (root) {
        this.$__root = data
      } else {
        this.$__cache[value] = data
      }
    },
    hasCache ({ value, root }) {
      if (root) {
        return !!this.$__root
      }
      return value in this.$__cache
    },
    async __lazyLoad (node, resolve) {
      console.log(node)
      if (node.level > this.levelIndex) {
        resolve([])
      } else {
        if (!this.hasCache(node)) {
          this.setCache(node, this.lazyLoad(node))
        }
        const children = await this.getCache(node)
        if (node.level === this.levelIndex) {
          children.forEach((item) => (item.leaf = true))
        }
        console.log('children', children)
        resolve(children)
      }
    },
    async resolveDefaultValue (defaultValue) {
      // [
      //   ['0-0-1', '1-0-2', '2-0-4'],
      //   ['0-0-1', '1-0-2', '2-2-6']
      // ]
      // =>
      // ['0-0-1', '1-0-2']: 叶子节点上一级
      // const array = [
      //   ['0-0-1', '1-0-2', '2-0-4'],
      //   ['0-0-1', '1-0-2', '2-2-6']
      // ]
      if (!defaultValue || !defaultValue.length) return

      console.log('resolveDefaultValue', defaultValue)
      const levelIndex = this.levelIndex
      const ids = new Map()
      if (this.multiple) {
        defaultValue.forEach((subArr) => {
          for (let index = 0; index < levelIndex; index++) {
            if (!ids.has(subArr[index])) {
              ids.set(subArr[index], {
                level: index + 1,
                [this.cascaderProps.value]: subArr[index]
              })
            }
          }
        })
      } else {
        for (let index = 0; index < levelIndex; index++) {
          if (!ids.has(defaultValue[index])) {
            ids.set(defaultValue[index], {
              level: index + 1,
              [this.cascaderProps.value]: defaultValue[index]
            })
          }
        }
      }
      const root = { root: true, level: 0 }
      if (!this.hasCache(root)) {
        this.setCache(root, this.lazyLoad(root))
      }
      for (const node of ids.values()) {
        if (!this.hasCache(node)) {
          this.setCache(node, this.lazyLoad(node))
        }
      }
      await Promise.all([this.$__root, ...Object.values(this.$__cache)])
      // this.options = [
      //   {
      //     label: '选项0-0-1',
      //     value: '0-0-1',
      //     children: [
      //       {
      //         label: '选项1-0-2',
      //         value: '1-0-2',
      //         children: [
      //           {
      //             label: '选项2-0-4',
      //             value: '2-0-4',
      //             leaf: true
      //           },
      //           {
      //             label: '选项2-1-5',
      //             value: '2-1-5',
      //             leaf: true
      //           },
      //           {
      //             label: '选项2-2-6',
      //             value: '2-2-6',
      //             leaf: true
      //           }
      //         ]
      //       },
      //       {
      //         label: '选项1-1-3',
      //         value: '1-1-3',
      //         children: [
      //           {
      //             label: '选项2-0-7',
      //             value: '2-0-7',
      //             leaf: true
      //           },
      //           {
      //             label: '选项2-1-8',
      //             value: '2-1-8',
      //             leaf: true
      //           },
      //           {
      //             label: '选项2-2-9',
      //             value: '2-2-9',
      //             leaf: true
      //           }
      //         ]
      //       }
      //     ]
      //   }
      // ]
      console.log('setSelect', defaultValue)
      this.select = defaultValue
    },
    onChange () {
      console.log('change', arguments)
    }
  }
}
</script>
<style lang="scss">
.z-canton {
}
</style>
