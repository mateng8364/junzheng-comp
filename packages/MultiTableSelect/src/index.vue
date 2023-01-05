<template>
  <el-input
    :id="id"
    ref="elInput"
    :value="label"
    :class="{ 'z-multi-table-select': true, 'is-clear': showClear, 'is-open': visible }"
    v-bind="$attrs"
    suffix-icon="el-icon-arrow-down"
    :clearable="clearable"
    :disabled="disabled"
    @clear="onClear"
    @focus="onFocus"
    @blur="onBlur"
    @keydown.native.esc.stop.prevent="closePopover"
  />
</template>
<script>
import Vue from 'vue'
import throttle from 'throttle-debounce/throttle'
import { Popover } from 'element-ui'
import PopoverContent from './popover-content.vue'

const PopoverConstructor = Vue.extend(Popover)

// 比较两个数组是否一一对应
function isArrayEq (target, source, prop) {
  if (!target || !source) return false

  for (let index = 0, size = target.length; index < size; index++) {
    if (target[index][prop] !== source[index][prop]) {
      return false
    }
  }
  return true
}

function getLabel (list, prop, delimiter, cb = function () {}) {
  let label = ''
  for (const item of list) {
    label += delimiter + item[prop]
    cb(item)
  }
  return label.slice(1)
}

