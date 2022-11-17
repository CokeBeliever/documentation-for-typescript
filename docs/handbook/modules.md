# Modules

JavaScript 在处理模块化代码方面有着悠久的历史。TypeScript 诞生于 2012 年，已经实现了对许多这些格式的支持，但随着时间的推移，社区和 JavaScript 规范已经聚集在一种名为 ES Modules (或 ES6 Modules) 的格式上。你可能知道它是 `import` / `export` 语法。

ES Modules 于 2015 年被添加到 JavaScript 规范中，到 2020 年在大多数 web 浏览器和 JavaScript 运行时中得到了广泛支持。

对于重点，这本手册将涵盖 ES Modules 和它流行的先驱 CommonJS `module.exports =` 语法，以及你可以在 [Modules](https://www.typescriptlang.org/docs/handbook/modules.html) 下的参考部分找到关于其他模块模式的信息。

## How JavaScript Modules are Defined - 如何定义 JavaScript 模块

在 TypeScript 中，就像在 ECMAScript 2015 中一样，任何包含顶级 `import` 或 `export` 的文件都被认为是一个模块。

相反，没有任何顶级导入或导出声明的文件被视为脚本，其内容在全局作用域中可用 (因此对模块也是如此)。

模块在它们自己的作用域中执行，而不是在全局作用域中。这意味着在模块中声明的变量、函数、类等在模块外部是不可见的，除非它们是使用一个导出形式显式导出。相反，要使用从不同模块导出的变量、函数、类、接口等，它必须是使用一个导入形式进行导入。

## Non-modules - 非模块

在我们开始之前，了解 TypeScript 对模块的定义是很重要的。JavaScript 规范声明，任何没有 `export` 或顶级 `await` 的 JavaScript 文件都应该被视为脚本，而不是模块。

在脚本文件中，变量和类型被声明为共享全局作用域，并且假设你将使用 [`outFile`](https://www.typescriptlang.org/tsconfig#outFile) 编译器选项将多个输入文件连接到一个输出文件中，或者在 HTML 中使用多个 `<script>` 标签来加载这些文件 (以正确的顺序！)。

如果你有一个当前没有任何 `import` 或 `export` 的文件，但你希望被视为模块，请添加这一行：

```typescript
export {};
```

这将把文件更改为一个不导出任何事物的模块。无论你的模块目标是什么，此语法都可以工作。

## Modules in TypeScript - 在 TypeScript 中的模块

> 额外的阅读：
> [Impatient JS (Modules)](https://exploringjs.com/impatient-js/ch_modules.html#overview-syntax-of-ecmascript-modules) > [MDN: JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

在 TypeScript 中编写基于模块的代码时，有三件事需要考虑：

- **语法**：我想使用什么语法来导入和导出事物？
- **模块解析**：模块名 (或路径) 和磁盘上的文件之间是什么关系？
- **模块输出目标**：我发出的 JavaScript 模块应该是什么样子？

### ES Module Syntax - ES Module 语法

文件可以通过 `export default` 声明一个主要的导出：

```typescript
// @filename: hello.ts
export default function helloWorld() {
  console.log("Hello, world!");
}
```

然后通过导入：

```typescript
import helloWorld from "./hello.js";
helloWorld();
```

除了默认导出之外，通过 `export` 省略 `default`，你还可以有多个变量和函数的导出：

```typescript
// @filename: maths.ts
export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}
```

这些可以通过 `import` 语法在另一个文件中使用：

```typescript
import { pi, phi, absolute } from "./maths.js";

console.log(pi);
const absPhi = absolute(phi);
// const absPhi: number
```

### Additional Import Syntax - 额外的导入语法

可以使用 `import {old as new}` 这样的格式重命名导入：

```typescript
import { pi as π } from "./maths.js";

console.log(π);
// (alias) var π: number
// import π
```

你可以将上述语法混合和匹配到单个 `import` 中：

```typescript
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RandomNumberGenerator, { pi as π } from "./maths.js";

RandomNumberGenerator;
// (alias) class RandomNumberGenerator
// import RandomNumberGenerator

console.log(π);
// (alias) const π: 3.14
// import π
```

你可以获取所有导出的对象，并使用 `* as name` 将它们放到单个命名空间中：

```typescript
// @filename: app.ts
import * as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);
// const positivePhi: number
```

你可以通过 `import "./file"` 导入文件，而不将任何变量包含到当前模块中：

```typescript
// @filename: app.ts
import "./maths.js";

console.log("3.14");
```

在本例中，`import` 不执行任何操作。然而，所有在 `maths.ts` 中的代码都进行了评估，这会引发副作用，影响其他对象。

#### TypeScript Specific ES Module Syntax - TypeScript 特有的 ES Module 语法

可以使用与 JavaScript 值相同的语法导出和导入类型：

```typescript
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
```

TypeScript 用两个对声明类型导入的概念扩展了 `import` 语法：

##### `import type`

这是一个只能导入类型的导入语句：

```typescript
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";

// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;

// @filename: app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
// "createCatName" 是使用 "import type" 导入的，因此不能用作值。
```

##### Inline `type` imports - 内联 `type` 导入

TypeScript 4.5 还允许在单个导入前加上 `type` 前缀，以表示导入的引用是一种类型：

```typescript
// @filename: app.ts
import { createCatName, type Cat, type Dog } from "./animal.js";

export type Animals = Cat | Dog;
const name = createCatName();
```

所有这些都允许像 Babel、swc 或 esbuild 这样的非 TypeScript 转译器知道哪些导入可以被安全地删除。

#### ES Module Syntax with CommonJS Behavior - 带有 CommonJS 行为的 ES Module 语法

TypeScript 有 ES Module 语法，这与 CommonJS 和 AMD 的 `require` 直接相关。在大多数情况下，使用 ES Module 的 `import` 与来自这些环境的 `require` 相同，但是这种语法可以确保你的 TypeScript 文件和 CommonJS 的输出是 1 对 1 的匹配：

```typescript
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");
```

你可以在 [模块参考页面](https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require) 了解更多关于此语法的信息。

## CommonJS Syntax - CommonJS 语法

CommonJS 是 npm 上大多数模块的发布格式。即使你使用的是上面的 ES Modules 语法，对 CommonJS 语法的工作原理有一个简单的了解也会帮助你更容易地调试。

#### Exporting - 导出

通过在被调用的全局 `module` 上设置 `exports` 属性来导出标识符。

```typescript
function absolute(num: number) {
  if (num < 0) return num * -1;
  return num;
}

module.exports = {
  pi: 3.14,
  squareTwo: 1.41,
  phi: 1.61,
  absolute,
};
```

然后可以通过 `require` 语句导入这些文件：

```typescript
const maths = require("maths");
maths.pi; // any
```

或者你可以使用 JavaScript 中的解构特性稍微简化一下：

```typescript
const { squareTwo } = require("maths");
squareTwo; // const squareTwo: any
```

### CommonJS and ES Modules interop - CommonJS 和 ES Modules 交互操作

在默认导入和模块命名空间对象导入的区别上，CommonJS 和 ES Modules 之间的特性不匹配。TypeScript 有一个编译器标志 [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop)，用于减少的两个不同约束集之间的分歧。

## TypeScript’s Module Resolution Options - TypeScript 的模块解析选项

模块解析是从 `import` 或 `require` 语句中获取字符串，并确定该字符串引用的文件的过程。

TypeScript 包含两种解析策略：Classic 和 Node。Classic，当编译器选项 [`module`](https://www.typescriptlang.org/tsconfig#module) 不是 `commonjs` 时的默认值，包含它是为了向后兼容。Node 策略复制 Node.js 在 CommonJS 模式下的工作方式，对 `.ts` 和 `.d.ts` 进行额外检查。

有很多 TSConfig 标志会影响 TypeScript 中的模块策略： [`moduleResolution`](https://www.typescriptlang.org/tsconfig#moduleResolution), [`baseUrl`](https://www.typescriptlang.org/tsconfig#baseUrl), [`paths`](https://www.typescriptlang.org/tsconfig#paths), [`rootDirs`](https://www.typescriptlang.org/tsconfig#rootDirs)。

有关这些策略如何工作的详细信息，你可以参考 [模块解析](https://www.typescriptlang.org/docs/handbook/module-resolution.html)。

## TypeScript’s Module Output Options - TypeScript 的模块输出选项

有两个选项会影响发出的 JavaScript 输出：

- [`target`](https://www.typescriptlang.org/tsconfig#target)，它决定哪些 JS 特性被降级 (转换为在旧的 JavaScript 运行时中运行)，以及哪些保持不变
- [`module`](https://www.typescriptlang.org/tsconfig#module)，它确定用于模块之间交互使用的代码

你使用的 `target` 取决于你希望运行 TypeScript 代码的 JavaScript 运行时中的可用特性。这可能是：你支持的最老的网页浏览器，你期望运行的最低版本的 Node.js，或者可能来自于你运行时的独特约束 - 比如 Electron。

所有模块之间的通信都是通过模块加载器进行的，编译器选项 `module` 决定使用哪个模块。在运行时，模块加载器负责在执行模块之前定位和执行模块的所有依赖项。

例如，这里有一个使用 ES Modules 语法的 TypeScript 文件，展示了 `module` 的几个不同选项：

```typescript
import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;
```

#### `ES2020`

```typescript
import { valueOfPi } from "./constants.js";
export const twoPi = valueOfPi * 2;
```

#### `CommonJS`

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoPi = void 0;
const constants_js_1 = require("./constants.js");
exports.twoPi = constants_js_1.valueOfPi * 2;
```

#### `UMD`

```typescript
(function (factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./constants.js"], factory);
  }
})(function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.twoPi = void 0;
  const constants_js_1 = require("./constants.js");
  exports.twoPi = constants_js_1.valueOfPi * 2;
});
```

---

> 注意，ES2020 实际上与最初的 `index.ts` 相同。

你可以在 [TSConfig Reference for `module`](https://www.typescriptlang.org/tsconfig#module) 中看到所有可用选项以及它们发出的 JavaScript 代码是什么样子的。

## TypeScript namespaces - TypeScript 命名空间

TypeScript 有自己的模块格式，叫做 `namespaces`，这早于 ES Modules 标准。该语法有许多用于创建复杂定义文件的有用特性，并且在 [DefinitelyTyped](https://www.typescriptlang.org/dt) 中仍然得到了积极的使用。虽然没有被弃用，但名称空间中的大多数特性都存在于 ES Modules 中，我们建议你使用它来与 JavaScript 的方向保持一致。你可以在 [名称空间参考页面](https://www.typescriptlang.org/docs/handbook/namespaces.html) 学习更多关于名称空间的信息。
