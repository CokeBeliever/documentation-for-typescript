# Library Structures

一般来说，构造声明文件的方式取决于库的使用。有很多方法可以在 JavaScript 中提供一个库，你需要编写声明文件来匹配它。本指南介绍了如何识别常见的库模式，以及如何编写与该模式对应的声明文件。

在 [Templates](https://www.typescriptlang.org/docs/handbook/declaration-files/templates.html) 部分中，每一种主要的库结构模式都有相应的文件。你可以从这些 templates 开始，以帮助你更快地完成任务。

## Identifying Kinds of Libraries - 识别库的种类

首先，我们将回顾 TypeScript 声明文件可以表示的库的种类。我们将简要介绍如何使用每种库，如何编写它们，并列出来自现实世界的一些示例库。

识别库的结构是编写库声明文件的第一步。我们将提示如何根据结构的用法和代码来识别结构。根据库的文档和组织，一种可能比另一种容易。我们建议使用你觉得更舒服的任何一种。

## What should you look for? - 你应该寻找什么？

在查看要输入的库时，问自己问题。

1. 你如何获得库？

   例如，你只能通过 npm 获得它还是只能从 CDN 获得它？

2. 你如何导入它？

   它是否添加了全局对象？它是否使用 `require` 或 `import` / `export`语句？

## Smaller samples for different types of libraries - 为不同类型库提供更小的示例

### Modular Libraries - 模块库

几乎每个现代 Node.js 库都属于模块家族。这类库只能在带有模块加载器的 JS 环境中工作。例如，`express` 只在 Node.js 中工作，必须使用 CommonJS 的 `require` 函数加载。

ECMAScript 2015 (也称为 ES2015、ECMAScript 6 和 ES6)、CommonJS 和 RequireJS 都有类似的导入模块的概念。例如，在 JavaScript CommonJS (Node.js) 中，你会写

```js
var fs = require("fs");
```

在 TypeScript 或 ES6 中，`import` 关键字的作用是一样的：

```typescript
import * as fs from "fs";
```

你通常会看到模块化库在它们的文档中包含其中一行：

```js
var someLib = require("someLib");
```

或

```js
define(..., ['someLib'], function(someLib) {
});
```

与全局模块一样，你可能会在 [UMD](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html#umd) 模块的文档中看到这些示例，因此一定要检查代码或文档。

#### Identifying a Module Library from Code - 从代码中识别模块库

模块化库通常至少具有以下一些特性：

- `require` 或 `define` 的无条件调用
- 声明像是 `import * as a from 'b';` 或 `export c;`
- 赋值给 `exports` 或 `module.exports`

他们很少会有：

- 赋值给 `window` 或 `global` 属性

#### Templates For Modules - 模块模板

模块有四个模板可用，[`module.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html), [`module-class.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html), [`module-function.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html) 和 [`module-plugin.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html)。

你应该首先阅读 [`module.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html)，概述它们的工作方式。

然后使用模板 [`module-function.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html) 如果你的模块可以像函数一样被调用。

```js
const x = require("foo");
// Note: calling 'x' as a function
const y = x(42);
```

使用模板 [`module-class.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html)。如果你的模块可以使用 `new` 来构造：

```js
const x = require("bar");
// Note: using 'new' operator on the imported variable
const y = new x("hello");
```

如果你有一个模块，当它被导入时，会对其他模块进行更改，则使用模板 [`module-plugin.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html)：

```js
const jest = require("jest");
require("jest-matchers-files");
```

### Global Libraries - 全局库

全局库是可以从全局作用域访问的库 (即不使用任何形式的 `import`)。许多库只是公开一个或多个全局变量供使用。例如，如果你正在使用 [jQuery](https://jquery.com/)，可以通过简单地引用它来使用 `$` 变量：

```js
$(() => {
  console.log("hello!");
});
```

你通常会在全局库的文档中看到如何在 HTML script 标签中使用库的指引：

```html
<script src="http://a.great.cdn.for/someLib.js"></script>
```

今天，大多数流行的全局可访问库实际上都是作为 UMD 库编写的 (见下文)。UMD 库文档很难与全局库文档区分开来。在编写全局声明文件之前，确保库实际上不是 UMD。

#### Identifying a Global Library from Code - 从代码中识别全局库

全局库代码通常非常简单。一个全局的 `"Hello, world"` 库可能是这样的：

```js
function createGreeting(s) {
  return "Hello, " + s;
}
```

或像是这样：

```js
// Web
window.createGreeting = function (s) {
  return "Hello, " + s;
};
// Node
global.createGreeting = function (s) {
  return "Hello, " + s;
};
// Potentially any runtime
globalThis.createGreeting = function (s) {
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

#### Examples of Global Libraries - 全局库例子

因为通常很容易将全局库转换为 UMD 库，所以很少流行的库仍然是用全局风格编写的。但是，需要 DOM (或没有依赖关系) 的小型库可能仍然是全局库。

#### Global Library Template - 全局库模板

模板文件 [`global.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/global-plugin-d-ts.html) 定义了一个示例库 `myLib`。一定要阅读 [“防止名称冲突” 的脚注](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html#preventing-name-conflicts)。

### UMD

UMD 模块既可以作为模块使用 (通过导入)，也可以作为全局模块使用 (当在没有模块加载器的环境中运行时)。许多流行的库，比如 [Moment.js](https://momentjs.com/)，都是这样编写的。例如，在 Node.js 或使用 RequireJS 中，你会写：

```js
import moment = require("moment");
console.log(moment.format());
```

而在普通浏览器环境中，你将编写：

```js
console.log(moment.format());
```

#### Identifying a UMD library - 识别 UMD 库

[UMD modules](https://github.com/umdjs/umd) 检查是否存在模块加载器环境。这是一个很容易发现的模式，看起来像这样：

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["libName"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("libName"));
    } else {
        root.returnExports = factory(root.libName);
    }
}(this, function (b) {
```

如果在库的代码中，特别是在文件的顶部看到 `typeof define`, `typeof window`, 或 `typeof module` 的测试，则几乎总是 UMD 库。

UMD 库的文档也经常演示 Node.js 中的使用示例显示 `require`，以及浏览器中的使用示例显示使用 `<script>` 标签加载脚本。

#### Examples of UMD libraries - UML 库例子

大多数流行的库现在都可以作为 UMD 包使用。例子包括 [jQuery](https://jquery.com/), [Moment.js](https://momentjs.com/), [lodash](https://lodash.com/) 等。

#### Template - 模版

使用 [`module-plugin.d.ts`](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html) 模版。

## Consuming Dependencies - 消费依赖

库可能具有几种类型的依赖项。本节演示如何将它们导入到声明文件中。

### Dependencies on Global Libraries - 对全局库的依赖

如果你的库依赖于全局库，使用 `/// <reference types="..." />` 指令：

```typescript
/// <reference types="someLib" />
function getThing(): someLib.thing;
```

### Dependencies on Modules - 对模块的依赖

如果库依赖于某个模块，请使用 `import` 语句：

```typescript
import * as moment from "moment";
function getThing(): moment;
```

### Dependencies on UMD libraries - 对 UMD 库的依赖

#### From a Global Library - 来自全局库

如果全局库依赖于 UMD 模块，使用 `/// <reference types` 指令：

```typescript
/// <reference types="moment" />
function getThing(): moment;
```

#### From a Module or UMD Library - 来自模块或 UMD 库

如果你的模块或 UMD 库依赖于 UMD 库，请使用 `import` 语句：

```typescript
import * as someLib from "someLib";
```

不要使用 `/// <reference` 指令来声明对 UMD 库的依赖。

## Footnotes - 脚注

### Preventing Name Conflicts - 防止名称冲突

注意，在编写全局声明文件时，可以在全局作用域中定义许多类型。我们强烈反对这样做，因为当一个项目中有许多声明文件时，它可能会导致无法解决的名称冲突。

要遵循的一个简单规则是，只根据库定义的全局变量来声明类型的名称空间。例如，如果库定义了全局值 'cats'，你应该编写：

```typescript
declare namespace cats {
  interface KittySettings {}
}
```

而不是

```typescript
// at top-level
interface CatsKittySettings {}
```

该指引还确保库可以在不破坏声明文件用户的情况下转换到 UMD。

### The Impact of ES6 on Module Call Signatures - ES6 对模块调用签名的影响

许多流行的库，如 Express，在导入时将自己公开为可调用函数。例如，典型的 Express 用法如下所示：

```js
import exp = require("express");
var app = exp();
```

在 ES6 兼容的模块加载器中，顶级对象 (在这里作为 `exp` 导入) 只能具有属性；顶层模块对象永远不能被调用。

这里最常见的解决方案是为可调用/可构造对象定义 `default` 导出；模块加载器通常会自动检测这种情况，并用 `default` 导出替换顶层对象。如果你的 tsconfig.json 中有 [`"esModuleInterop": true`](https://www.typescriptlang.org/tsconfig/#esModuleInterop)，TypeScript 可以为你处理这个问题。
