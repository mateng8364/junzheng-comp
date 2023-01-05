<template>
  <el-cascader
    v-if="type === 'cascader'"
    ref="cascader"
    v-model="select"
    v-bind="$attrs"
    :props="__cascaderProps"
    :options="options"
    v-on="$listeners"
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
    },
    checkStrictly: {
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
        // props.expandTrigger = 'hover'
      }
      props.multiple = this.multiple
      props.checkStrictly = this.checkStrictly
      return props
    }
  },
  created () {
    this.$__root = undefined
    this.$__cache = {}
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
      // console.log('__lazyLoad', node)
      if (node.level > this.levelIndex) {
        resolve([])
      } else {
        /**
         * this.$watch('defaultValue', this.resolveDefaultValue, { immediate: true }) 在 __lazyLoad(node, resolve) 前执行
         * 如果有默认值，会建立默认值的cache
         * 到执行这里时，判断是否有cache
         * 有缓存，则 resolve([])
         * 没缓存，则 resolve(children)
         * 以此避免重复节点出现，也避免了要两次点击节点才能展开问题
         */
        const hasCache = this.hasCache(node)
        if (!hasCache) {
          this.setCache(node, this.lazyLoad(node))
        }
        const children = await this.getCache(node)
        if (node.level === this.levelIndex) {
          children.forEach((item) => this.$set(item, 'leaf', true))
        }
        if (hasCache) {
          resolve([])
        } else {
          resolve(children)
        }
      }
    },
    async setOptions (list, level) {
      for (const item of list) {
        const children = await this.$__cache[item[this.__cascaderProps.value]]
        if (children) {
          if (level === this.levelIndex) {
            children.forEach((item) => (item.leaf = true))
          }
          this.$set(item, this.__cascaderProps.children, children)
          this.setOptions(children, level + 1)
        }
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

      // console.log('resolveDefaultValue', defaultValue)
      const levelIndex = this.levelIndex
      const ids = new Map()
      function getIds (list) {
        for (let index = 0; index < levelIndex; index++) {
          if (!ids.has(list[index])) {
            ids.set(list[index], {
              level: index + 1,
              [this.cascaderProps.value]: list[index]
            })
          }
        }
      }
      if (this.multiple) {
        defaultValue.forEach((subArr) => getIds.call(this, subArr))
      } else {
        getIds.call(this, defaultValue)
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
      this.select = defaultValue
      this.options = await this.$__root
      this.setOptions(this.options, 1)
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
    }
  }
}
</script>
<style lang="scss">
// .z-canton {
// }
//
</style>
