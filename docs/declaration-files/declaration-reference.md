# Declaration Reference

本指南的目的是教你如何编写高质量的声明文件。本指南通过展示一些 API 的文档以及该 API 的示例用法，并解释如何编写相应的声明来构建。

这些例子是按照复杂度近似递增的顺序安排好的。

## Objects with Properties - 具有属性的对象

_文档_

> 全局变量 `myLib` 有一个函数 `makeGreeting` 用于创建问候语，还有一个属性 `numberOfGreetings` 表示到目前为止发出的问候语的数量。

_代码_

```typescript
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);
let count = myLib.numberOfGreetings;
```

_声明_

使用 `declare namespace` 来描述通过点号符号访问的类型或值。

```typescript
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```

## Overloaded Functions - 重载函数

_文档_

> `getWidget` 函数接受一个 `number` 并返回一个 `Widget`，或者接受一个 `string` 并返回一个 `Widget` 数组。

_代码_

```typescript
let x: Widget = getWidget(43);
let arr: Widget[] = getWidget("all of them");
```

_声明_

```typescript
declare function getWidget(n: number): Widget;
declare function getWidget(s: string): Widget[];
```

## Reusable Types (Interfaces) - 可重用类型 (接口)

_文档_

> 指定问候语时，必须传递一个 `GreetingSettings` 对象。该对象具有以下属性：
>
> 1 - greeting: 强制性的字符串
>
> 2 - duration: 可选时间长度 (以毫秒为单位)
>
> 3 - color: 可选的字符串，例如 ‘#ff00ff’

_代码_

```typescript
greet({
  greeting: "hello world",
  duration: 4000,
});
```

_声明_

使用 `interface` 定义具有属性的类型。

```typescript
interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}
declare function greet(setting: GreetingSettings): void;
```

## Reusable Types (Type Aliases) - 可重用类型 (类型别名)

_文档_

> 在任何需要问候语的地方，都可以提供一个 `string`、一个返回 `string` 的函数或 `Greeter` 实例。

_代码_

```typescript
function getGreeting() {
  return "howdy";
}
class MyGreeter extends Greeter {}
greet("hello");
greet(getGreeting);
greet(new MyGreeter());
```

_声明_

可以使用类型别名对类型进行简写：

```typescript
type GreetingLike = string | (() => string) | MyGreeter;
declare function greet(g: GreetingLike): void;
```

## Organizing Types - 组织类型

_文档_

> `greeter` 对象可以记录到文件或显示警报。你可以为 `.log(...)` 提供 `LogOptions`，为 `.alert(...)` 提供 `AlertOptions`。

_代码_

```typescript
const g = new Greeter("Hello");
g.log({ verbose: true });
g.alert({ modal: false, title: "Current Greeting" });
```

_声明_

使用命名空间去组织类型。

```typescript
declare namespace GreetingLib {
  interface LogOptions {
    verbose?: boolean;
  }
  interface AlertOptions {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

你还可以在一个声明中创建嵌套的命名空间。

```typescript
declare namespace GreetingLib.Options {
  // Refer to via GreetingLib.Options.Log
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
    color?: string;
  }
}
```

## Classes - 类

_文档_

> 你可以通过实例化 `Gretter` 来创建一个 `gretter` 对象，或者通过扩展它来创建一个自定义的 `greeter`。

_代码_

```typescript
const myGreeter = new Greeter("hello, world");
myGreeter.greeting = "howdy";
myGreeter.showGreeting();
class SpecialGreeter extends Greeter {
  constructor() {
    super("Very special greetings");
  }
}
```

_声明_

使用 `declare class` 来描述类或类似于类对象。类可以具有属性和方法以及构造函数。

```typescript
declare class Greeter {
  constructor(greeting: string);
  greeting: string;
  showGreeting(): void;
}
```

## Global Variables - 全局变量

_文档_

> 全局变量 `foo` 包含当前 widget 的数量。

_代码_

```typescript
console.log("Half the number of widgets is " + foo / 2);
```

_声明_

使用 `declare var` 来声明变量。如果变量是只读的，可以使用 `declare const`。如果变量是块作用域的，也可以使用 `declare let`。

```typescript
/** The number of widgets present */
declare var foo: number;
```

## Global Functions - 全局函数

_文档_

> 你可以使用 `string` 调用 `greet` 函数来向用户显示问候语。

_代码_

```typescript
greet("hello, world");
```

_声明_

使用 `declare function` 来声明函数。

```typescript
declare function greet(greeting: string): void;
```
