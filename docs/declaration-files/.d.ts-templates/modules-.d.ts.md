# Modules .d.ts

## Comparing JavaScript to an example DTS - 将 JavaScript 与示例 DTS 进行比较

## Common CommonJS Patterns - 常见的 CommonJS 模式

使用 CommonJS 模式的模块使用 `module.exports` 以描述导出的值。例如，这是一个导出函数和数值常数的模块：

```js
const maxInterval = 12;
function getArrayLength(arr) {
  return arr.length;
}
module.exports = {
  getArrayLength,
  maxInterval,
};
```

这可以用下面的 `.d.ts` 描述：

```typescript
export function getArrayLength(arr: any[]): number;
export const maxInterval: 12;
```

TypeScript playground 可以显示 `.d.ts` 等效于 JavaScript 的代码。你可以 [在这里自己试试](https://www.typescriptlang.org/play?useJavaScript=true#code/GYVwdgxgLglg9mABAcwKZQIICcsEMCeAMqmMlABYAUuOAlIgN6IBQiiW6IWSNWAdABsSZcswC+zCAgDOURAFtcADwAq5GKUQBeRAEYATM2by4AExBC+qJQAc4WKNO2NWKdNjxFhFADSvFquqk4sxAA)。

`.d.ts` 的语法故意看起来像 [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 的语法。ES Modules 在 2019 年被 TC39 批准，虽然它已经通过编译器提供了很长一段时间，但如果你有一个使用 ES Modules 的 JavaScript 代码库：

```typescript
export function getArrayLength(arr) {
  return arr.length;
}
```

这将具有以下 `.d.ts` 等效：

```typescript
export function getArrayLength(arr: any[]): number;
```

### Default Exports - 默认导出

在 CommonJS 中，你可以导出任何值作为默认导出，例如这里是一个正则表达式模块：

```js
module.exports = /hello( world)?/;
```

可以用下面的 `.d.ts` 描述：

```typescript
declare const helloWorld: RegExp;
export default helloWorld;
```

或者一个数字：

```js
module.exports = 3.142;
```

```typescript
declare const pi: number;
export default pi;
```

CommonJS 中导出的一种方式是导出函数。因为函数也是对象，所以可以添加额外的字段并将其包含在导出中。

```js
function getArrayLength(arr) {
  return arr.length;
}
getArrayLength.maxInterval = 12;
module.exports = getArrayLength;
```

可以描述：

```typescript
export default function getArrayLength(arr: any[]): number;
export const maxInterval: 12;
```

注意，在 `.d.ts` 文件中使用 `export default` 需要 [`esModuleInterop: true`](https://www.typescriptlang.org/tsconfig#esModuleInterop) 才能工作。如果你的项目中不能有 `esModuleInterop: true`，例如当你向 Definitely Typed 提交 PR 时，你将不得不使用 `export=` 语法。这种较旧的语法使用起来比较困难，但适用于任何地方。下面介绍如何使用 `export=` 编写上面的示例：

```typescript
declare function getArrayLength(arr: any[]): number;
declare namespace getArrayLength {
  declare const maxInterval: 12;
}
export = getArrayLength;
```

有关其工作原理的详细信息，请参见 [Module: Functions](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-function-d-ts.html) 和 [Modules reference](https://www.typescriptlang.org/docs/handbook/modules.html) 页面。

## Handling Many Consuming Import - 处理许多消费导入

在现代消费代码中，导入模块的方法有很多种：

```typescript
const fastify = require("fastify");
const { fastify } = require("fastify");
import fastify = require("fastify");
import * as Fastify from "fastify";
import { fastify, FastifyInstance } from "fastify";
import fastify from "fastify";
import fastify, { FastifyInstance } from "fastify";
```

要覆盖所有这些情况，需要 JavaScript 代码实际支持所有这些模式。要支持许多这些模式，CommonJS 模块需要看起来像这样：

```js
class FastifyInstance {}
function fastify() {
  return new FastifyInstance();
}
fastify.FastifyInstance = FastifyInstance;
// Allows for { fastify }
fastify.fastify = fastify;
// Allows for strict ES Module support
fastify.default = fastify;
// Sets the default export
module.exports = fastify;
```

## Types in Modules - 模块中的类型

你可能希望为 JavaScript 代码提供一个不存在的类型：

```js
function getArrayMetadata(arr) {
  return {
    length: getArrayLength(arr),
    firstObject: arr[0],
  };
}
module.exports = {
  getArrayMetadata,
};
```

这可以描述：

```typescript
export type ArrayMetadata = {
  length: number;
  firstObject: any | undefined;
};
export function getArrayMetadata(arr: any[]): ArrayMetadata;
```

这个例子是 [使用泛型](https://www.typescriptlang.org/docs/handbook/generics.html#generic-types) 提供更丰富类型信息的一个很好的例子：

```typescript
export type ArrayMetadata<ArrType> = {
  length: number;
  firstObject: ArrType | undefined;
};
export function getArrayMetadata<ArrType>(
  arr: ArrType[]
): ArrayMetadata<ArrType>;
```

现在数组的类型传播到 `ArrayMetadata` 类型。

导出的类型可以被模块的使用者在 TypeScript 代码或 [JSDoc imports](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types) 中使用 `import` 或 `import type` 重用。

### Namespaces in Module Code - 在模块代码中命名空间

试图描述 JavaScript 代码的运行时关系可能很棘手。当类似 ES module 的语法没有提供足够的工具来描述导出时，你可以使用 `namespace`。

例如，你可能有足够复杂的类型要描述，所以你可以选择在 `.d.ts` 中命名它们：

```typescript
// This represents the JavaScript class which would be available at runtime
export class API {
  constructor(baseURL: string);
  getInfo(opts: API.InfoRequest): API.InfoResponse;
}
// This namespace is merged with the API class and allows for consumers, and this file
// to have types which are nested away in their own sections.
declare namespace API {
  export interface InfoRequest {
    id: string;
  }
  export interface InfoResponse {
    width: number;
    height: number;
  }
}
```

了解名称空间在 `.d.ts` 文件中的工作方式，阅读 [`.d.ts` deep dive](https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html)。

### Optional Global Usage - 可选的全局用法

你可以使用 `export as namespace` 来声明你的模块将在 UMD 上下文中的全局作用域中可用：

```typescript
export as namespace moduleName;
```

## Reference Example - 参考示例

为了让你了解所有这些部分是如何组合在一起的，这里有一个制作新模块时的参考 `.d.ts`：

```typescript
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */
/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */
export as namespace myLib;
/*~ If this module exports functions, declare them like so.
 */
export function myFunction(a: string): string;
export function myOtherFunction(a: number): number;
/*~ You can declare types that are available via importing the module */
export interface SomeType {
  name: string;
  length: number;
  extras?: string[];
}
/*~ You can declare properties of the module using const, let, or var */
export const myField: number;
```

### Library file layout - 库文件布局

声明文件的布局应该反映库的布局。

库可以由多个模块组成，例如

```
myLib
  +---- index.js
  +---- foo.js
  +---- bar
         +---- index.js
         +---- baz.js
```

这些可以导入，例如

```js
var a = require("myLib");
var b = require("myLib/foo");
var c = require("myLib/bar");
var d = require("myLib/bar/baz");
```

你的声明文件应该是这样的

```
@types/myLib
  +---- index.d.ts
  +---- foo.d.ts
  +---- bar
         +---- index.d.ts
         +---- baz.d.ts
```

### Testing your types - 测试你的类型

如果你打算把这些修改提交给 DefinitelyTyped，让每个人都可以使用，那么我们推荐你：

> 1. 在 `node_modules/@types/[libname]` 中创建一个新文件夹
> 2. 在该文件夹中创建一个 `index.d.ts`，并将示例复制到其中
> 3. 查看模块使用中断的地方，并开始填写 `index.d.ts`
> 4. 当你满意的时候，clone [DefinitelyTyped/DefinitelyTyped](https://github.com/DefinitelyTyped) 并按照 README 中的说明操作

否则

> 1. 在源树的根目录中创建一个新文件：`[libname].d.ts`
> 2. 添加 `declare module "[libname]" { }`
> 3. 将模板添加到 `declare module` 的大括号中，然后查看你的使用在哪里中断了