export default {
  name: 'ZMultiTableSelect',
  props: {
    id: {
      type: String,
      default: undefined
    },
    value: {
      type: Array,
      default: undefined
    },
    defaultValue: {
      type: Array,
      default: undefined
    },
    rowKey: {
      type: String,
      default: undefined,
      required: true
    },
    labelProp: {
      type: String,
      default: undefined
    },
    valueProp: {
      type: String,
      default: undefined
    },
    searchProp: {
      type: String,
      default: undefined
    },
    delimiter: {
      type: String,
      default: ';'
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    popperOptions: {
      type: Object,
      default: () => ({ minWidth: '200px' })
    },
    search: {
      type: Function,
      default: undefined
    },
    data: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      selection: undefined,
      loading: false,
      label: '',
      focus: false,
      visible: false,
      showClear: false
    }
  },
  computed: {
    // firstColumn() {
    //   return this.$slots && this.$slots.default && this.$slots.default[0]
    // },

    _labelAndValueProp_ () {
      let firstColumn
      if (
        (!this.labelProp || !this.valueProp) &&
        (firstColumn = this.$slots && this.$slots.default && this.$slots.default[0])
      ) {
        const prop = firstColumn.componentOptions.propsData.prop
        return [this.labelProp || prop, this.valueProp || prop]
      }
      return [this.labelProp, this.valueProp]
    },
    _labelProp_ () {
      return this._labelAndValueProp_[0]
    },
    _valueProp_ () {
      return this._labelAndValueProp_[1]
    },
    _searchProp_ () {
      return this._valueProp_
    }
    // label() {
    //   if (this.multiple) {
    //     return this.selection ? this.selection.map((item) => item[this._labelProp_]).join(this.delimiter) : ''
    //   }
    //   return this.selection ? this.selection[this._labelProp_] : ''
    // }
  },
  watch: {
    defaultValue: {
      handler (defaultValue, oldDefaultValue) {
        if (
          this.defaultValue !== undefined &&
          this.defaultValue !== null &&
          defaultValue !== oldDefaultValue &&
          !isArrayEq(defaultValue, oldDefaultValue, this._valueProp_)
        ) {
          const selection = defaultValue.map((item) => ({ ...item }))
          this.selection = selection
          const value = []
          // let label = ''
          for (const item of selection) {
            value.push(item[this._valueProp_])
            // label += this.delimiter + item[this._labelProp_]
          }
          this.$emit('input', value)
          // this.input = label.slice(1)

          this.onChange()
        }
      },
      immediate: true
    },
    value: {
      handler (value) {
        // console.log('watch value', value, this.defaultValue, this.selection)
        if (!value || value.length === 0) {
          this.label = ''
          this.selection = undefined
          this.popoverSelectionClear()
        } else {
          if (this.selection) {
            if (this.defaultValue) {
              if (
                this.selection.length === value.length &&
                this.selection.every((item, index) => item[this._valueProp_] === value[index])
              ) {
                this.label = getLabel(this.selection, this._labelProp_, this.delimiter)
              } else {
                this.selection = []
                this.label = getLabel(this.defaultValue, this._labelProp_, this.delimiter, (item) =>
                  this.selection.push({ ...item })
                )
                this.popoverSelectionClear()
              }
            } else {
              this.label = getLabel(this.selection, this._labelProp_, this.delimiter)
            }
          } else {
            if (this.defaultValue) {
              this.selection = []
              this.label = getLabel(this.defaultValue, this._labelProp_, this.delimiter, (item) =>
                this.selection.push({ ...item })
              )
            } else {
              this.selection = undefined
              this.label = ''
            }
            this.popoverSelectionClear()
          }
        }
      }
    }
  },
  created () {
    this.throttleResize = throttle(100, this.onResize)
  },
  mounted () {
    if (!this.$slots || !this.$slots.default) {
      // console.warn(
      //   '[z-table-select warn]: 默认slot不能为空，必须提供<el-table-column ...></el-table-column>类型组件'
      // )
      throw new Error('[z-table-select warn]: 默认slot不能为空，必须提供<el-table-column ...></el-table-column>类型组件')
    }

    this.$nextTick(function () {
      this.$refs.elInput.$refs.input.setAttribute('readonly', 'readonly')
      this.$refs.elInput.$refs.input.addEventListener('click', () => {
        this.onFocus()
      })

      this.$popoverInstance = new PopoverConstructor({
        propsData: {
          trigger: 'manual',
          placement: 'bottom-start',
          reference: this.$el,
          width: this.$el.clientWidth,
          arrowOffset: 35
          // popperClass: '',
        }
      })
      this.$popoverInstance.$on('after-enter', () => {
        this.$popoverInstance.$slots.default.componentInstance.scrollIntoView()
      })
      this.$popoverInstance.$slots.default = this.$createElement(PopoverContent, {
        props: {
          columns: this.$slots.default
            .filter((vnode) => !vnode.text)
            .map((vnode) => ({ ...vnode.componentOptions.propsData })),
          data: this.data,
          rowKey: this.rowKey,
          searchProp: this._searchProp_,
          labelProp: this._labelProp_,
          search: this.search
        },
        on: {
          choose: this.onChoose
        }
      })
    })

    this.$refs.elInput.$watch('showClear', (showClear) => {
      this.showClear = showClear
    })

    window.addEventListener('click', this.globalClosePopover)
    window.addEventListener('resize', this.throttleResize)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.globalClosePopover)
    window.removeEventListener('resize', this.throttleResize)
    this.$popoverInstance.$destroy()
  },
  methods: {
    openPopover () {
      if (!this.$popoverInstance._isMounted) {
        this.$popoverInstance.$mount()
        this.$popoverInstance.$refs.popper.style.minWidth = this.popperOptions.minWidth
      }
      this.$popoverInstance.width = this.$el.clientWidth
      this.$popoverInstance.value = true
    },
    closePopover () {
      this.visible = false
      this.$popoverInstance.value = false
    },
    globalClosePopover (e) {
      if (!this.$el.contains(e.target) && !this.focus) {
        this.closePopover()
      }
    },
    onResize () {
      this.$popoverInstance.width = this.$el.clientWidth
    },

    onChoose (selection) {
      // this.closePopover()
      this.selection = selection
      const value = []
      // let label = ''
      for (const item of selection) {
        value.push(item[this._valueProp_])
        // label += this.delimiter + item[this._labelProp_]
      }
      this.$emit('input', value)
      // this.label = label.slice(1)

      this.onChange()
    },

    onClear () {
      // e.stopPropagation()
      this.visible = false
      this.popoverSelectionClear()
      this.selection = undefined
      this.$emit('input', undefined)
      this.onChange()
    },
    popoverSelectionClear () {
      if (this.$popoverInstance.$slots.default.componentInstance) {
        this.$popoverInstance.$slots.default.componentInstance.clear()
      }
    },
    onChange () {
      if (this.$listeners.change) {
        this.$emit('change', this.selection)
      }
    },

    onFocus (e) {
      this.focus = true
      this.visible = true
      // if (this.$popoverInstance._isMounted) this.openPopover()
      this.openPopover()
    },
    onBlur (e) {
      this.focus = false
      if (
        !this.$popoverInstance.$refs.popper ||
        !this.$popoverInstance.$refs.popper.contains(e.relatedTarget)
      ) {
        this.closePopover()
      }
    }
  }
}
</script>
<style lang="scss">
.z-multi-table-select {
  .el-input__inner {
    cursor: pointer;
  }
  .el-input__icon.el-icon-arrow-down {
    transition: transform 0.3s;
  }
  &.is-clear .el-input__icon.el-icon-arrow-down {
    display: none;
  }
  &.is-open .el-input__icon.el-icon-arrow-down {
    transform: rotateZ(-180deg);
  }
}
</style>
