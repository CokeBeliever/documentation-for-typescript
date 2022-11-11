import{_ as s,c as n,o as a,a as p}from"./app.7f6d65a5.js";const i=JSON.parse('{"title":"More on Functions","description":"","frontmatter":{},"headers":[{"level":2,"title":"Function Type Expressions - \u51FD\u6570\u7C7B\u578B\u8868\u8FBE\u5F0F","slug":"function-type-expressions-\u51FD\u6570\u7C7B\u578B\u8868\u8FBE\u5F0F","link":"#function-type-expressions-\u51FD\u6570\u7C7B\u578B\u8868\u8FBE\u5F0F","children":[]},{"level":2,"title":"Call Signatures - \u8C03\u7528\u7B7E\u540D","slug":"call-signatures-\u8C03\u7528\u7B7E\u540D","link":"#call-signatures-\u8C03\u7528\u7B7E\u540D","children":[]},{"level":2,"title":"Construct Signatures - \u6784\u9020\u7B7E\u540D","slug":"construct-signatures-\u6784\u9020\u7B7E\u540D","link":"#construct-signatures-\u6784\u9020\u7B7E\u540D","children":[]},{"level":2,"title":"Generic Functions - \u6CDB\u578B\u51FD\u6570","slug":"generic-functions-\u6CDB\u578B\u51FD\u6570","link":"#generic-functions-\u6CDB\u578B\u51FD\u6570","children":[{"level":3,"title":"Inference - \u63A8\u65AD","slug":"inference-\u63A8\u65AD","link":"#inference-\u63A8\u65AD","children":[]},{"level":3,"title":"Constraints - \u7EA6\u675F","slug":"constraints-\u7EA6\u675F","link":"#constraints-\u7EA6\u675F","children":[]},{"level":3,"title":"Working with Constrained Values - \u4F7F\u7528\u53D7\u7EA6\u675F\u503C","slug":"working-with-constrained-values-\u4F7F\u7528\u53D7\u7EA6\u675F\u503C","link":"#working-with-constrained-values-\u4F7F\u7528\u53D7\u7EA6\u675F\u503C","children":[]},{"level":3,"title":"Specifying Type Arguments - \u6307\u5B9A\u7C7B\u578B\u5B9E\u53C2","slug":"specifying-type-arguments-\u6307\u5B9A\u7C7B\u578B\u5B9E\u53C2","link":"#specifying-type-arguments-\u6307\u5B9A\u7C7B\u578B\u5B9E\u53C2","children":[]},{"level":3,"title":"Guidelines for Writing Good Generic Functions - \u7F16\u5199\u826F\u597D\u6CDB\u578B\u51FD\u6570\u7684\u6307\u5357","slug":"guidelines-for-writing-good-generic-functions-\u7F16\u5199\u826F\u597D\u6CDB\u578B\u51FD\u6570\u7684\u6307\u5357","link":"#guidelines-for-writing-good-generic-functions-\u7F16\u5199\u826F\u597D\u6CDB\u578B\u51FD\u6570\u7684\u6307\u5357","children":[]}]},{"level":2,"title":"Optional Parameters - \u53EF\u9009\u5F62\u53C2","slug":"optional-parameters-\u53EF\u9009\u5F62\u53C2","link":"#optional-parameters-\u53EF\u9009\u5F62\u53C2","children":[{"level":3,"title":"Optional Parameters in Callbacks - \u5728\u56DE\u8C03\u4E2D\u7684\u53EF\u9009\u5F62\u53C2","slug":"optional-parameters-in-callbacks-\u5728\u56DE\u8C03\u4E2D\u7684\u53EF\u9009\u5F62\u53C2","link":"#optional-parameters-in-callbacks-\u5728\u56DE\u8C03\u4E2D\u7684\u53EF\u9009\u5F62\u53C2","children":[]}]},{"level":2,"title":"Function Overloads - \u51FD\u6570\u91CD\u8F7D","slug":"function-overloads-\u51FD\u6570\u91CD\u8F7D","link":"#function-overloads-\u51FD\u6570\u91CD\u8F7D","children":[{"level":3,"title":"Overload Signatures and the Implementation Signature - \u91CD\u8F7D\u7B7E\u540D\u548C\u5B9E\u73B0\u7B7E\u540D","slug":"overload-signatures-and-the-implementation-signature-\u91CD\u8F7D\u7B7E\u540D\u548C\u5B9E\u73B0\u7B7E\u540D","link":"#overload-signatures-and-the-implementation-signature-\u91CD\u8F7D\u7B7E\u540D\u548C\u5B9E\u73B0\u7B7E\u540D","children":[]},{"level":3,"title":"Writing Good Overloads - \u7F16\u5199\u597D\u7684\u91CD\u8F7D","slug":"writing-good-overloads-\u7F16\u5199\u597D\u7684\u91CD\u8F7D","link":"#writing-good-overloads-\u7F16\u5199\u597D\u7684\u91CD\u8F7D","children":[]}]},{"level":2,"title":"Declaring this in a Function - \u5728\u51FD\u6570\u4E2D\u58F0\u660E this","slug":"declaring-this-in-a-function-\u5728\u51FD\u6570\u4E2D\u58F0\u660E-this","link":"#declaring-this-in-a-function-\u5728\u51FD\u6570\u4E2D\u58F0\u660E-this","children":[]},{"level":2,"title":"Other Types to Know About - \u5176\u4ED6\u9700\u8981\u4E86\u89E3\u7684\u7C7B\u578B","slug":"other-types-to-know-about-\u5176\u4ED6\u9700\u8981\u4E86\u89E3\u7684\u7C7B\u578B","link":"#other-types-to-know-about-\u5176\u4ED6\u9700\u8981\u4E86\u89E3\u7684\u7C7B\u578B","children":[{"level":3,"title":"void","slug":"void","link":"#void","children":[]},{"level":3,"title":"object","slug":"object","link":"#object","children":[]},{"level":3,"title":"unknown","slug":"unknown","link":"#unknown","children":[]},{"level":3,"title":"never","slug":"never","link":"#never","children":[]},{"level":3,"title":"Function","slug":"function","link":"#function","children":[]}]},{"level":2,"title":"Rest Parameters and Arguments - Rest \u5F62\u53C2\u548C\u5B9E\u53C2","slug":"rest-parameters-and-arguments-rest-\u5F62\u53C2\u548C\u5B9E\u53C2","link":"#rest-parameters-and-arguments-rest-\u5F62\u53C2\u548C\u5B9E\u53C2","children":[{"level":3,"title":"Rest Parameters - Rest \u5F62\u53C2","slug":"rest-parameters-rest-\u5F62\u53C2","link":"#rest-parameters-rest-\u5F62\u53C2","children":[]},{"level":3,"title":"Rest Arguments - Rest \u5B9E\u53C2","slug":"rest-arguments-rest-\u5B9E\u53C2","link":"#rest-arguments-rest-\u5B9E\u53C2","children":[]}]},{"level":2,"title":"Parameter Destructuring - \u5F62\u53C2\u89E3\u6784","slug":"parameter-destructuring-\u5F62\u53C2\u89E3\u6784","link":"#parameter-destructuring-\u5F62\u53C2\u89E3\u6784","children":[]},{"level":2,"title":"Assignability of Functions - \u51FD\u6570\u7684\u53EF\u5206\u914D\u6027","slug":"assignability-of-functions-\u51FD\u6570\u7684\u53EF\u5206\u914D\u6027","link":"#assignability-of-functions-\u51FD\u6570\u7684\u53EF\u5206\u914D\u6027","children":[{"level":3,"title":"Return type void - \u8FD4\u56DE\u7C7B\u578B void","slug":"return-type-void-\u8FD4\u56DE\u7C7B\u578B-void","link":"#return-type-void-\u8FD4\u56DE\u7C7B\u578B-void","children":[]}]}],"relativePath":"handbook/more-on-functions.md"}'),l={name:"handbook/more-on-functions.md"},o=p("",187),e=[o];function t(c,r,y,F,D,C){return a(),n("div",null,e)}const d=s(l,[["render",t]]);export{i as __pageData,d as default};
