(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["junzheng-comp"]=t():e["junzheng-comp"]=t()})(window,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s="b1d4")}({1493:function(e,t,n){"use strict";n("5951")},2877:function(e,t,n){"use strict";function o(e,t,n,o,r,i,u,s){var c,f="function"===typeof e?e.options:e;if(t&&(f.render=t,f.staticRenderFns=n,f._compiled=!0),o&&(f.functional=!0),i&&(f._scopeId="data-v-"+i),u?(c=function(e){e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,e||"undefined"===typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),r&&r.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(u)},f._ssrRegister=c):r&&(c=s?function(){r.call(this,(f.functional?this.parent:this).$root.$options.shadowRoot)}:r),c)if(f.functional){f._injectStyles=c;var l=f.render;f.render=function(e,t){return c.call(t),l(e,t)}}else{var p=f.beforeCreate;f.beforeCreate=p?[].concat(p,c):[c]}return{exports:e,options:f}}n.d(t,"a",(function(){return o}))},5951:function(e,t,n){},b1d4:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e._self._c;return t("div",{staticClass:"comp-input"},[t("el-input",e._g(e._b({model:{value:e.input,callback:function(t){e.input=t},expression:"input"}},"el-input",e.$attrs,!1),e.$listeners))],1)},r=[],i={name:"CompInput",props:{title:{type:String},value:{type:String||Number}},computed:{input:{get(){return this.value},set(e){this.$emit("input",e)}}}},u=i,s=(n("1493"),n("2877")),c=Object(s["a"])(u,o,r,!1,null,null,null),f=c.exports;f.install=function(e){e.component(f.name,f)};t["default"]=f}})["default"]}));
//# sourceMappingURL=index.js.map