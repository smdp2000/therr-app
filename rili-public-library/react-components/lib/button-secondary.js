!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("react"),require("prop-types")):"function"==typeof define&&define.amd?define(["react","prop-types"],t):"object"==typeof exports?exports["Rili Public Library: React Components"]=t(require("react"),require("prop-types")):e["Rili Public Library: React Components"]=t(e.react,e["prop-types"])}(window,function(e,t){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s="N1Uu")}({N1Uu:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r("q8St");class o extends n.default{}o.defaultProps=Object.assign({},n.default.defaultProps,{className:"secondary text-grey-darkest py-2 px-4"}),t.default=o},cDcd:function(t,r){t.exports=e},q8St:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const n=r("cDcd"),o=r("rf6O");class u extends n.Component{constructor(e){super(e)}render(){const{children:e,className:t,disabled:r,id:o,onClick:u,text:i}=this.props;return n.createElement("button",{id:o,className:t,onClick:u,type:"button",disabled:r},i||e)}}u.propTypes={id:o.string,onClick:o.func.isRequired,children:o.string.isRequired,className:o.string,disabled:o.bool},u.defaultProps={disabled:!1},t.default=u},rf6O:function(e,r){e.exports=t}})});
//# sourceMappingURL=button-secondary.js.map