(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["junzheng-comp"]=t():e["junzheng-comp"]=t()})(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s="7728")}({2877:function(e,t,n){"use strict";function r(e,t,n,r,o,u,i,l){var a,s="function"===typeof e?e.options:e;if(t&&(s.render=t,s.staticRenderFns=n,s._compiled=!0),r&&(s.functional=!0),u&&(s._scopeId="data-v-"+u),i?(a=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"===typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),o&&o.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(i)},s._ssrRegister=a):o&&(a=l?function(){o.call(this,(s.functional?this.parent:this).$root.$options.shadowRoot)}:o),a)if(s.functional){s._injectStyles=a;var c=s.render;s.render=function(e,t){return a.call(t),c(e,t)}}else{var f=s.beforeCreate;s.beforeCreate=f?[].concat(f,a):[a]}return{exports:e,options:s}}n.d(t,"a",(function(){return r}))},7728:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e._self._c;return t("el-select",e._g(e._b({model:{value:e._value,callback:function(t){e._value=t},expression:"_value"}},"el-select",e.$attrs,!1),e.$listeners),e._l(e.options,(function(e){return t("el-option",{key:e.value,attrs:{value:e.value,label:e.value}})})),1)},o=[],u={name:"ZCombox",inheritAttrs:!1,props:{value:{type:[String,Object,Number,Array],default:""},options:{type:Array,default:()=>[]}},computed:{_value:{get(){return this.value},set(e){this.$emit("input",e)}}}},i=u,l=n("2877"),a=Object(l["a"])(i,r,o,!1,null,null,null),s=a.exports;s.install=function(e){e.component(s.name,s)};t["default"]=s}})["default"]}));
//# sourceMappingURL=index.js.map