<template>
  <div class="z-page-body-col" :class="className" :style="style">
    <slot></slot>
  </div>
</template>
<script>
const SIZE = ['xs', 'sm', 'md', 'lg', 'xl']

export default {
  name: 'ZPageBodyCol',
  props: {
    // 固定宽度
    width: {
      type: [String, Number],
      default: undefined
    },
    span: {
      type: Number,
      default: 24
    },
    xs: {
      type: Number,
      default: undefined
    },
    sm: {
      type: Number,
      default: undefined
    },
    md: {
      type: Number,
      default: undefined
    },
    lg: {
      type: Number,
      default: undefined
    },
    xl: {
      type: Number,
      default: undefined
    }
  },
  computed: {
    style () {
      if (this.width) {
        let width = this.width
        if (typeof width === 'number' || !width.endsWith('px')) {
          width = `${width}px`
        }
        return `flex: 0 0 ${width}`
      }
      return ''
    },
    className () {
      const classList = []
      if (this.span || this.span === 0) {
        classList.push(`z-page-body-col-${this.span}`)
      }
      SIZE.forEach((size) => {
        if (typeof this[size] === 'number') {
          classList.push(`z-page-body-col-${size}-${this[size]}`)
        }
      })
      return classList
    }
  }
}
</script>
<style lang="scss">
@use 'sass:math';

.z-page-body-col {
  padding: 3px;
  display: flex;
  // flex: 1 1 100%;
  overflow: hidden;
  > * {
    flex: 1;
  }
}

$--sm: 768px !default;
$--md: 992px !default;
$--lg: 1200px !default;
$--xl: 1920px !default;

$--breakpoints: (
  'xs': (
    max-width: $--sm - 1
  ),
  'sm': (
    min-width: $--sm
  ),
  'md': (
    min-width: $--md
  ),
  'lg': (
    min-width: $--lg
  ),
  'xl': (
    min-width: $--xl
  )
);

@mixin res($key, $map: $--breakpoints) {
  // 循环断点Map，如果存在则返回
  @if map-has-key($map, $key) {
    @media only screen and #{inspect(map-get($map, $key))} {
      @content;
    }
  } @else {
    @warn "Undefeined points: `#{$map}`";
  }
}

.z-page-body-col-0 {
  display: none;
}
@for $i from 0 through 24 {
  .z-page-body-col-#{$i} {
    width: (math.div(1, 24) * $i * 100) * 1%;
  }
}
@include res(xs) {
  .z-page-body-col-xs-0 {
    display: none;
  }
  @for $i from 0 through 24 {
    .z-page-body-col-xs-#{$i} {
      width: (math.div(1, 24) * $i * 100) * 1%;
    }
  }
}

@include res(sm) {
  .z-page-body-col-sm-0 {
    display: none;
  }
  @for $i from 0 through 24 {
    .z-page-body-col-sm-#{$i} {
      width: (math.div(1, 24) * $i * 100) * 1%;
    }
  }
}

@include res(md) {
  .z-page-body-col-md-0 {
    display: none;
  }
  @for $i from 0 through 24 {
    .z-page-body-col-md-#{$i} {
      width: (math.div(1, 24) * $i * 100) * 1%;
    }
  }
}

@include res(lg) {
  .z-page-body-col-lg-0 {
    display: none;
  }
  @for $i from 0 through 24 {
    .z-page-body-col-lg-#{$i} {
      width: (math.div(1, 24) * $i * 100) * 1%;
    }
  }
}

@include res(xl) {
  .z-page-body-col-xl-0 {
    display: none;
  }
  @for $i from 0 through 24 {
    .z-page-body-col-xl-#{$i} {
      width: (math.div(1, 24) * $i * 100) * 1%;
    }
  }
}
</style>
