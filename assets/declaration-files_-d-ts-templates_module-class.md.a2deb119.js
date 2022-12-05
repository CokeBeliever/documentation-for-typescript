import{_ as s,c as n,o as a,a as l}from"./app.50ab2801.js";const C=JSON.parse('{"title":"Module: Class","description":"","frontmatter":{},"headers":[],"relativePath":"declaration-files/-d-ts-templates/module-class.md"}'),p={name:"declaration-files/-d-ts-templates/module-class.md"},e=l(`<h1 id="module-class" tabindex="-1">Module: Class <a class="header-anchor" href="#module-class" aria-hidden="true">#</a></h1><p>\u4F8B\u5982\uFF0C\u5F53\u4F60\u60F3\u8981\u4F7F\u7528 JavaScript \u4EE3\u7801\u65F6\uFF0C\u5B83\u770B\u8D77\u6765\u50CF\uFF1A</p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> Greeter </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">require</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">super-greeter</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> greeter </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Greeter</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">greeter</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">greet</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>\u5904\u7406\u901A\u8FC7 UMD \u548C\u6A21\u5757\u7684\u5BFC\u5165\uFF1A</p><div class="language-typescript"><button title="Copy Code" class="copy"></button><span class="lang">typescript</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]</span></span>
<span class="line"><span style="color:#676E95;">// Project: [~THE PROJECT NAME~]</span></span>
<span class="line"><span style="color:#676E95;">// Definitions by: [~YOUR NAME~] &lt;[~A URL FOR YOU~]&gt;</span></span>
<span class="line"><span style="color:#676E95;">/*~ This is the module template file for class modules.</span></span>
<span class="line"><span style="color:#676E95;"> *~ You should rename it to index.d.ts and place it in a folder with the same name as the module.</span></span>
<span class="line"><span style="color:#676E95;"> *~ For example, if you were writing a file for &quot;super-greeter&quot;, this</span></span>
<span class="line"><span style="color:#676E95;"> *~ file should be &#39;super-greeter/index.d.ts&#39;</span></span>
<span class="line"><span style="color:#676E95;"> */</span></span>
<span class="line"><span style="color:#676E95;">// Note that ES6 modules cannot directly export class objects.</span></span>
<span class="line"><span style="color:#676E95;">// This file should be imported using the CommonJS-style:</span></span>
<span class="line"><span style="color:#676E95;">//   import x = require(&#39;[~THE MODULE~]&#39;);</span></span>
<span class="line"><span style="color:#676E95;">//</span></span>
<span class="line"><span style="color:#676E95;">// Alternatively, if --allowSyntheticDefaultImports or</span></span>
<span class="line"><span style="color:#676E95;">// --esModuleInterop is turned on, this file can also be</span></span>
<span class="line"><span style="color:#676E95;">// imported as a default import:</span></span>
<span class="line"><span style="color:#676E95;">//   import x from &#39;[~THE MODULE~]&#39;;</span></span>
<span class="line"><span style="color:#676E95;">//</span></span>
<span class="line"><span style="color:#676E95;">// Refer to the TypeScript documentation at</span></span>
<span class="line"><span style="color:#676E95;">// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require</span></span>
<span class="line"><span style="color:#676E95;">// to understand common workarounds for this limitation of ES6 modules.</span></span>
<span class="line"><span style="color:#676E95;">/*~ If this module is a UMD module that exposes a global variable &#39;myClassLib&#39; when</span></span>
<span class="line"><span style="color:#676E95;"> *~ loaded outside a module loader environment, declare that global here.</span></span>
<span class="line"><span style="color:#676E95;"> *~ Otherwise, delete this declaration.</span></span>
<span class="line"><span style="color:#676E95;"> */</span></span>
<span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> as namespace </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">super-greeter</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">/*~ This declaration specifies that the class constructor function</span></span>
<span class="line"><span style="color:#676E95;"> *~ is the exported object from the file</span></span>
<span class="line"><span style="color:#676E95;"> */</span></span>
<span class="line"><span style="color:#89DDFF;">export</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> Greeter</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#676E95;">/*~ Write your module&#39;s methods and properties in this class */</span></span>
<span class="line"><span style="color:#C792EA;">declare</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">class</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">Greeter</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#C792EA;">constructor</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">customGreeting</span><span style="color:#89DDFF;">?:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">string</span><span style="color:#89DDFF;">);</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">greet</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">void</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#F07178;">myMethod</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">opts</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MyClass</span><span style="color:#89DDFF;">.</span><span style="color:#FFCB6B;">MyClassMethodOptions</span><span style="color:#89DDFF;">):</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#676E95;">/*~ If you want to expose types from your module as well, you can</span></span>
<span class="line"><span style="color:#676E95;"> *~ place them in this block.</span></span>
<span class="line"><span style="color:#676E95;"> *~</span></span>
<span class="line"><span style="color:#676E95;"> *~ Note that if you decide to include this namespace, the module can be</span></span>
<span class="line"><span style="color:#676E95;"> *~ incorrectly imported as a namespace object, unless</span></span>
<span class="line"><span style="color:#676E95;"> *~ --esModuleInterop is turned on:</span></span>
<span class="line"><span style="color:#676E95;"> *~   import * as x from &#39;[~THE MODULE~]&#39;; // WRONG! DO NOT DO THIS!</span></span>
<span class="line"><span style="color:#676E95;"> */</span></span>
<span class="line"><span style="color:#C792EA;">declare</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">namespace</span><span style="color:#A6ACCD;"> </span><span style="color:#FFCB6B;">MyClass</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">export</span><span style="color:#F07178;"> </span><span style="color:#C792EA;">interface</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">MyClassMethodOptions</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    width</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">    height</span><span style="color:#89DDFF;">?:</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">number</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div>`,5),o=[e];function t(c,r,i,y,D,F){return a(),n("div",null,o)}const A=s(p,[["render",t]]);export{C as __pageData,A as default};
