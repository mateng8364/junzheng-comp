<template>
  <div class="z-canton">
    <el-select> </el-select>
  </div>
</template>
<script>
const LEVELS = ['province', 'city', 'county', 'town']

export default {
  name: 'ZCantonSelect',
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
  watch: {
    defaultValue: {
      handler (value) {
        if (value && value.length) {
          // this.defaultValue2Options(value)
        }
      },
      immediate: true
    },
    options: {
      handler (options) {
        // console.log('options', options)
      },
      deep: true
    }
  },
  created () {
    this.$cache = {}
  },
  methods: {
    setOptions (node, children) {
      const { root, value } = node
      for (const item of children) {
        this.$cache[this.cascaderProps.value] = item
      }
      if (root) {
        this.options = children
      } else {
        const parent = this.$cache[value]
        this.$set(parent, this.cascaderProps.children, children)
      }
    },
    async __lazyLoad (node, resolve) {
      // console.log(node)
      if (node.level > this.levelIndex) {
        resolve([])
      } else {
        const children = await this.lazyLoad(node)
        if (node.level === this.levelIndex) {
          children.forEach((item) => (item.leaf = true))
        }
        // console.log('children', children)
        this.setOptions(node, children)
        resolve(children)
      }
    },
    async defaultValue2Options (array) {
      // [['0-0', '1-0', '2-0'], ['0-0', '1-0', '2-2']]
      // =>
      // ['0-0', '1-0']: 叶子节点上一级
      // const array = [
      //   ['0-0', '1-0', '2-0'],
      //   ['0-0', '1-0', '2-2']
      // ]
      const levelIndex = this.levelIndex
      const idLevel = {}
      const ids = new Map()
      array.forEach((subArr) => {
        for (let index = 0; index < levelIndex; index++) {
          idLevel[subArr[index]] = index
          if (!ids.has(subArr[index])) {
            ids.set(subArr[index], { level: index + 1, [this.cascaderProps.value]: subArr[index] })
          }
        }
      })
      const jobs = []
      for (const node of ids.values()) {
        jobs.push(this.lazyLoad(node))
      }
      await Promise.all(jobs)
      // console.log(res)
    },
    onChange () {
      // console.log('change', arguments)
    }
  }
}
</script>
<style lang="scss">
.z-canton {
}
</style>
