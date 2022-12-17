import{_ as s,c as n,o,a}from"./app.33ab7401.js";const u=JSON.parse('{"title":"What is a tsconfig.json","description":"","frontmatter":{},"headers":[{"level":2,"title":"Overview - \u6982\u8FF0","slug":"overview-\u6982\u8FF0","link":"#overview-\u6982\u8FF0","children":[]},{"level":2,"title":"Using tsconfig.json or jsconfig.json - \u4F7F\u7528 tsconfig.json \u6216 jsconfig.json","slug":"using-tsconfig-json-or-jsconfig-json-\u4F7F\u7528-tsconfig-json-\u6216-jsconfig-json","link":"#using-tsconfig-json-or-jsconfig-json-\u4F7F\u7528-tsconfig-json-\u6216-jsconfig-json","children":[]},{"level":2,"title":"Examples - \u4F8B\u5B50","slug":"examples-\u4F8B\u5B50","link":"#examples-\u4F8B\u5B50","children":[]},{"level":2,"title":"TSConfig Bases - TSConfig \u5E93","slug":"tsconfig-bases-tsconfig-\u5E93","link":"#tsconfig-bases-tsconfig-\u5E93","children":[]},{"level":2,"title":"Details","slug":"details","link":"#details","children":[]},{"level":2,"title":"TSConfig Reference","slug":"tsconfig-reference","link":"#tsconfig-reference","children":[]},{"level":2,"title":"Schema","slug":"schema","link":"#schema","children":[]}],"relativePath":"project-configuration/what-is-a-tsconfig-json.md"}'),l={name:"project-configuration/what-is-a-tsconfig-json.md"},e=a(`<h1 id="what-is-a-tsconfig-json" tabindex="-1">What is a tsconfig.json <a class="header-anchor" href="#what-is-a-tsconfig-json" aria-hidden="true">#</a></h1><h2 id="overview-\u6982\u8FF0" tabindex="-1">Overview - \u6982\u8FF0 <a class="header-anchor" href="#overview-\u6982\u8FF0" aria-hidden="true">#</a></h2><p>\u5728\u4E00\u4E2A\u76EE\u5F55\u4E2D\u6709 <code>tsconfig.json</code> \u6587\u4EF6\u7684\u5B58\u5728\uFF0C\u8868\u793A\u8BE5\u76EE\u5F55\u662F TypeScript \u9879\u76EE\u7684\u6839\u76EE\u5F55\u3002<code>tsconfig.json</code> \u6587\u4EF6\u6307\u5B9A\u7F16\u8BD1\u9879\u76EE\u6240\u9700\u7684\u6839\u6587\u4EF6\u548C\u7F16\u8BD1\u5668\u9009\u9879\u3002</p><p>JavaScript \u9879\u76EE\u53EF\u4EE5\u4F7F\u7528 <code>jsconfig.json</code> \u6587\u4EF6\u4EE3\u66FF\uFF0C\u5B83\u7684\u4F5C\u7528\u51E0\u4E4E\u76F8\u540C\uFF0C\u4F46\u6709\u4E00\u4E9B Javascript \u76F8\u5173\u7684\u7F16\u8BD1\u5668\u6807\u5FD7\u9ED8\u8BA4\u542F\u7528\u3002</p><p>\u4E00\u4E2A\u9879\u76EE\u662F\u901A\u8FC7\u4EE5\u4E0B\u65B9\u5F0F\u4E4B\u4E00\u7F16\u8BD1\u7684\uFF1A</p><h2 id="using-tsconfig-json-or-jsconfig-json-\u4F7F\u7528-tsconfig-json-\u6216-jsconfig-json" tabindex="-1">Using <code>tsconfig.json</code> or <code>jsconfig.json</code> - \u4F7F\u7528 <code>tsconfig.json</code> \u6216 <code>jsconfig.json</code> <a class="header-anchor" href="#using-tsconfig-json-or-jsconfig-json-\u4F7F\u7528-tsconfig-json-\u6216-jsconfig-json" aria-hidden="true">#</a></h2><ul><li>\u901A\u8FC7\u8C03\u7528\u4E0D\u5E26\u8F93\u5165\u6587\u4EF6\u7684 tsc\uFF0C\u5728\u8FD9\u79CD\u60C5\u51B5\u4E0B\uFF0C\u7F16\u8BD1\u5668\u641C\u7D22 <code>tsconfig.json</code> \u6587\u4EF6\u4ECE\u5F53\u524D\u76EE\u5F55\u5F00\u59CB\uFF0C\u5E76\u6CBF\u7740\u7236\u76EE\u5F55\u94FE\u7EE7\u7EED\u5411\u4E0A\u641C\u7D22\u3002</li><li>\u901A\u8FC7\u8C03\u7528\u4E0D\u5E26\u8F93\u5165\u6587\u4EF6\u7684 tsc\uFF0C\u5E76\u901A\u8FC7 <code>--project</code>\uFF08\u6216\u4EC5\u4E3A <code>-p</code>\uFF09\u547D\u4EE4\u884C\u9009\u9879\u6307\u5B9A\u5305\u542B <code>tsconfig.json</code> \u6587\u4EF6\u7684\u76EE\u5F55\u8DEF\u5F84\uFF0C\u6216\u5305\u542B\u914D\u7F6E\u7684\u6709\u6548 <code>.json</code> \u7684\u6587\u4EF6\u8DEF\u5F84\u3002</li></ul><p>\u5F53\u5728\u547D\u4EE4\u884C\u4E0A\u6307\u5B9A\u8F93\u5165\u6587\u4EF6\u65F6\uFF0C<code>tsconfig.json</code> \u6587\u4EF6\u4F1A\u88AB\u5FFD\u7565\u3002</p><h2 id="examples-\u4F8B\u5B50" tabindex="-1">Examples - \u4F8B\u5B50 <a class="header-anchor" href="#examples-\u4F8B\u5B50" aria-hidden="true">#</a></h2><p><code>tsconfig.json</code> \u6587\u4EF6\u793A\u4F8B\uFF1A</p><ul><li>\u4F7F\u7528 <a href="https://www.typescriptlang.org/tsconfig#files" target="_blank" rel="noreferrer"><code>files</code></a> \u5C5E\u6027</li></ul><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">compilerOptions</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">module</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">commonjs</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">noImplicitAny</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">removeComments</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">preserveConstEnums</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">sourceMap</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">files</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">core.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">sys.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">types.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">scanner.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">parser.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">utilities.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">binder.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">checker.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">emitter.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">program.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">commandLineParser.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">tsc.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">diagnosticInformationMap.generated.ts</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><ul><li>\u4F7F\u7528 <a href="https://www.typescriptlang.org/tsconfig#include" target="_blank" rel="noreferrer"><code>include</code></a> \u548C <code>exclude</code> \u5C5E\u6027</li></ul><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">compilerOptions</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">module</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">system</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">noImplicitAny</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">removeComments</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">preserveConstEnums</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">outFile</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">../../built/local/tsc.js</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">sourceMap</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">include</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">src/**/*</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">],</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">exclude</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">node_modules</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">**/*.spec.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h2 id="tsconfig-bases-tsconfig-\u5E93" tabindex="-1">TSConfig Bases - TSConfig \u5E93 <a class="header-anchor" href="#tsconfig-bases-tsconfig-\u5E93" aria-hidden="true">#</a></h2><p>\u8FD9\u53D6\u51B3\u4E8E\u4F60\u6253\u7B97\u5728\u5176\u4E2D\u8FD0\u884C\u4EE3\u7801\u7684 JavaScript \u8FD0\u884C\u65F6\u73AF\u5883\uFF0C\u6839\u636E\u4F60\u6253\u7B97\u5728\u5176\u4E2D\u8FD0\u884C\u4EE3\u7801\u7684 JavaScript \u8FD0\u884C\u65F6\u73AF\u5883\u7684\u4E0D\u540C\uFF0C\u5728 <a href="https://github.com/tsconfig/bases/" target="_blank" rel="noreferrer">github.com/tsconfig/bases</a> \u4E0A\u53EF\u80FD\u4F1A\u6709\u4E00\u4E2A\u4F60\u53EF\u4EE5\u4F7F\u7528\u7684\u57FA\u672C\u914D\u7F6E\u3002\u8FD9\u4E9B\u662F\u4F60\u9879\u76EE\u6269\u5C55\u7684 <code>tsconfig.json</code> \u6587\u4EF6\uFF0C\u901A\u8FC7\u5904\u7406\u8FD0\u884C\u65F6\u652F\u6301\u6765\u7B80\u5316\u4F60\u7684 <code>tsconfig.json</code>\u3002</p><p>\u4F8B\u5982\uFF0C\u5982\u679C\u4F60\u6B63\u5728\u7F16\u5199\u4E00\u4E2A\u4F7F\u7528 Node.js \u7248\u672C 12 \u6216\u66F4\u9AD8\u7248\u672C\u7684\u9879\u76EE\uFF0C\u90A3\u4E48\u4F60\u53EF\u4EE5\u4F7F\u7528 npm \u6A21\u5757 <a href="https://www.npmjs.com/package/@tsconfig/node12" target="_blank" rel="noreferrer"><code>@tsconfig/node12</code></a>\u3002</p><div class="language-json"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki"><code><span class="line"><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">extends</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@tsconfig/node12/tsconfig.json</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">compilerOptions</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">&quot;</span><span style="color:#FFCB6B;">preserveConstEnums</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">true</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">include</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">src/**/*</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">],</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C792EA;">exclude</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">[</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">node_modules</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">**/*.spec.ts</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">]</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><p>\u8FD9\u8BA9\u4F60\u7684 <code>tsconfig.json</code> \u4E13\u6CE8\u4E8E\u9879\u76EE\u7684\u72EC\u7279\u9009\u62E9\uFF0C\u800C\u4E0D\u662F\u6240\u6709\u7684\u8FD0\u884C\u65F6\u673A\u5236\u3002\u73B0\u5728\u5DF2\u7ECF\u6709\u4E86\u4E00\u4E9B tsconfig \u5E93\uFF0C\u6211\u4EEC\u5E0C\u671B\u793E\u533A\u53EF\u4EE5\u4E3A\u4E0D\u540C\u7684\u73AF\u5883\u6DFB\u52A0\u66F4\u591A\u3002</p><ul><li><a href="https://www.npmjs.com/package/@tsconfig/recommended" target="_blank" rel="noreferrer">Recommended</a></li><li><a href="https://www.npmjs.com/package/@tsconfig/node10" target="_blank" rel="noreferrer">Node 10</a></li><li><a href="https://www.npmjs.com/package/@tsconfig/node12" target="_blank" rel="noreferrer">Node 12</a></li><li><a href="https://www.npmjs.com/package/@tsconfig/node14" target="_blank" rel="noreferrer">Node 14</a></li><li><a href="https://www.npmjs.com/package/@tsconfig/node16" target="_blank" rel="noreferrer">Node 16</a></li><li><a href="https://www.npmjs.com/package/@tsconfig/deno" target="_blank" rel="noreferrer">Deno</a></li><li><a href="https://www.npmjs.com/package/@tsconfig/react-native" target="_blank" rel="noreferrer">React Native</a></li><li><a href="https://www.npmjs.com/package/@tsconfig/svelte" target="_blank" rel="noreferrer">Svelte</a></li></ul><h2 id="details" tabindex="-1">Details <a class="header-anchor" href="#details" aria-hidden="true">#</a></h2><p><code>&quot;compilerOptions&quot;</code> \u5C5E\u6027\u53EF\u4EE5\u7701\u7565\uFF0C\u5728\u8FD9\u79CD\u60C5\u51B5\u4E0B\u4F7F\u7528\u7F16\u8BD1\u5668\u7684\u9ED8\u8BA4\u503C\u3002\u67E5\u770B\u6211\u4EEC\u652F\u6301\u7684 <a href="https://www.typescriptlang.org/tsconfig" target="_blank" rel="noreferrer">Compiler Options</a> \u7684\u5B8C\u6574\u5217\u8868\u3002</p><h2 id="tsconfig-reference" tabindex="-1">TSConfig Reference <a class="header-anchor" href="#tsconfig-reference" aria-hidden="true">#</a></h2><p>\u5728 <a href="https://www.typescriptlang.org/tsconfig" target="_blank" rel="noreferrer">TSConfig Reference</a> \u4E2D\u5B66\u4E60\u6709\u5173\u6570\u767E\u4E2A\u914D\u7F6E\u9009\u9879\u7684\u66F4\u591A\u4FE1\u606F\u3002</p><h2 id="schema" tabindex="-1">Schema <a class="header-anchor" href="#schema" aria-hidden="true">#</a></h2><p><code>tsconfig.json</code> Schema \u53EF\u4EE5\u5728 <a href="http://json.schemastore.org/tsconfig" target="_blank" rel="noreferrer">the JSON Schema Store</a> \u4E2D\u627E\u5230\u3002</p>`,26),p=[e];function t(c,r,D,F,i,y){return o(),n("div",null,p)}const d=s(l,[["render",t]]);export{u as __pageData,d as default};
