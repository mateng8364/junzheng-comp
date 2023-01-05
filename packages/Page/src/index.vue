<template>
  <div class="z-page" :class="className">
    <div v-if="$slots.search" class="z-page__search"><slot name="search"></slot></div>
    <div v-if="$slots.toolbar" class="z-page__toolbar"><slot name="toolbar"></slot></div>
    <div class="z-page__body" :class="`is-${bodyDirection}`">
      <!--
      <div v-if="card" class="z-page__body--card-wrapper" :class="`is-${cardDirection}`"><slot name="body"></slot></div>
      <slot v-else name="body"></slot>
      <div v-if="bodyDirection === 'horizontal'" class="z-page__body-wrapper">
        <slot name="body"></slot>
      </div>
      -->
      <slot name="body"></slot>
    </div>
    <div v-if="$slots.footer" class="z-page__footer">
      <slot name="footer"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ZPage',
  props: {
    shadow: {
      type: Boolean,
      default: true
    },
    bodyDirection: {
      type: String,
      default: 'vertical',
      validator (value) {
        return ['vertical', 'horizontal'].includes(value)
      }
    },
    // 100 or 100px or {min: 100, max: 2000}
    width: {
      type: [String, Number, Object],
      default: undefined
    },
    tabs: Boolean
    // card: Boolean,
  },
  provide () {
    return {
      zPage: this
    }
  },
  computed: {
    className () {
      return {
        'z-page--tabs': this.tabs,
        // 'z-page--card': this.card,
        'is-shadow': this.shadow
      }
    },

    calcWidth () {
      // 100 or 100px or {min: 100, max: 2000}
      if (this.width) {
        let width = this.width
        if (typeof width === 'object') {
          const style = []
          if (width.min) {
            let min = width.min
            if (typeof min === 'number' || !min.endsWith('px')) {
              min = `${min}px`
            }
            style.push(`min-width: ${min}`)
          }
          if (width.max) {
            let max = width.max
            if (typeof max === 'number' || !max.endsWith('px')) {
              max = `${max}px`
            }
            style.push(`max-width: ${max}`)
          }
          return style.join(';')
        }
        if (typeof width === 'number' || !width.endsWith('px')) {
          width = `${width}px`
        }
        return `width: ${width}`
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
.z-page {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  // padding: 5px 15px;
  // padding: 6px;
  padding: 0;
  background: #f6f7f7;
  position: relative;
  &.is-shadow::before {
    content: '';
    position: absolute;
    height: 6px;
    width: 100%;
    z-index: 10;
    pointer-events: none;
    background-image: linear-gradient(#e4e7ed, rgba(0, 0, 0, 0));
  }
  .z-page__search,
  .z-page__toolbar,
  .z-page__body,
  .z-page__footer {
    background: #fff;
  }
  .z-page__search {
    margin-bottom: 6px;
    // border-radius: 4px;
  }
  .z-page__toolbar {
    padding: 0 6px;
    // border-top-left-radius: 4px;
    // border-top-right-radius: 4px;
    .vxe-toolbar {
      margin-top: 6px;
      height: auto;
    }
  }
  .z-page__body {
    flex: 1 1 0;
    overflow: auto;
    // padding: 0 10px;
    // padding: 10px 10px 2px 10px;
    // padding: 6px;
    display: flex;
    // border-radius: 4px;
    // margin: 6px 0 6px 6px;
    position: relative;
    &.is-vertical {
      flex-direction: column;
    }
    &.is-horizontal {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
  .z-page__footer {
    // padding: 8px 0 3px 0;
    // border-top: 1px solid #ebeef5;
    // padding: 8px 15px 3px 15px;
    border-top: 1px solid #ebeef5;
    // border-bottom: 1px solid #ebeef5;
    overflow-x: auto;
    // padding: 6px;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    // margin: 0 -15px;
  }
  .z-page__search:empty {
    margin-bottom: 0;
  }
  // .z-page__toolbar:not(:empty) + .z-page__body {
  //   padding-top: 0;
  //   // border-top-left-radius: 0;
  //   // border-top-right-radius: 0;
  // }
}

.z-page.z-page--tabs .z-page__body {
  > .el-tabs.el-tabs--border-card {
    display: flex;
    flex-direction: column;
    flex: 1;
    border-width: 0;
    > .el-tabs__header .el-tabs__item:first-child {
      margin-left: 6px;
    }
    > .el-tabs__content {
      flex: 1 1 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      > .el-tab-pane {
        padding: 0;
        // overflow: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
// .z-page.z-page--card .z-page__body {
//   padding: 3px;
//   > .el-card {
//     margin: 3px;
//     flex: 0 0 auto;
//   }
//   // 水平布局，el-card必须要指定最小宽度：flex: 1 0 800px
//   // &.is-horizontal {
//   //   > .el-card {
//   //     flex: 1 0 auto;
//   //   }
//   // }

//   // // flex: 1 1 auto;
//   // > .z-page__body--card-wrapper {
//   //   padding: 6px;
//   //   display: flex;
//   //   flex: 1;
//   //   > .el-form {
//   //     display: flex;
//   //   }
//   //   &.is-vertical {
//   //     flex-direction: column;
//   //     > .el-card + .el-card {
//   //       margin-top: 6px;
//   //     }
//   //     > .el-form {
//   //       flex-direction: column;
//   //       > .el-card + .el-card {
//   //         margin-top: 6px;
//   //       }
//   //     }
//   //   }
//   //   &.is-horizontal {
//   //     flex-direction: row;
//   //     > .el-card + .el-card,
//   //     > .el-form > .el-card + .el-card {
//   //       margin-left: 6px;
//   //     }
//   //     > .el-form {
//   //       flex-direction: row;
//   //       > .el-card + .el-card {
//   //         margin-left: 6px;
//   //       }
//   //     }
//   //   }
//   // }
// }
</style>
