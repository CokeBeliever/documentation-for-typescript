# Global: Modifying Module

## Global-modifying Modules - 全局修改模块

全局修改模块在导入全局作用域中的现有值时修改它们。例如，可能存在一个向 `String.prototype` 导入时添加新成员的库。由于运行时冲突的可能性，这种模式有点危险，但是我们仍然可以为它编写声明文件。

## Identifying global-modifying modules - 识别全局修改模块

全局修改模块通常很容易从文档中识别。通常，它们类似于全局插件，但是需要一个 `require` 调用来激活它们的效果。

您可能会看到这样的文档：

```js
// 'require' call that doesn't use its return value
var unused = require("magic-string-time");
/* or */
require("magic-string-time");
var x = "hello, world";
// Creates new methods on built-in types
console.log(x.startsWithHello());
var y = [1, 2, 3];
// Creates new methods on built-in types
console.log(y.reverseAndSort());
```

这是一个例子

```typescript
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the global-modifying module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */
/*~ Note: If your global-modifying module is callable or constructable, you'll
 *~ need to combine the patterns here with those in the module-class or module-function
 *~ template files
 */
declare global {
  /*~ Here, declare things that go in the global namespace, or augment
   *~ existing declarations in the global namespace
   */
  interface String {
    fancyFormat(opts: StringFormatOptions): string;
  }
}
/*~ If your module exports types or values, write them as usual */
export interface StringFormatOptions {
  fancinessLevel: number;
}
/*~ For example, declaring a method on the module (in addition to its global side effects) */
export function doSomething(): void;
/*~ If your module exports nothing, you'll need this line. Otherwise, delete it */
export {};
```
