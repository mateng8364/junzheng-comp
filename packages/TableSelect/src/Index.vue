<template>
  <el-input
    :id="id"
    ref="elInput"
    v-model="input"
    class="z-table-select"
    :prefix-icon="icon"
    v-bind="$attrs"
    @input="onInput"
    @change="onInputChange"
    @clear="onClear"
    @blur="onBlur"
    @focus="onFocus"
    @keydown.native.down.prevent="onNext"
    @keydown.native.up.prevent="onPrev"
    @keydown.native.enter.prevent="onSelect"
    @keydown.native.esc.stop.prevent="closePopover"
  />
</template>
<script>
import Vue from 'vue'
import throttle from 'throttle-debounce/throttle'
import { Popover } from 'element-ui'
import PopoverContent from './popover-content'

const PopoverConstructor = Vue.extend(Popover)

export default {
  name: 'ZTableSelect',
  props: {
    id: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: 'el-icon-edit'
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
      input: '',
      focus: false
    }
  },
  computed: {
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
  },
  watch: {
    value: {
      handler (value) {
        // if (!value) {
        //   this.popoverSelectionClear()
        // }
        // this.input = this.selection ? this.selection[this._labelProp_] : value
        if (!value) {
          this.popoverSelectionClear()
          this.input = value
        } else if (this.selection) {
          this.input = this.selection[this._labelProp_]
        } else {
          this.input = value
        }
      },
      immediate: true
    }
  },
  created () {
    this.throttleResize = throttle(100, this.onResize)
  },
  mounted () {
    if (!this.$slots || !this.$slots.default) {
      console.warn(
        '[z-table-select warn]: 默认slot不能为空，必须提供<el-table-column ...></el-table-column>类型组件'
      )
    }

    this.$nextTick(function () {
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
      this.$popoverInstance.value = false
    },
    globalClosePopover (e) {
      this.$nextTick(function () {
        // console.log('globalClosePopover', e)
        if (!this.$el.contains(e.target) && !this.focus) {
          // const { top, right, bottom, left } = this.$el.getBoundingClientRect()
          this.closePopover()
        }
      })
    },
    popoverSelectionClear () {
      if (this.$popoverInstance && this.$popoverInstance.$slots.default.componentInstance) {
        this.$popoverInstance.$slots.default.componentInstance.clear()
      }
    },
    onResize () {
      this.$popoverInstance.width = this.$el.clientWidth
    },

    onChoose (selection) {
      this.closePopover()
      this.selection = selection
      this.$emit('input', selection[this._valueProp_])
      this.input = selection[this._labelProp_]
      this.onChange()
    },
    onInput (value) {
      if (value) {
        this.openPopover()
        this.$popoverInstance.$slots.default.componentInstance.debounceSearch(value)
      }
      // else {
      //   this.closePopover()
      // }
    },
    onInputChange (value) {
      this.$emit('input', value)
      this.selection = { [this._labelProp_]: value, [this._valueProp_]: value, _isCreate: true }
      this.onChange()
    },
    onClear () {
      this.popoverSelectionClear()
      this.selection = undefined
      this.$emit('input', undefined)
      this.onChange()
    },
    onChange () {
      if (this.$listeners.change) {
        this.$emit('change', this.selection)
      }
    },

    onNext () {
      if (this.$popoverInstance._isMounted && this.$popoverInstance.value) {
        this.$popoverInstance.$slots.default.componentInstance.next()
      }
    },
    onPrev () {
      if (this.$popoverInstance._isMounted && this.$popoverInstance.value) {
        this.$popoverInstance.$slots.default.componentInstance.prev()
      }
    },
    onSelect () {
      if (this.$popoverInstance._isMounted && this.$popoverInstance.value) {
        // 注意，下面两行代码顺序不能换，否则会输出输入框的值
        this.$refs.elInput.$refs.input.blur()
        this.$popoverInstance.$slots.default.componentInstance.select()
      }
    },

    onFocus () {
      this.focus = true
      // console.log('onFocus', e)
      if (this.$popoverInstance._isMounted) this.openPopover()
    },
    onBlur (e) {
      // console.log('onBlur', e)
      this.focus = false
      if (
        !this.$popoverInstance._isMounted ||
        !this.$popoverInstance.$refs.popper.contains(e.relatedTarget)
      ) {
        this.closePopover()
      }
    }
  }
}
</script>
