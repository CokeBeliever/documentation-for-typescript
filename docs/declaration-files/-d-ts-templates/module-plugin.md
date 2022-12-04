# Module: Plugin

例如，当你想要使用扩展另一个库的 JavaScript 代码时。

```typescript
import { greeter } from "super-greeter";
// Normal Greeter API
greeter(2);
greeter("Hello world");
// Now we extend the object with a new function at runtime
import "hyper-super-greeter";
greeter.hyperGreet();
```

"super-greeter" 的定义：

```typescript
/*~ This example shows how to have multiple overloads for your function */
export interface GreeterFunction {
  (name: string): void;
  (time: number): void;
}
/*~ This example shows how to export a function specified by an interface */
export const greeter: GreeterFunction;
```

我们可以像下面这样扩展现有的模块：

```typescript
// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>
/*~ This is the module plugin template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */
/*~ On this line, import the module which this module adds to */
import { greeter } from "super-greeter";
/*~ Here, declare the same module as the one you imported above
 *~ then we expand the existing declaration of the greeter function
 */
export module "super-greeter" {
  export interface GreeterFunction {
    /** Greets even better! */
    hyperGreet(): void;
  }
}
```

这使用了 [声明合并](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)。

## The Impact of ES6 on Module Plugins - ES6 对模块插件的影响

有些插件在现有模块上添加或修改顶级导出。虽然这在 CommonJS 和其他加载器中是合法的，但 ES6 模块被认为是不可变的，因此这种模式是不可能的。因为 TypeScript 是加载器-不可知论者，所以这个策略在编译时没有强制执行，但是打算转换到 ES6 模块加载器的开发人员应该意识到这一点。
