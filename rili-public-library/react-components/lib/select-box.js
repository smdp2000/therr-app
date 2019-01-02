!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["Rili Public Library: React Components"]=t():e["Rili Public Library: React Components"]=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s="7AW3")}({"16Al":function(e,t,n){"use strict";var r=n("WbBG");function o(){}e.exports=function(){function e(e,t,n,o,i,l){if(l!==r){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t};return n.checkPropTypes=o,n.PropTypes=n,n}},"17x9":function(e,t,n){e.exports=n("16Al")()},"7AW3":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n("ERkP"),o=n("17x9"),i=n("esib"),l=n("TSYQ"),a=[i.default.ENTER,i.default.SPACE];class s extends r.Component{constructor(e){super(e),this.state={axIndex:0,optionsAreVisible:!1,isInValid:!0,isTouched:!1},this.handleArrowKey=this.handleArrowKey.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this),this.handlePageClick=this.handlePageClick.bind(this),this.handleSelectionChange=this.handleSelectionChange.bind(this),this.onFocus=this.onFocus.bind(this),this.toggleSelectionVisibility=this.toggleSelectionVisibility.bind(this),this.updateValidations=this.updateValidations.bind(this)}componentWillMount(){document.addEventListener("click",this.handlePageClick)}componentDidMount(){this.updateValidations(this.props)}componentWillReceiveProps(e){this.props.value===e.value&&this.props.required===e.required||this.updateValidations(e)}componentWillUnmount(){document.removeEventListener("click",this.handlePageClick)}handleArrowKey(e){const{options:t}=this.props,n=this.state.axIndex;let r=0;r=n+e>t.length-1?0:n+e<0?t.length-1:n+e,this.setState({axIndex:r})}handleKeyDown(e){if(!this.props.disabled){const t=e.keyCode;if(t===i.default.TAB)return void(this.state.optionsAreVisible&&this.toggleSelectionVisibility());e.preventDefault(),this.state.optionsAreVisible?t===i.default.UP?this.handleArrowKey(-1):t===i.default.DOWN?this.handleArrowKey(1):t===i.default.ESC?this.toggleSelectionVisibility():a.includes(t)&&(this.props.onChange(this.props.options[this.state.axIndex].value),this.setState({axIndex:this.state.axIndex,optionsAreVisible:!1})):a.includes(t)&&this.toggleSelectionVisibility()}}handlePageClick(e){e.target!==this.buttonElement&&this.setState({optionsAreVisible:!1})}handleSelectionChange(e){if(e.preventDefault(),!this.props.disabled){const t=this.props.options[e.target.dataset.index];this.props.onChange(t.value)}}onFocus(){this.setState({isTouched:!0})}toggleSelectionVisibility(){const{disabled:e,options:t,value:n}=this.props;if(!e){let e=t.findIndex(e=>e.value===n);e=-1===e?0:e,this.setState({axIndex:e,optionsAreVisible:!this.state.optionsAreVisible})}}updateValidations(e){const{onValidate:t,translate:n}=this.props;this.setState({isInValid:e.required&&!e.value&&!1!==e.value}),t&&t({[e.id]:n("validations.isRequired")})}render(){const{className:e,disabled:t,id:n,isTesting:o,options:i,placeHolderText:a,required:s,translate:u,value:c}=this.props,{axIndex:f,isInValid:p,isTouched:d,optionsAreVisible:h}=this.state,y=i.find(e=>e.value===c),b=u(y.text),v=l.default({active:h,disabled:t,"is-invalid":p,"is-valid":!p&&s,"is-touched":d,"select-box":!0}),m=l.default({"arrow-down":!0,"icon-xsmall":!0});return r.createElement("div",{className:"form-field"},r.createElement("div",{className:`${v} ${e}`},r.createElement("button",{className:m,id:n,ref:e=>{this.buttonElement=e},onClick:this.toggleSelectionVisibility,onFocus:this.onFocus,onKeyDown:this.handleKeyDown,disabled:t},b||a),(h||o)&&r.createElement("ul",{role:"listbox",className:"options-list"},i.map((e,t)=>{const n=e.value===c,o=l.default({"ax-active":t==f,"option-container":!0,selected:n});return r.createElement("li",{key:e.value,className:o,role:"presentation"},r.createElement("a",{onClick:this.handleSelectionChange,role:"option",className:"option-link","aria-checked":n,"aria-selected":n,"data-index":t,"data-text":e.text},u(e.text)))}))))}}s.propTypes={className:o.string,disabled:o.bool,id:o.string.isRequired,isTesting:o.bool,onChange:o.func.isRequired,onValidate:o.func,options:o.arrayOf(o.shape({text:o.string.isRequired,value:o.oneOfType([o.string,o.number,o.bool])})).isRequired,placeHolderText:o.string,required:o.bool,translate:o.func.isRequired,value:o.string.isRequired},s.defaultProps={className:"block",disabled:!1,isTesting:!1,onValidate:null,placeHolderText:"Select...",required:!1},t.default=s},"8qZt":function(e,t,n){var r,o,i;i=function(){"use strict";var e={A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,ZERO:48,ONE:49,TWO:50,THREE:51,FOUR:52,FIVE:53,SIX:54,SEVEN:55,EIGHT:56,NINE:57,NUMPAD_0:96,NUMPAD_1:97,NUMPAD_2:98,NUMPAD_3:99,NUMPAD_4:100,NUMPAD_5:101,NUMPAD_6:102,NUMPAD_7:103,NUMPAD_8:104,NUMPAD_9:105,NUMPAD_MULTIPLY:106,NUMPAD_ADD:107,NUMPAD_ENTER:108,NUMPAD_SUBTRACT:109,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,F13:124,F14:125,F15:126,COLON:186,EQUALS:187,UNDERSCORE:189,QUESTION_MARK:191,TILDE:192,OPEN_BRACKET:219,BACKWARD_SLASH:220,CLOSED_BRACKET:221,QUOTES:222,LESS_THAN:188,GREATER_THAN:190,BACKSPACE:8,TAB:9,CLEAR:12,ENTER:13,SHIFT:16,CONTROL:17,ALT:18,CAPS_LOCK:20,ESC:27,SPACEBAR:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,INSERT:45,DELETE:46,HELP:47,NUM_LOCK:144};return e},e.exports?e.exports=i():void 0===(o="function"==typeof(r=i)?r.call(t,n,t,e):r)||(e.exports=o)},ERkP:function(e,t,n){"use strict";e.exports=n("hLw4")},TSYQ:function(e,t,n){var r;
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
!function(){"use strict";var n={}.hasOwnProperty;function o(){for(var e=[],t=0;t<arguments.length;t++){var r=arguments[t];if(r){var i=typeof r;if("string"===i||"number"===i)e.push(r);else if(Array.isArray(r)&&r.length){var l=o.apply(null,r);l&&e.push(l)}else if("object"===i)for(var a in r)n.call(r,a)&&r[a]&&e.push(a)}}return e.join(" ")}e.exports?(o.default=o,e.exports=o):void 0===(r=function(){return o}.apply(t,[]))||(e.exports=r)}()},WbBG:function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},esib:function(e,t,n){e.exports=n("8qZt")},hLw4:function(e,t,n){"use strict";
/** @license React v16.6.1
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n("maj8"),o="function"==typeof Symbol&&Symbol.for,i=o?Symbol.for("react.element"):60103,l=o?Symbol.for("react.portal"):60106,a=o?Symbol.for("react.fragment"):60107,s=o?Symbol.for("react.strict_mode"):60108,u=o?Symbol.for("react.profiler"):60114,c=o?Symbol.for("react.provider"):60109,f=o?Symbol.for("react.context"):60110,p=o?Symbol.for("react.concurrent_mode"):60111,d=o?Symbol.for("react.forward_ref"):60112,h=o?Symbol.for("react.suspense"):60113,y=o?Symbol.for("react.memo"):60115,b=o?Symbol.for("react.lazy"):60116,v="function"==typeof Symbol&&Symbol.iterator;function m(e){for(var t=arguments.length-1,n="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=0;r<t;r++)n+="&args[]="+encodeURIComponent(arguments[r+1]);!function(e,t,n,r,o,i,l,a){if(!e){if(e=void 0,void 0===t)e=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var s=[n,r,o,i,l,a],u=0;(e=Error(t.replace(/%s/g,function(){return s[u++]}))).name="Invariant Violation"}throw e.framesToPop=1,e}}(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",n)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},S={};function E(e,t,n){this.props=e,this.context=t,this.refs=S,this.updater=n||g}function _(){}function P(e,t,n){this.props=e,this.context=t,this.refs=S,this.updater=n||g}E.prototype.isReactComponent={},E.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&m("85"),this.updater.enqueueSetState(this,e,t,"setState")},E.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},_.prototype=E.prototype;var x=P.prototype=new _;x.constructor=P,r(x,E.prototype),x.isPureReactComponent=!0;var A={current:null,currentDispatcher:null},O=Object.prototype.hasOwnProperty,C={key:!0,ref:!0,__self:!0,__source:!0};function T(e,t,n){var r=void 0,o={},l=null,a=null;if(null!=t)for(r in void 0!==t.ref&&(a=t.ref),void 0!==t.key&&(l=""+t.key),t)O.call(t,r)&&!C.hasOwnProperty(r)&&(o[r]=t[r]);var s=arguments.length-2;if(1===s)o.children=n;else if(1<s){for(var u=Array(s),c=0;c<s;c++)u[c]=arguments[c+2];o.children=u}if(e&&e.defaultProps)for(r in s=e.defaultProps)void 0===o[r]&&(o[r]=s[r]);return{$$typeof:i,type:e,key:l,ref:a,props:o,_owner:A.current}}function N(e){return"object"==typeof e&&null!==e&&e.$$typeof===i}var R=/\/+/g,j=[];function w(e,t,n,r){if(j.length){var o=j.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function k(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>j.length&&j.push(e)}function D(e,t,n){return null==e?0:function e(t,n,r,o){var a=typeof t;"undefined"!==a&&"boolean"!==a||(t=null);var s=!1;if(null===t)s=!0;else switch(a){case"string":case"number":s=!0;break;case"object":switch(t.$$typeof){case i:case l:s=!0}}if(s)return r(o,t,""===n?"."+U(t,0):n),1;if(s=0,n=""===n?".":n+":",Array.isArray(t))for(var u=0;u<t.length;u++){var c=n+U(a=t[u],u);s+=e(a,c,r,o)}else if(c=null===t||"object"!=typeof t?null:"function"==typeof(c=v&&t[v]||t["@@iterator"])?c:null,"function"==typeof c)for(t=c.call(t),u=0;!(a=t.next()).done;)s+=e(a=a.value,c=n+U(a,u++),r,o);else"object"===a&&m("31","[object Object]"==(r=""+t)?"object with keys {"+Object.keys(t).join(", ")+"}":r,"");return s}(e,"",t,n)}function U(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}(e.key):t.toString(36)}function I(e,t){e.func.call(e.context,t,e.count++)}function V(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?M(e,r,n,function(e){return e}):null!=e&&(N(e)&&(e=function(e,t){return{$$typeof:i,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(e,o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(R,"$&/")+"/")+n)),r.push(e))}function M(e,t,n,r,o){var i="";null!=n&&(i=(""+n).replace(R,"$&/")+"/"),D(e,V,t=w(t,i,r,o)),k(t)}var F={Children:{map:function(e,t,n){if(null==e)return e;var r=[];return M(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;D(e,I,t=w(null,null,t,n)),k(t)},count:function(e){return D(e,function(){return null},null)},toArray:function(e){var t=[];return M(e,t,null,function(e){return e}),t},only:function(e){return N(e)||m("143"),e}},createRef:function(){return{current:null}},Component:E,PureComponent:P,createContext:function(e,t){return void 0===t&&(t=null),(e={$$typeof:f,_calculateChangedBits:t,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:c,_context:e},e.Consumer=e},forwardRef:function(e){return{$$typeof:d,render:e}},lazy:function(e){return{$$typeof:b,_ctor:e,_status:-1,_result:null}},memo:function(e,t){return{$$typeof:y,type:e,compare:void 0===t?null:t}},Fragment:a,StrictMode:s,Suspense:h,createElement:T,cloneElement:function(e,t,n){(null===e||void 0===e)&&m("267",e);var o=void 0,l=r({},e.props),a=e.key,s=e.ref,u=e._owner;if(null!=t){void 0!==t.ref&&(s=t.ref,u=A.current),void 0!==t.key&&(a=""+t.key);var c=void 0;for(o in e.type&&e.type.defaultProps&&(c=e.type.defaultProps),t)O.call(t,o)&&!C.hasOwnProperty(o)&&(l[o]=void 0===t[o]&&void 0!==c?c[o]:t[o])}if(1===(o=arguments.length-2))l.children=n;else if(1<o){c=Array(o);for(var f=0;f<o;f++)c[f]=arguments[f+2];l.children=c}return{$$typeof:i,type:e.type,key:a,ref:s,props:l,_owner:u}},createFactory:function(e){var t=T.bind(null,e);return t.type=e,t},isValidElement:N,version:"16.6.3",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:A,assign:r}};F.unstable_ConcurrentMode=p,F.unstable_Profiler=u;var L={default:F},$=L&&F||L;e.exports=$.default||$},maj8:function(e,t,n){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach(function(e){r[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var n,l,a=function(e){if(null===e||void 0===e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),s=1;s<arguments.length;s++){for(var u in n=Object(arguments[s]))o.call(n,u)&&(a[u]=n[u]);if(r){l=r(n);for(var c=0;c<l.length;c++)i.call(n,l[c])&&(a[l[c]]=n[l[c]])}}return a}}})});
//# sourceMappingURL=select-box.js.map