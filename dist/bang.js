(()=>{var __webpack_modules__={876:function(__unused_webpack_module,exports){!function(e){const t=""+Math.random(),n=(()=>{try{return self.DOMParser&&!0}catch(e){return!1}})(),r=[Symbol,Boolean,Number,String,Object,Set,Map,WeakMap,WeakSet,Uint8Array,Uint16Array,Uint32Array,Float32Array,Float64Array,Int8Array,Int16Array,Int32Array,Uint8ClampedArray,...n?[Node,NodeList,Element,HTMLElement,Blob,ArrayBuffer,FileList,Text,HTMLDocument,Document,DocumentFragment,Error,File,Event,EventTarget,URL]:[Buffer]],o=e=>null==e||null==e,a=new Map;function s(e,...t){const n=t.reduce(((t,n,r)=>t+n+e[r+1]),e[0]);if(!a.has(n))throw new TypeError(`Cannot use type ${n} before it is defined.`);return a.get(n).type}function i(e,t,{partial:n=!1}={}){b(e),g(e);const r=e.name,{spec:c,kind:u,help:f,verify:d,verifiers:h,sealed:m}=a.get(r),w=c?p(c).sort():[],v=new Set(w),E=[];switch(u){case"def":{let a=!0;if(c){const e=n?p(t,v):w;a=!o(t)&&e.every((e=>{const{resolved:n,errors:o}=l(t,e,(()=>{return t=l(c,e).resolved,n=s`None`,b(t),g(t),b(n),g(n),!(t!==n&&(!t.isSumType||!t.types.has(n))&&(!n.isSumType||!n.types.has(t))&&(!t.name.startsWith("?")||n!=s`None`)&&(!n.name.startsWith("?")||t!=s`None`)&&((t.name.startsWith(">")||n.name.startsWith(">"))&&console.error(new Error("Check type match has not been implemented for derived//sub types yet.")),1));var t,n}));if(E.push(...o),o.length)return!1;const a=l(c,e).resolved;if(!(a&&a instanceof y))return E.push({error:`Key path '${e}' is not present in the spec for type '${r}'`}),!1;const{valid:u,errors:f}=i(a,n);return E.push(...f),u}))}let u=!0;if(n&&!c&&d)throw new TypeError("Type checking with option 'partial' is not a valid option for types that only use a verify function but have no spec");if(d)try{if(u=d(t),!u){if(h)throw{error:`Type ${r} value '${JSON.stringify(t)}' violated at least 1 verify function in:\n${h.map((e=>"\t"+(e.help||"")+" ("+e.verify.toString()+")")).join("\n")}`};if(e.isSumType)throw{error:`Value '${JSON.stringify(t)}' did not match any of: ${[...e.types.keys()].map((e=>e.name))}`,verify:d,verifiers:h};{let e="";throw f&&(e=`Help: ${f}. `),{error:`${e}Type ${r} Value '${JSON.stringify(t)}' violated verify function in: ${d.toString()}`}}}}catch(e){E.push(e),u=!1}let k=!0;if(m&&c){const e=w,n=p(t,v).sort();if(k=n.join(",")==e.join(","),!k)if(n.length<e.length)k=!0;else{const t=[],o=new Set(e);for(const e of n)o.has(e)||t.push({error:`Key path '${e}' is not in the spec for type ${r}`});t.length&&E.push(...t)}}return{valid:a&&u&&k,errors:E,partial:n}}case"defCollection":{const{valid:e,errors:r}=i(c.container,t);let o=!0,a=!0;if(E.push(...r),n)throw new TypeError("Type checking with option 'partial' is not a valid option for Collection types");if(e&&(o=[...t].every((e=>{const{valid:t,errors:n}=i(c.member,e);return E.push(...n),t}))),d)try{a=d(t)}catch(e){E.push(e),a=!1}return{valid:e&&o&&a,errors:E}}default:throw new TypeError(`Checking for type kind ${u} is not yet implemented.`)}}function c(...e){return i(...e).valid}function l(e,t,n){if(o(e))throw new TypeError("Lookup requires a non-unset object.");if(!t)throw new TypeError("keyPath must not be empty");const r=t.split(/\./g),a=[],s=[];let i=e;for(;r.length;){const e=r.shift();if(i=i[e],a.push(e),null==i){r.length?s.push({error:`Lookup on key path '${t}' failed at '`+a.join(".")+`' when ${i} was found at '${e}'.`}):n&&n()?i=void 0:s.push({error:`Resolution on key path '${t}' failedwhen ${i} was found at '${e}' and the Type of thiskey's value cannot be None.`});break}}return{resolved:i,errors:s}}function u(e,t,{verify:n,help:r=""}={},o=""){let a;if(b(e),g(e),n||(n=()=>!0),e.native){a=[{help:r,verify:n}],n=t=>t instanceof e.native;const t=`Needs to be of type ${e.native.name}. ${r||""}`;a.push({help:t,verify:n})}return m(`${o}>${e.name}`,t,{verify:n,help:r,verifiers:a})}function f(e){return a.has(e)}function d(e){if(f(e))throw new TypeError(`Type ${e} cannot be redefined.`)}function p(e,t){const n=!t;return function e(r,o,a=""){const s=Object.getOwnPropertyNames(r),i=s.map((e=>a+(a.length?".":"")+e));return s.forEach(((a,s)=>{const c=r[a];if(n)if(c instanceof y)o.add(i[s]);else{if("object"!=typeof c)throw new TypeError("Spec cannot contain leaf values that are not valid Types");if(Array.isArray(c))throw new TypeError("We don't support Types that use Arrays as structure, just yet.");e(c,o,i[s])}else t.has(i[s])?o.add(i[s]):"object"==typeof c?"_self"===a||(Array.isArray(c)?c.forEach(((t,n)=>e(t,o,i[s]+"."+n))):e(c,o,i[s])):o.add(i[s])})),[...o]}(e,new Set,"")}function h(e){b(e);const t=e.name;return s.def(`?${t}`,null,{verify:t=>w(t)||s.check(e,t)})}function y(e,t={}){if(!new.target)throw new TypeError("Type with new only.");if(Object.defineProperty(this,"name",{get:()=>e}),this.typeName=e,t.types){const{types:e}=t,n=new Set(e);Object.defineProperty(this,"isSumType",{get:()=>!0}),Object.defineProperty(this,"types",{get:()=>n})}if(t.native){const{native:e}=t;Object.defineProperty(this,"native",{get:()=>e})}}function m(e,t,{help:n="",verify:r,sealed:o,types:s,verifiers:i,native:c}={}){if(!e)throw new TypeError("Type must be named.");if(d(e),e.startsWith("?")){if(t)throw new TypeError("Option type can not have a spec.");if(!r(null))throw new TypeError("Option type must be OK to be unset.")}void 0===o&&(o=!0);const l=new y(e,{types:s,native:c}),u={spec:t,kind:"def",help:n,verify:r,verifiers:i,sealed:o,types:s,native:c,type:l};return a.set(e,u),l}function b(e){if(!(e instanceof y))throw new TypeError("Type must be a valid Type object.")}function g(e){const t=v(e);if(!f(t))throw new TypeError(`Type must exist. Type ${t} has not been defined.`)}function w(e){return null==e}function v(e){if(e&&e.name)return e.name;const t=Object.prototype.toString.call(e).replace(/\[object |\]/g,"");return t.endsWith("Constructor")?t.replace(/Constructor$/,""):t}s.def=m,s.check=c,s.sub=function(e){return s`>${e.name}`},s.verify=function(...e){return c(...e)},s.validate=i,s.partialMatch=function(e,t){return i(e,t,{partial:!0})},s.defEnum=function(e,...t){if(!e)throw new TypeError("Type must be named.");d(e);const n=new Set(t);return m(e,null,{verify:e=>n.has(e),help:`Value of Enum type ${e} must be one of ${t.join(",")}`})},s.defSub=u,s.defTuple=function(e,{pattern:t}){if(!e)throw new TypeError("Type must be named.");if(!t)throw new TypeError("Type must be specified.");const n={};t.forEach(((e,t)=>n[t]=e));const r=new y(e),o={kind:"def",spec:n,type:r};return a.set(e,o),r},s.defCollection=function(e,{container:t,member:n},{sealed:r=true,verify:o}={}){if(!e)throw new TypeError("Type must be named.");if(!t||!n)throw new TypeError("Type must be specified.");d(e);const s=new y(e),i={kind:"defCollection",spec:{container:t,member:n},verify:o,sealed:r,type:s};return a.set(e,i),s},s.defOr=function(e,...t){return s.def(e,null,{types:t,verify:e=>t.some((t=>c(t,e)))})},s.option=function(e){return s`?${e.name}`},s.defOption=h,s.maybe=function(e){try{return h(e)}catch(e){}return s`?${e.name}`},s.guard=function(e,t){b(e),g(e);const{valid:n,errors:r}=i(e,t);if(!n)throw new TypeError(`Type ${e} requested, but item is not of that type: ${r.join(", ")}`)},s.errors=function(...e){return i(...e).errors},s[Symbol.for("jtype-system.typeCache")]=a,s.def("Any",null,{verify:()=>!0}),s.def("Some",null,{verify:e=>!w(e)}),s.def("None",null,{verify:e=>w(e)}),s.def("Function",null,{verify:e=>e instanceof Function}),s.def("Integer",null,{verify:e=>Number.isInteger(e)}),s.def("Array",null,{verify:e=>Array.isArray(e)}),s.def("Iterable",null,{verify:e=>e[Symbol.iterator]instanceof Function}),r.forEach((e=>m(v(e),null,{native:e,verify:t=>v(t.constructor)===v(e)}))),r.forEach((e=>u(s`${v(e)}`))),y.prototype.toString=function(){return`${this.typeName} Type`},s.defOr("KeyValue",s`String`,s`Number`),s.def("Key",{key:s`KeyValue`});const E=s.def("Handlers",null,{verify:e=>{if(!s.check(s`Object`,e))return!1;const t=Object.keys(e),n=Object.values(e),r=t.every((e=>s.check(s`String`,e))),o=n.every((e=>s.check(s`Function`,e)));return r&&o}});s.defCollection("FuncArray",{container:s`Array`,member:s`Function`}),s.def("EmptyArray",null,{verify:e=>Array.isArray(e)&&0==e.length}),s.def("MarkupObject",{type:s`String`,code:s`String`,nodes:s`Array`,externals:s`Array`},{verify:e=>"MarkupObject"==e.type&&e.code==t}),s.def("MarkupAttrObject",{type:s`String`,code:s`String`,str:s`String`},{verify:e=>"MarkupAttrObject"==e.type&&e.code==t}),s.def("VanillaViewLikeObject",{code:s`String`,externals:s`Array`,nodes:s`Array`,to:s`Function`,update:s`Function`,v:s`Array`,oldVals:s`Array`}),s.def("VanillaViewObject",{code:s`String`,externals:s`Array`,nodes:s`Array`,to:s`Function`,update:s`Function`,v:s`Array`,oldVals:s`Array`},{verify:e=>function(e){return t===e.code}(e)}),s.def("BangObject",null,{verify:e=>e[Symbol.for("BANG-VV")]}),s.defOr("Component",s`VanillaViewObject`,s`BangObject`),s.defCollection("VanillaViewArray",{container:s`Array`,member:s`Component`}),s.def("SVanillaViewObject",{str:s`String`,handlers:E}),s.defCollection("SVanillaViewArray",{container:s`Array`,member:s`SVanillaViewObject`});const k=H,T=R,A=()=>{},S=/(?:<!\-\-)?(key\d+)(?:\-\->)?/gm,O=/\w+=/,C=20,N=e=>`'key' property must be a string. Was: ${e.key}`,j=new class{beforeend(e,t){t.appendChild(e)}beforebegin(e,t){t.parentNode.insertBefore(e,t)}afterend(e,t){t.parentNode.insertBefore(e,t.nextSibling)}replace(e,t){t.parentNode.replaceChild(e,t)}afterbegin(e,t){t.insertBefore(e,t.firstChild)}innerhtml(e,t){t.innerHTML="",t.appendChild(e)}insert(e,t){t.replaceChildren(e)}};globalThis.onerror=(...e)=>(console.log(e,e[0]+"",e[4]&&e[4].message,e[4]&&e[4].stack),!0);const F=e=>s.check(s`Key`,e),$={};async function x(e,...t){const n=this;let r,o=!1;if(0===e[0].length&&t[0].state&&(o=!0),o)return({state:r}=t.shift()),e.shift(),t=await Promise.all(t.map((e=>M(n,e,r)))),B(e,t);{const r=async r=>(t=await Promise.all(t.map((e=>M(n,e,r)))),B(e,t));return r}}function V(e,...t){return B(e,t,{useCache:!1})}function B(e,n,{useCache:r=!0}={}){const o={};let a,i;if(n=n.map(z),r){({key:a}=n.find(F)||{}),i=e.join("<link rel=join>");const{cached:t,firstCall:r}=function(e,t,n){let r,o=$[e];return null==o?(o=$[e]={},void 0!==n&&(o.instances={},o=o.instances[n]={}),r=!0):void 0!==n?o.instances?(o=o.instances[n],r=!o):(o.instances={},r=!0):r=!1,{cached:o,firstCall:r}}(i,0,a);if(!r)return t.update(n),t;o.oldVals=Array.from(n)}else o.oldVals=Array.from(n);e=[...e];const c={},l=n.map(function(e){return(t,n)=>{if(s.check(s`Key`,t))return"";const r=("key"+Math.random()).replace(".","").padEnd(C,"0").slice(0,C);let o=r;return(s.check(s`VanillaViewObject`,t)||s.check(s`MarkupObject`,t))&&(o=`\x3c!--${o}--\x3e`),e[r.trim()]={vi:n,val:t,replacers:[]},o}}(c)),u=[];let f="";for(;e.length>1;)f+=e.shift()+l.shift();f+=e.shift();const d=W(f),p=document.createTreeWalker(d,NodeFilter.SHOW_ALL);do{L({walker:p,vmap:c,externals:u})}while(p.nextNode());return Object.assign(o,{externals:u,v:Object.values(c),to:_,update:J,code:t,nodes:[...d.childNodes]}),r&&(void 0!==a?$[i].instances[a]=o:$[i]=o),o}async function M(e,t,n){if("string"==typeof t)return t;if("number"==typeof t)return t+"";if("boolean"==typeof t)return t+"";if(t instanceof Date)return t+"";if(function(e){return null==e}(t)){if(e.CONFIG.allowUnset)return e.CONFIG.unsetPlaceholder||"";throw new TypeError(`Value cannot be unset, was: ${t}`)}if(t instanceof Promise)return await M(e,await t.catch((e=>e+"")),n);if(t instanceof Element)return t.outerHTML;if(t instanceof Node)return t.textContent;const r=s.check(s`VanillaViewArray`,t),o=F(t),a=s.check(s`MarkupObject`,t),i=s.check(s`MarkupAttrObject`,t),c=s.check(s`Component`,t);if(r||o||a||i||c)return r?q(t):t;if(null!==(l=t)&&l[Symbol.iterator]instanceof Function)return M(e,await Promise.all((await Promise.all(Array.from(t)).catch((e=>err+""))).map((t=>M(e,t,n)))),n);var l;if("AsyncFunction"===Object.getPrototypeOf(t).constructor.name)return await M(e,await t(n),n);if(t instanceof Function)return t(n);{let n;if(Object.prototype.hasOwnProperty.call(t,e.CONFIG.bangKey)){n=new e.StateKey(t[e.CONFIG.bangKey])+"";const r=e.STATE.get(n);e.STATE.delete(r),e.STATE.set(n,t),e.STATE.set(t,n)}else e.STATE.has(t)?n=e.STATE.get(t):(n=new e.StateKey+"",e.STATE.set(n,t),e.STATE.set(t,n));return n+="",n}}function _(e,t){const n=(t||"replace").toLocaleLowerCase(),r=document.createDocumentFragment();this.nodes.forEach((e=>r.appendChild(e)));const o=e instanceof Node?e:document.querySelector(e);try{j[n](r,o)}catch(t){switch(t.constructor&&t.constructor.name){case"DOMException":X({error:"Error inserting template into DOM. Position must be one of: replace, beforebegin, afterbegin, beforeend, innerhtml, afterend"});break;case"TypeError":X({error:(a=e,`Error inserting template into DOM. Location ${a} was not found in the document.`)});break;default:throw t}}for(var a;this.externals.length;)this.externals.shift()()}function L({walker:e,vmap:t,externals:n}){const r=e.currentNode;switch(r.nodeType){case Node.ELEMENT_NODE:!function({node:e,vmap:t,externals:n}){(function(e){if(!e.hasAttribute)return[];if(e.hasAttribute("class")&&e.setAttribute("class",K(e.getAttribute("class"))),e.attributes&&Number.isInteger(e.attributes.length))return Array.from(e.attributes);const t=[];for(const n of e)e.hasAttribute(n)&&t.push({name:n,value:e.getAttribute(n)});return t})(e).forEach((({name:r,value:o}={})=>{const a={node:e,vmap:t,externals:n,name:r,lengths:[]};S.lastIndex=0;let s=S.exec(r);for(;s;)G(s,a,{updateName:!0}),s=S.exec(r);for(S.lastIndex=0,s=S.exec(o);s;)G(s,a,{updateName:!1}),s=S.exec(o)}))}({node:r,vmap:t,externals:n});break;case Node.COMMENT_NODE:case Node.TEXT_NODE:!function({node:e,vmap:t,externals:n}){const r=[],o=e.nodeValue;let a=S.exec(o);for(;a;){const{index:s}=a,i=t[a[1]],c=D({node:e,index:s,lengths:r,val:i});n.push((()=>c(i.val))),i.replacers.push(c),a=S.exec(o)}}({node:r,vmap:t,externals:n})}}function D(e){const{node:t}=e,n=Object.assign({},e,{oldVal:{length:C},oldNodes:[t],lastAnchor:t});return e=>{if(n.oldVal!=e)switch(n.val.val=e,U(e)){case"markupobject":case"vanillaviewobject":!function(e,t){let{oldNodes:n,lastAnchor:r}=t;if(e.nodes.length)if(o=n,a=e.nodes,o.length==a.length&&Array.from(o).every(((e,t)=>e==a[t])));else{const t=[];for(Array.from(e.nodes).forEach((e=>{if(document.contains(e.ownerDocument))for(;t.length;){const n=t.shift();e.parentNode.insertBefore(n,e)}else t.push(e)}));t.length;){const e=t.shift();r.parentNode.insertBefore(e,r)}}else{const e=function(e){let t=[...e.parentNode.childNodes].find((e=>e.nodeType==Node.COMMENT_NODE&&"vanillaview_placeholder"==e.nodeValue));return t||(t=W("\x3c!--vanillaview_placeholder--\x3e").firstChild),t}(r);r.parentNode.insertBefore(e,r.nextSibling),t.lastAnchor=e}var o,a;const s=(i=n,c=e.nodes,i=new Set(i),c=new Set(c),new Set([...i].filter((e=>!c.has(e)))));var i,c;if(s.size){const e=document.createDocumentFragment();s.forEach((t=>e.appendChild(t)))}for(t.oldNodes=e.nodes||[r];e.externals.length;)e.externals.shift()()}(e,n);break;default:!function(e,t){let{oldVal:n,index:r,val:o,lengths:a,node:s}=t;const i=o.vi,c=Object.keys(a.slice(0,i)).length*C,l=a.slice(0,i).reduce(((e,t)=>e+t),0),u=s.nodeValue;a[i]=e.length;const f=l-c,d=u.slice(0,r+f)+e+u.slice(r+f+n.length);s.nodeValue=d,s.linkedCustomElement&&d.match(/state[\s\S]*=/gm)&&s.linkedCustomElement.setAttribute("state",e),t.oldVal=e}(e,n)}}}function G(e,t,{updateName:n}){const{index:r,input:o}=e,a=Object.assign({},t,{index:r,input:o,updateName:n,val:t.vmap[e[1]],oldVal:{length:C},oldName:t.name});let i;i=n?function(e){let{oldName:t,node:n,val:r}=e;return e=>{if(t==e)return;r.val=e;const o=n.hasAttribute(t)?t:"";if(o!==e){if(o&&(n.removeAttribute(t),n[t]=void 0),e){let t,r=e=e.trim();if(O.test(e)){const n=e.indexOf("=");[r,t]=[e.slice(0,n),e.slice(n+1)]}P(n,r,t)}t=e}}}(a):function(e){const t=t=>{if(e.oldVal!=t)switch(e.val.val=t,U(t)){case"funcarray":!function(e,t){let{oldVal:n,node:r,name:o,externals:a}=t;if(n&&!Array.isArray(n)&&(n=[n]),"bond"!==o){let t={};o.includes(":")&&([o,...t]=o.split(":"),t=t.reduce(((e,t)=>(e[t]=!0,e)),{})),n&&n.forEach((e=>r.removeEventListener(o,e,t))),e.forEach((e=>r.addEventListener(o,e,t)))}else n&&n.forEach((e=>{const t=a.indexOf(e);t>=0&&a.splice(t,1)})),e.forEach((e=>a.push((()=>e(r)))));t.oldVal=e}(t,e);break;case"function":!function(e,t){let{oldVal:n,node:r,name:o,externals:a}=t;if("bond"!==o){let t={};o.includes(":")&&([o,...t]=o.split(":"),t=t.reduce(((e,t)=>(e[t]=!0,e)),{})),n&&r.removeEventListener(o,n,t),r.addEventListener(o,e,t),P(r,o,"")}else{if(n){const e=a.indexOf(n);e>=0&&a.splice(e,1)}a.push((()=>e(r)))}t.oldVal=e}(t,e);break;case"handlers":!function(e,t){let{oldVal:n,node:r,externals:o}=t;n&&s.check(s`Handlers`,n)&&Object.entries(n).forEach((([e,t])=>{if("bond"!==e){let n={};e.includes(":")&&([e,...n]=e.split(":"),n=n.reduce(((e,t)=>(e[t]=!0,e)),{})),console.log(e,t,n),r.removeEventListener(e,t,n)}else{const e=o.indexOf(t);e>=0&&o.splice(e,1)}})),Object.entries(e).forEach((([e,t])=>{if("bond"!==e){let n={};e.includes(":")&&([e,...n]=e.split(":"),n=n.reduce(((e,t)=>(e[t]=!0,e)),{})),r.addEventListener(e,t,n)}else o.push((()=>t(r)))})),t.oldVal=e}(t,e);break;case"markupobject":case"vanillaviewobject":I(t=function(e){const t=document.createDocumentFragment();e.forEach((e=>t.appendChild(e.cloneNode(!0))));const n=document.createElement("body");return n.appendChild(t),n.innerHTML}(t.nodes),e);break;case"markupattrobject":t=t.str;default:I(t,e)}};return t(e.val.val),t}(a),a.externals.push((()=>i(a.val.val))),a.val.replacers.push(i)}function I(e,t){let{oldVal:n,node:r,index:o,name:a,val:s,lengths:i}=t,c=0;const l=s.vi,u=Object.keys(i.slice(0,l)).length*C;"class"==a&&(0==(e=e.trim()).length&&(c=-1),t.val.val=e),i[l]=e.length+c;let f=r.getAttribute(a);const d=i.slice(0,l).reduce(((e,t)=>e+t),0)-u,p=f.slice(0,o+d),h=f.slice(o+d+n.length);let y;if("class"==a){const t=0==n.length?" ":"";y=p+t+e+t+h}else y=p+e+h;P(r,a,y),t.oldVal=e}function P(e,t,n){"class"==t&&(n=K(n));try{e.setAttribute(t,n)}catch(e){}try{e[t]=null==n||n}catch(e){}}function U(e){return s.check(s`Function`,e)?"function":s.check(s`Handlers`,e)?"handlers":s.check(s`VanillaViewObject`,e)?"vanillaviewobject":s.check(s`MarkupObject`,e)?"markupobject":s.check(s`MarkupAttrObject`,e)?"markupattrobject":s.check(s`VanillaViewArray`,e)?"vanillaviewarray":s.check(s`FuncArray`,e)?"funcarray":"default"}function H(e){const n=W(e=s.check(s`None`,e)?"":e);return{type:"MarkupObject",code:t,nodes:[...n.childNodes],externals:[]}}function R(e){return e=(e=s.check(s`None`,e)?"":e).replace(/"/g,"&quot;"),{type:"MarkupAttrObject",code:t,str:e}}function K(e){return(e=e.trim()).replace(/\s+/g," ")}function W(e){const t=(new DOMParser).parseFromString(`<template>${e}</template>`,"text/html").head.firstElementChild;let n;if(t instanceof HTMLTemplateElement)return n=t.content,n.normalize(),n;throw new TypeError(`Could not find template element after parsing string to DOM:\n=START=\n${e}\n=END=`)}function z(e){const t=s.check(s`Function`,e),n=s.check(s`None`,e),r=s.check(s`Object`,e),o=s.check(s`VanillaViewArray`,e),a=s.check(s`FuncArray`,e),i=s.check(s`MarkupObject`,e),c=s.check(s`MarkupAttrObject`,e),l=s.check(s`VanillaViewObject`,e),u=s.check(s`VanillaViewLikeObject`,e)&&!l;return t||l||F(e)||(e=>s.check(s`Handlers`,e))(e)?e:o?q(e):a||i||c?e:(n&&X({error:"Unset values not allowed here."}),u&&X({error:"Possible XSS / object forgery attack detected. Object code could not be verified."}),r&&("key"===Object.keys(e).join(",")?X({error:N(e)}):X({error:"Object values not allowed here."})),e+"")}function q(e){const n=[],r=[];return e.forEach((e=>{n.push(...e.externals),r.push(...e.nodes)})),{v:[],code:t,oldVals:[],nodes:r,to:_,update:J,externals:n}}function J(e){this.v.filter((({vi:t})=>function(e,t){const[n,r]=[e,t].map(U);let o;if(n!=r)o=!0;else switch(n){case"vanillaviewobject":case"funcarray":case"function":case"vanillaviewarray":case"markupattrobject":case"markupobject":o=!0;break;default:o=JSON.stringify(e)!==JSON.stringify(t)}return o}(e[t],this.oldVals[t]))).forEach((({vi:t,replacers:n})=>n.forEach((n=>n(e[t]))))),this.oldVals=Array.from(e)}function X(e,t){throw e.stack=(new Error).stack.split(/\s*\n\s*/g),JSON.stringify(e,null,2)}Object.assign(x,{say:function(e){},attrskip:T,skip:k,attrmarkup:R,markup:H,guardEmptyHandlers:function(e){return Array.isArray(e)?0==e.length?[A]:e:s.check(s`None`,e)?A:void 0},die:X}),Object.assign(globalThis,{vanillaview:{c:V,s:x,T:s}}),e.c=V,e.s=x,Object.defineProperty(e,"__esModule",{value:!0})}(exports);{const DEBUG=!1,LEGACY=!1,MOBILE=isMobile(),DOUBLE_BARREL=/\w+-\w*/,F=_FUNC,FUNC_CALL=/\);?$/,CONFIG={htmlFile:"markup.html",scriptFile:"script.js",styleFile:"style.css",bangKey:"_bang_key",componentsPath:"./components",allowUnset:!1,unsetPlaceholder:"",EVENTS:"error load click pointerdown pointerup pointermove mousedown mouseup \n        mousemove touchstart touchend touchmove touchcancel dblclick dragstart dragend \n        dragmove drag mouseover mouseout focus blur focusin focusout scroll\n      ".split(/\s+/g).filter((e=>e.length)).map((e=>`on${e}`)),delayFirstPaintUntilLoaded:!0,noHandlerPassthrough:!1},STATE=new Map,CACHE=new Map,Started=new Set,TRANSFORMING=new WeakSet,Dependents=new Map,Counts={started:0,finished:0},OBSERVE_OPTS={subtree:!0,childList:!0,characterData:!0};let observer,systemKeys=1,_c$;const BangBase=e=>class t extends HTMLElement{static#e=["state"];static get observedAttributes(){return Array.from(t.#e)}#t=e;constructor(){super(),DEBUG&&say("log",e,"constructed"),this.print()}print(){Counts.started++,this.prepareVisibility();const e=this.handleAttrs(this.attributes,{originals:!0});return this.printShadow(e)}prepareVisibility(){this.classList.add("bang-el"),this.classList.remove("bang-styled"),fetchStyle(e).catch((e=>this.setVisible()))}setVisible(){this.classList.add("bang-styled")}attributeChangedCallback(e,t,n){"state"!==e||isUnset(t)||(DEBUG&&say("log","Changing state, so calling print.",t,n,this),this.print())}connectedCallback(){say("log",e,"connected")}handleAttrs(e,{node:t,originals:n}={}){let r;t||(t=this);for(let{name:o,value:a}of e)if(!isUnset(a))if("state"===o){const e=a,s=STATE.get(e);if(isUnset(s))throw new TypeError(`\n                <${o}> constructor passed state key ${e} which is unset. It must be set.\n              `);if(r=s,n){let n=Dependents.get(e);n||(n=new Set,Dependents.set(e,n)),n.add(t)}}else if(n){if(!o.startsWith("on"))continue;if(a=a.trim(),!a)continue;const e=t===this?"this.":"this.getRootNode().host.";if(a.startsWith(e))continue;const n=a.match(FUNC_CALL)?"":"(event)";t.setAttribute(o,`${e}${a}${n}`)}return r}printShadow(e){return fetchMarkup(this.#t,this).then((async t=>{const n=await cook.call(this,t,e);if(LEGACY){const t=toDOM(n);if(t.querySelectorAll(CONFIG.EVENTS.map((e=>`[${e}]`)).join(", ")).forEach((e=>this.handleAttrs(e.attributes,{node:e,originals:!0}))),DEBUG&&say("log",t,n,e),this.shadowRoot)this.shadowRoot.replaceChildren(t);else{const e=this.attachShadow({mode:"open"});console.log({observer}),observer.observe(e,OBSERVE_OPTS),e.replaceChildren(t)}}else if(this.shadowRoot);else{const e=this.attachShadow({mode:"open"});observer.observe(e,OBSERVE_OPTS),n.to(e,"insert"),e.querySelectorAll(CONFIG.EVENTS.map((e=>`[${e}]`)).join(", ")).forEach((e=>this.handleAttrs(e.attributes,{node:e,originals:!0})))}})).catch((e=>DEBUG&&say("warn",e))).finally((()=>Counts.finished++))}};class StateKey extends String{constructor(e){super(null==e?"system-key:"+systemKeys++:`client-key:${e}`)}}async function use(name){let component;await fetchScript(name).then((script=>{const Base=BangBase(name),Compose=`(function () { ${Base.toString()}; return ${script}; }())`;try{component=eval(Compose)}catch(e){DEBUG&&say("warn",e,Compose,component)}})).catch((()=>{component=BangBase(name)})),self.customElements.define(name,component),DEBUG&&self.customElements.whenDefined(name).then((e=>say("log",name,"defined",e)))}function bangfig(e={}){Object.assign(CONFIG,e)}function setState(e,t,n=!1){if(STATE.set(e,t),STATE.set(t,e),document.body&&n){Array.from(document.querySelectorAll(":not(body).bang-styled")).forEach((e=>e.classList.remove("bang-styled")));const e=document.body.innerHTML;document.body.innerHTML="",document.body.innerHTML=e}else{const t=Dependents.get(e);t&&t.forEach((e=>e.print()))}}function cloneState(e){if(STATE.has(e))return JSON.parse(JSON.stringify(STATE.get(e)));throw new TypeError(`State store does not have the key ${e}`)}async function loaded(){return becomesTrue((()=>{const e=Counts.started>0,t=Counts.finished===Counts.started;return e&&t}))}async function bangLoaded(){return becomesTrue((()=>"function"==typeof _c$))}async function install(){Object.assign(globalThis,{use,setState,cloneState,loaded,sleep,bangfig,bangLoaded,isMobile,...DEBUG?{STATE,CACHE,TRANSFORMING,Started,BangBase}:{}});const e=vanillaview,{s:t}=e,n={STATE,CONFIG,StateKey};_c$=t.bind(n),n._c$=_c$,CONFIG.delayFirstPaintUntilLoaded&&becomesTrue((()=>document.body)).then((()=>document.body.classList.add("bang-el"))),observer=new MutationObserver(transformBangs),observer.observe(document,OBSERVE_OPTS),findBangs(transformBang),loaded().then((()=>document.body.classList.add("bang-styled")))}async function fetchMarkup(e,t){const n=`markup:${e}`;Started.has(n)?CACHE.has(n)||await becomesTrue((()=>CACHE.has(n))):Started.add(n);const r=`style${e}`,o=`${CONFIG.componentsPath}/${e}`;if(CACHE.has(n)){const e=CACHE.get(n);if(CACHE.get(r)instanceof Error&&t.setVisible(),!(CACHE.get(r)instanceof Error&&e.includes(`href=${o}/${CONFIG.styleFile}`)))return t.setVisible(),e}const a=`${o}/${CONFIG.htmlFile}`;let s;return await fetch(a).then((async n=>{let o="";return o=n.ok?await n.text():"<slot></slot>",CACHE.get(r)instanceof Error?(s=o,t.setVisible()):(s=`<style>${await fetchStyle(e).catch((e=>""))}</style>${o}`,t.setVisible()),s})).finally((async()=>CACHE.set(n,await s)))}async function fetchFile(e,t){const n=`${t}:${e}`;if(Started.has(n)?CACHE.has(n)||await becomesTrue((()=>CACHE.has(n))):Started.add(n),CACHE.has(n))return CACHE.get(n);const r=`${CONFIG.componentsPath}/${e}/${t}`;let o;return await fetch(r).then((e=>{if(e.ok)return o=e.text(),o;throw o=new TypeError(`Fetch error: ${r}, ${e.statusText}`),o})).finally((async()=>CACHE.set(n,await o)))}async function fetchStyle(e){return fetchFile(e,CONFIG.styleFile)}async function fetchScript(e){return fetchFile(e,CONFIG.scriptFile)}function transformBangs(e){e.forEach((e=>{DEBUG&&say("log",e);const{addedNodes:t}=e;t&&t.forEach((e=>findBangs(transformBang,e)))}))}function transformBang(e){DEBUG&&say("log",{transformBang},{current:e});const[t,n]=getBangDetails(e);DEBUG&&say("log",{name:t,data:n});const r=createElement(t,n);e.linkedCustomElement=r,e.parentNode.replaceChild(r,e)}function findBangs(e,t=document.documentElement){const n={acceptNode(e){if(e.nodeType!==Node.COMMENT_NODE)return NodeFilter.FILTER_SKIP;const[t]=getBangDetails(e);return t.match(DOUBLE_BARREL)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}},r=document.createTreeWalker(t,NodeFilter.SHOW_COMMENT,n),o=[];let a=r.currentNode;if(n.acceptNode(a)===NodeFilter.FILTER_ACCEPT&&!TRANSFORMING.has(a)){TRANSFORMING.add(a);const e=a;o.push((()=>transformBang(e)))}for(;a=r.nextNode(),a;)if(!TRANSFORMING.has(a)){TRANSFORMING.add(a);const e=a;o.push((()=>transformBang(e)))}for(;o.length;)o.pop()()}function getBangDetails(e){const t=e.textContent.trim(),[n,...r]=t.split(/[\s\t]/g);return[n,r.join(" ")]}async function process(e,t){if("string"==typeof e)return e;if("number"==typeof e)return e+"";if("boolean"==typeof e)return e+"";if(e instanceof Date)return e+"";if(isUnset(e)){if(CONFIG.allowUnset)return CONFIG.unsetPlaceholder||"";throw new TypeError(`Value cannot be unset, was: ${e}`)}if(e instanceof Promise)return await e.catch((e=>e+""));if(e instanceof Element)return e.outerHTML;if(e instanceof Node)return e.textContent;if(isIterable(e))return(await Promise.all((await Promise.all(Array.from(e)).catch((e=>err+""))).map((e=>process(e,t))))).join(" ");if("AsyncFunction"===Object.getPrototypeOf(e).constructor.name)return await e(t);if(e instanceof Function)return e(t);{let t;if(Object.prototype.hasOwnProperty.call(e,CONFIG.bangKey)){t=new StateKey(e[CONFIG.bangKey])+"";const n=STATE.get(t);STATE.delete(n),STATE.set(t,e),STATE.set(e,t)}else STATE.has(e)?t=STATE.get(e):(t=new StateKey+"",STATE.set(t,e),STATE.set(e,t));return t+="",DEBUG&&say("log",{stateKey:t}),t}}async function cook(markup,state){let cooked="";try{Object.prototype.hasOwnProperty.call(state,"_self")||Object.defineProperty(state,"_self",{get:()=>state}),DEBUG&&say("log","_self",state._self)}catch(e){DEBUG&&say("warn","Cannot add '_self' self-reference property to state. \n            This enables a component to inspect the top-level state object it is passed.")}try{with(state)cooked=await eval("(async function () { return await _FUNC`${{state}}"+markup+"`; }())");return DEBUG&&console.log({cooked}),cooked}catch(error){throw say("error","Template error",{markup,state,error}),error}}async function _FUNC(e,...t){const n=Array.from(e);return await _c$(n,...t)}async function old_FUNC(e,...t){const n=Array.from(e);let r=!1,o="";if(DEBUG&&say("log",n.join("${}")),0===n[0].length&&t[0].state&&(r=!0),r){const{state:e}=t.shift();for(n.shift(),t=await Promise.all(t.map((t=>process(t,e)))),DEBUG&&say("log","System _FUNC call: "+t.join(", "));n.length;)o+=n.shift(),t.length&&(o+=t.shift());return o}return async e=>{for(t=await Promise.all(t.map((t=>process(t,e)))),DEBUG&&say("log","in-template _FUNC call:"+t.join(", "));n.length;)o+=n.shift(),t.length&&(o+=t.shift());return o}}function createElement(e,t){const n=document.createDocumentFragment(),r=document.createElement("div");return n.appendChild(r),r.insertAdjacentHTML("afterbegin",`<${e} ${t}></${e}>`),r.firstElementChild}function toDOM(e){const t=(new DOMParser).parseFromString(`<template>${e}</template>`,"text/html").head.firstElementChild.content;return t.normalize(),t}async function becomesTrue(e=(()=>!0)){return new Promise((async t=>{for(;await sleep(47),!e(););t()}))}async function sleep(e){return new Promise((t=>setTimeout(t,e)))}function isIterable(e){return null!==e&&e[Symbol.iterator]instanceof Function}function isUnset(e){return null==e}function say(e,...t){(DEBUG||"error"===e||e.endsWith("!"))&&MOBILE&&alert(`${e}: ${t.join("\n")}`),(DEBUG||"error"===e||e.endsWith("!"))&&console[e.replace("!","")](...t)}function isMobile(){let e=!1;var t;return t=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0),e}install()}}},__webpack_exports__={};__webpack_modules__[876](0,__webpack_exports__)})();