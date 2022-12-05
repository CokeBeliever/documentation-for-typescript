# Global .d.ts

## Global Libraries - 全局库

全局库是可以从全局作用域访问的库 (即不使用任何形式的 `import`)。许多库只是公开一个或多个全局变量供使用。例如，如果你正在使用 [jQuery](https://jquery.com/)，可以通过简单地引用 `$` 变量来使用它：

```js
$(() => {
  console.log("hello!");
});
```

你通常会在全局库的文档中看到如何在 HTML script 标签中使用库的指导：

```html
<script src="http://a.great.cdn.for/someLib.js"></script>
```

如今，大多数流行的全球可访问库实际上都是作为 UMD 库编写的 (见下文)。UMD 库文档很难与全局库文档区分开来。在编写全局声明文件之前，确保库实际上不是 UMD。

## Identifying a Global Library from Code - 从代码中识别全局库

全局库代码通常非常简单。一个全局的 "Hello, world" 库可能是这样的：

```js
function createGreeting(s) {
  return "Hello, " + s;
}
```

或者像是这样：

```js
window.createGreeting = function (s) {
  return "Hello, " + s;
};
```

在查看全局库的代码时，你通常会看到：

- 顶级 `var` 语句或 `function` 声明
- 一或多个赋值到 `window.someName`
- 假设存在 `document` 或 `window` 等 DOM 原语

你不会看到：

- 检查 `require` 或 `define` 等模块加载器的使用情况
- CommonJS/Node.js 风格的导入形式为 `var fs = require("fs");`
- 调用 `define(...)`
- 描述如何 `require` 或导入库的文档

## Examples of Global Libraries - 全局库例子

因为通常很容易将全局库转换为 UMD 库，所以很少流行的库仍然是用全局风格编写的。但是，需要 DOM (或没有依赖关系) 的小型库可能仍然是全局库。

## Global Library Template - 全局库模版

你可以在下面看到一个示例 DTS：

```typescript
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ If this library is callable (e.g. can be invoked as myLib(3)),
 *~ include those call signatures here.
 *~ Otherwise, delete this section.
 */
declare function myLib(a: string): string;
declare function myLib(a: number): number;
/*~ If you want the name of this library to be a valid type name,
 *~ you can do so here.
 *~
 *~ For example, this allows us to write 'var x: myLib';
 *~ Be sure this actually makes sense! If it doesn't, just
 *~ delete this declaration and add types inside the namespace below.
 */
interface myLib {
  name: string;
  length: number;
  extras?: string[];
}
/*~ If your library has properties exposed on a global variable,
 *~ place them here.
 *~ You should also place types (interfaces and type alias) here.
 */
declare namespace myLib {
  //~ We can write 'myLib.timeout = 50;'
  let timeout: number;
  //~ We can access 'myLib.version', but not change it
  const version: string;
  //~ There's some class we can create via 'let c = new myLib.Cat(42)'
  //~ Or reference e.g. 'function f(c: myLib.Cat) { ... }
  class Cat {
    constructor(n: number);
    //~ We can read 'c.age' from a 'Cat' instance
    readonly age: number;
    //~ We can invoke 'c.purr()' from a 'Cat' instance
    purr(): void;
  }
  //~ We can declare a variable as
  //~   'var s: myLib.CatSettings = { weight: 5, name: "Maru" };'
  interface CatSettings {
    weight: number;
    name: string;
    tailLength?: number;
  }
  //~ We can write 'const v: myLib.VetID = 42;'
  //~  or 'const v: myLib.VetID = "bob";'
  type VetID = string | number;
  //~ We can invoke 'myLib.checkCat(c)' or 'myLib.checkCat(c, v);'
  function checkCat(c: Cat, s?: VetID);
}
```
