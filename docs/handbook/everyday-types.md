# Everyday Types

在本章中，我们将介绍一些在 JavaScript 代码中最常见的值类型，并解释在 TypeScript 中描述这些类型的相应方法。这并不是一个详尽的列表，以后的章节将描述更多命名和使用其他类型的方法。

类型还可以出现在更多的地方，而不仅仅是类型注释。在了解类型本身的同时，我们还将了解在哪些地方可以引用这些类型来形成新的构造。

我们将首先回顾在编写 JavaScript 或 TypeScript 代码时可能遇到的最基本和最常见的类型。这些稍后将构成更复杂类型的核心构建块。

## The primitives: `string`,`number`, and `boolean`

JavaScript 有三个非常常用的 [原始类型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)：`string`、`number` 和 `boolean`。每个都在 TypeScript 中有对应的类型。如你所料，如果对这些类型的值使用 JavaScript `typeof` 操作符，你将看到这些相同的名称：

- `string` 表示字符串值，比如 `"Hello, world"`
- `number` 是指像 `42` 这样的数字。JavaScript 对整数没有一个特有的运行时值，因此没有与 `int` 或 `float` 等价的值 - 所有的东西都是简单的 `number`
- `boolean` 用于 `true` 和 `false` 两个值

> 类型名称 String、Number 和 Boolean (以大写字母开头) 是合法的，但它们指的是一些在代码中很少出现的特殊内置类型。总是使用 `string`、`number` 或 `boolean` 作为类型。

## Arrays - 数组

要指定像 `[1,2,3]` 这样的数组类型，你可以使用语法 `number[]`；这种语法适用于任何类型 (例如 `string[]` 是一个字符串数组，等等)。你也可以看到它被写成 `Array<number>`，意思是一样的。在介绍泛型时，我们将更多地了解语法 `T<U>`。

> 注意 [number] 是一个不同的东西；请参阅 [Tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) 一节。

## `any`

TypeScript 还有一个特殊的类型 `any`，当你不希望某个特定值引起类型检查错误时，你可以使用它。

当一个值的类型为 `any` 时，你可以访问它的任何属性 (它又将是 `any` 类型)、像函数一样调用它、将它赋值给 (或来自) 任何类型的值、或者几乎任何在语法上合法的东西：

```typescript
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

当你不想为了让 TypeScript 相信某一行代码是正确的而编写一个很长的类型时，`any` 类型是很有用的。

### `noImplicitAny`

当你没有指定类型，并且 TypeScript 不能从上下文推断它时，编译器通常会默认为 `any`。

但是，你通常希望避免这种情况，因为 `any` 没有进行类型检查。使用编译器标志 [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) 将任何隐式的 `any` 标记为错误。

## Type Annotations on Variables - 变量的类型注释

当使用 `const`、`var` 或 `let` 声明变量时，可以选择添加类型注释来显式指定变量的类型：

```typescript
let myName: string = "Alice";
```

> TypeScript 不使用 "types on the left" 风格的声明，比如 `int x = 0;` 类型注释总是在被输入的事物后面。

但是，在大多数情况下，这是不需要的。只要有可能，TypeScript 会尝试自动推断代码中的类型。例如，根据变量初始化式的类型推断变量的类型。

```typescript
// No type annotation needed -- 'myName' inferred as type 'string'
let myName = "Alice";
```

在大多数情况下，你不需要明确地学习推理规则。如果你刚刚开始，请尝试使用比你想象的更少的类型注释 - 你可能会惊讶地发现，TypeScript 只需要很少的代码就能完全理解发生了什么。

## Functions - 函数

函数是 JavaScript 中传递数据的主要方法。TypeScript 允许你指定函数的输入和输出值的类型。

### Parameter Type Annotations - 形参类型注释

声明函数时，你可以在每个形参之后添加类型注释，以声明函数接受什么类型的形参。形参类型注释紧跟在形参名称之后：

```typescript
// Parameter type annotation
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

当形参具有类型注释时，将会检查该函数的实参：

```typescript
// Would be a runtime error if executed!
greet(42);
// 类型“number”的参数不能赋给类型“string”的参数。
```

> 即使你的形参上没有类型注释，TypeScript 仍然会检查你传递的实参数量是否正确。

### Return Type Annotations - 返回类型注释

你还可以添加返回类型注释。返回类型注释出现在形参列表之后：

```typescript
function getFavoriteNumber(): number {
  return 26;
}
```

就像变量类型注释一样，你通常不需要返回类型注释，因为 TypeScript 会根据函数的 `return` 语句推断函数的返回类型。上面例子中的类型注释没有改变任何东西。一些代码库将显式地指定一个返回类型以供文档使用，为了防止意外的变化，或者只是个人的偏好。

### Anonymous Functions - 匿名函数

匿名函数与函数声明有一点不同。当一个函数出现在 TypeScript 可以决定它将如何被调用的地方时，该函数的形参自动地指定类型。

这里有一个例子：

```typescript
// No type annotations here, but TypeScript can spot the bug
const names = ["Alice", "Bob", "Eve"];

// Contextual typing for function
names.forEach(function (s) {
  console.log(s.toUppercase());
  // 属性“toUppercase”在类型“string”上不存在。你是否指的是“toUpperCase”?
});

// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUppercase());
  // 属性“toUppercase”在类型“string”上不存在。你是否指的是“toUpperCase”?
});
```

尽管参数 `s` 没有类型注释，但 TypeScript 还是使用了 `forEach` 函数的类型，同时推断出的数组类型，来确定 `s` 将具有的类型。

这个过程称为上下文类型，因为函数所处的上下文决定了它应该具有的类型。

类似的推理规则，你不需要明确地了解这是如何发生的，但是了解它确实会发生可以帮助你注意到什么时候不需要类型注释。稍后，我们将看到更多关于值所在的上下文如何影响其类型的示例。

## Object Types - 对象类型

除了基本之外，你将遇到的最常见类型是对象类型。这指的是任何带有属性的 JavaScript 值，这几乎是它们的所有属性！要定义对象类型，只需列出其属性及其类型。

```typescript
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

这里，我们用具有两个属性 (`x` 和 `y`) 的类型注释了形参，这两个属性的类型都是 `number`。你可以用 `,` 或者 `;` 分隔属性，最后一个分隔符是可选的。

每个属性的类型部分也是可选的。如果你不指定类型，它将假定为 `any`。

### Optional Properties - 可选属性

对象类型还可以指定它们的部分或全部属性是可选的。要做到这一点，添加一个 `?` 在属性名后面：

```typescript
function printName(obj: { first: string; last?: string }) {
  // ...
}
// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

在 JavaScript 中，如果你访问一个不存在的属性，你将得到 `undefined` 的值而不是运行时错误。因此，当你从可选属性读取时，必须在使用它之前检查 `undefined`。

```typescript
function printName(obj: { first: string; last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase());
  // 对象可能为“undefined”。
  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // A safe alternative using modern JavaScript syntax:
  console.log(obj.last?.toUpperCase());
}
```

## Union Types - 联合类型

TypeScript 类型系统允许你使用各种各样的操作符在现有类型的基础上构建新类型。现在我们知道了如何编写一些类型，是时候开始以有趣的方式组合它们了。

### Defining a Union Type - 定义联合类型

你可能看到的组合类型的第一种方法是联合类型，联合类型是由两个或多个其他类型组成的类型，表示可以是这些类型中的任何一个的值。我们将这些类型中的每一种称为联合的成员。

让我们写一个可以操作字符串或数字的函数：

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
// 类型“{ myID: number; }”的参数不能赋给类型“string | number”的参数。
```

### Working with Union Types - 使用联合类型

提供与联合类型匹配的值很容易 - 只需提供与任一的联合的成员匹配的类型。如果你有一个联合类型的值，你如何使用它呢？

TypeScript 只允许对联合的每个成员都有效的操作。例如，如果你有联合 `string | number`，你不能在仅 `string` 可用的方法使用：

```typescript
function printId(id: number | string) {
  console.log(id.toUpperCase());
  // 类型“string | number”上不存在属性“toUpperCase”。
  //  类型“number”上不存在属性“toUpperCase”。
}
```

解决方案是用代码缩小联合，就像在没有类型注释的 JavaScript 中一样。当 TypeScript 可以根据代码的结构推断出一个值更具体的类型时，就会发生窄化。

例如，TypeScript 知道只有 `string` 值才会有 `typeof` 值 `"string"`：

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
```

另一个例子是使用像 `Array.isArray` 这样的函数：

```typescript
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Here: 'x' is 'string'
    console.log("Welcome lone traveler " + x);
  }
}
```

注意，在 `else` 分支中，我们不需要做任何特殊的操作 - 如果 `x` 不是一个 `string[]`，那么它一定是一个 `string`。

有时你会有一个联合，其所有成员都有共同之处。例如，数组和字符串都有一个 `slice` 方法。如果在一个联合中的每个成员都有一个共同的属性，那么你就可以使用该属性而不借助窄化。

```typescript
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

> 类型的 union 似乎具有这些类型属性的交集，这可能令人困惑。这不是一个意外 - 名称 union 来自类型理论。union `number | string` 是否由每个类型的值的并集组成。注意，给定两个集合，每个集合都有相应的事实，只有这些事实的交集适用于集合本身的并集。例如，如果我们有一屋子戴着帽子的高个子，另一屋子戴着帽子的西班牙语使用者，在把这两个房间组合起来之后，我们对每个人的唯一了解就是他们一定戴着帽子。

## Type Aliases - 类型别名

我们一直通过在类型注释中直接编写对象类型和联合类型来使用它们。虽然这很方便，但通常是需要多次使用相同的类型，并通过单一名称引用它。

type alias 就是任何类型的名称。类型别名的语法是：

```typescript
type Point = {
  x: number;
  y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

实际上，你可以使用类型别名为任何类型指定名称，而不仅仅是对象类型。例如，类型别名可以命名联合类型：

```typescript
type ID = number | string;
```

注意，别名只是别名 - 你不能使用类型别名来创建不同的/有区别的同一类型的 "版本"。当你使用别名时，它就像你写了别名类型一样。换句话说，这段代码看起来可能是非法的，但根据 TypeScript 是可以的，因为这两种类型都是同一类型的别名：

```typescript
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Create a sanitized input
let userInput = sanitizeInput(getInput());

// Can still be re-assigned with a string though
userInput = "new input";
```

## Interfaces - 接口

接口声明是命名对象类型的另一种方法：

```typescript
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

就像我们上面使用类型别名时一样，这个示例就像我们使用了匿名对象类型一样。TypeScript 只关心传递给 `printCoord` 的值的结构 - 它只关心它是否具有预期的属性。只关心类型的结构和功能，这就是我们称 TypeScript 为结构化类型的类型系统的原因。

### Differences Between Type Aliases and Interfaces - 类型别名和接口的区别

类型别名和接口非常相似，在许多情况下可以在它们之间自由选择。`interface` 几乎所有特性都可以在 `type` 中获得，关键的区别是 `type` 不能重新打开以添加新属性，而 `interface` 总是可扩展的。

**Interface**

扩展接口：

```typescript
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
```

向现有接口添加新字段：

```typescript
interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

**Type**

通过交集扩展类型：

```typescript
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: boolean;
};

const bear = getBear();
bear.name;
bear.honey;
```

类型创建后不能更改：

```typescript
type Window = {
  title: string;
};

type Window = {
  ts: TypeScriptAPI;
};

// Error: Duplicate identifier 'Window'.
```

你将在后面的章节中了解更多关于这些概念的内容，因此，如果你不能立即理解所有这些内容，也不必担心。

- 在 TypeScript 4.2 版本之前，类型别名 [可能会出现在错误消息中](https://www.typescriptlang.org/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWZWhfYAjABMAMwALA+gbsVjoADqgjKESytQPxCHghAByXigYgBfr8LAsYj8aQMUASbDQcRSExCeCwFiIQh+AKfAYyBiQFgOPyIaikSGLQo0Zj-aazaY+dSaXjLDgAGXgAC9CKhDqAALxJaw2Ib2RzOISuDycLw+ImBYKQflCkWRRD2LXCw6JCxS1JCdJZHJ5RAFIbFJU8ADKC3WzEcnVZaGYE1ABpFnFOmsFhsil2uoHuzwArO9SmAAEIsSFrZB-GgAjjA5gtVN8VCEc1o1C4Q4AGlR2AwO1EsBQoAAbvB-gJ4HhPgB5aDwem-Ph1TCV3AEEirTp4ELtRbTPD4vwKjOfAuioSQHuDXBcnmgACC+eCONFEs73YAPGGZVT5cRyyhiHh7AAON7lsG3vBggB8XGV3l8-nVISOgghxoLq9i7io-AHsayRWGaFrlFauq2rg9qaIGQHwCBqChtKdgRo8TxRjeyB3o+7xAA)，有时会代替等效的匿名类型 (这可能是需要的，也可能是不需要的)。接口将总是出现错误消息中。
- 类型别名不能参与 [声明合并，但接口可以](https://www.typescriptlang.org/play?#code/PTAEEEDtQS0gXApgJwGYEMDGjSfdAIx2UQFoB7AB0UkQBMAoEUfO0Wgd1ADd0AbAK6IAzizp16ALgYM4SNFhwBZdAFtV-UAG8GoPaADmNAcMmhh8ZHAMMAvjLkoM2UCvWad+0ARL0A-GYWVpA29gyY5JAWLJAwGnxmbvGgALzauvpGkCZmAEQAjABMAMwALLkANBl6zABi6DB8okR4Jjg+iPSgABboovDk3jjo5pbW1d6+dGb5djLwAJ7UoABKiJTwjThpnpnGpqPBoTLMAJrkArj4kOTwYmycPOhW6AR8IrDQ8N04wmo4HHQCwYi2Waw2W1S6S8HX8gTGITsQA)。
- 接口只能用于 [声明对象的形状，而不能重命名原始类型](https://www.typescriptlang.org/play?#code/PTAEAkFMCdIcgM6gC4HcD2pIA8CGBbABwBtIl0AzUAKBFAFcEBLAOwHMUBPQs0XFgCahWyGBVwBjMrTDJMAshOhMARpD4tQ6FQCtIE5DWoixk9QEEWAeV37kARlABvaqDegAbrmL1IALlAEZGV2agBfampkbgtrWwMAJlAAXmdXdy8ff0Dg1jZwyLoAVWZ2Lh5QVHUJflAlSFxROsY5fFAWAmk6CnRoLGwmILzQQmV8JmQmDzI-SOiKgGV+CaYAL0gBBdyy1KCQ-Pn1AFFplgA5enw1PtSWS+vCsAAVAAtB4QQWOEMKBuYVUiVCYvYQsUTQcRSBDGMGmKSgAAa-VEgiQe2GLgKQA)。
- 接口名称 [总是以其原始形式出现](https://www.typescriptlang.org/play?#code/PTAEGEHsFsAcEsA2BTATqNrLusgzngIYDm+oA7koqIYuYQJ56gCueyoAUCKAC4AWHAHaFcoSADMaQ0PCG80EwgGNkALk6c5C1EtWgAsqOi1QAb06groEbjWg8vVHOKcAvpokshy3vEgyyMr8kEbQJogAFND2YREAlOaW1soBeJAoAHSIkMTRmbbI8e6aPMiZxJmgACqCGKhY6ABGyDnkFFQ0dIzMbBwCwqIccabcYLyQoKjIEmh8kwN8DLAc5PzwwbLMyAAeK77IACYaQSEjUWY2Q-YAjABMAMwALA+gbsVjNXW8yxySoAADaAA0CCaZbPh1XYqXgOIY0ZgmcK0AA0nyaLFhhGY8F4AHJmEJILCWsgZId4NNfIgGFdcIcUTVfgBlZTOWC8T7kAJ42G4eT+GS42QyRaYbCgXAEEguTzeXyCjDBSAAQSE8Ai0Xsl0K9kcziExDeiQs1lAqSE6SyOTy0AKQ2KHk4p1V6s1OuuoHuzwArMagA) 在错误消息中，但只有在按名称使用时才会出现。

在大多数情况下，你可以根据个人偏好进行选择，TypeScript 会告诉你它是否需要其他类型的声明。如果你想要一个启发式方法，使用 `interface`，直到你需要使用来自 `type` 的特性。

## Type Assertions - 类型断言

有时候，你会得到 TypeScript 无法知道的值类型的信息。

例如，如果你正在使用 `document.getElementById`，TypeScript 只知道这会返回某种类型的 `HTMLElement`，但你可能知道你的页面总是有一个带有给定 ID 的 `HTMLCanvasElement`。

在这种情况下，可以使用类型断言指定更具体的类型：

```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

与类型注释一样，类型断言由编译器删除，不会影响代码的运行时行为。

你还可以使用尖括号语法 (除非代码位于 `.tsx` 文件中)，这是等价的：

```typescript
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> 提醒：因为类型断言在编译时会被删除，所以没有与类型断言相关的运行时检查。如果类型断言错误，不会产生异常或 `null`。

TypeScript 允许将类型转换为更明确的或更不明确的类型版本的类型断言。这条规则防止了 "不可能的" 胁迫，例如：

```typescript
const x = "hello" as number;
// 类型 "string" 到类型 "number" 的转换可能是错误的，因为两种类型不能充分重叠。如果这是有意的，请先将表达式转换为 "unknown"。
```

有时这条规则可能过于保守，将不允许可能有效的更复杂的胁迫。如果出现这种情况，你可以使用两个断言，第一个断言是 `any` (或 `unknown`，我们将在后面介绍)，然后是所需的类型：

```typescript
const a = expr as any as T;
```

## Literal Types - 字面量类型

除了一般的 `string` 和 `number` 类型之外，我们还可以在类型位置引用特定的字符串和数字。

考虑这个问题的一种方法是考虑 JavaScript 如何提供不同的方法来声明变量。`var` 和 `let` 都允许改变变量内部的内容，而 `const` 不允许。这反映在 TypeScript 为字面量创建类型的方式上。

```typescript
let changingString = "Hello World";
changingString = "Olá Mundo";
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString; // let changingString: string

const constantString = "Hello World";
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString; // const constantString: "Hello World"
```

字面量类型本身不是很有价值的：

```typescript
let x: "hello" = "hello";
// OK
x = "hello";
// ...
x = "howdy"; // 不能将类型“"howdy"”分配给类型“"hello"”。
```

只有一个值的变量没有多大用处！

但是通过将字面量组合到联合中，你可以表达一个更有用的概念 - 例如，只接受某一组已知值的函数：

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre"); // 类型“"centre"”的参数不能赋给类型“"left" | "right" | "center"”的参数。
```

数值字面量类型的工作方式相同：

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

当然，你可以将这些类型与非字面量类型结合使用：

```typescript
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic"); // 类型“"automatic"”的参数不能赋给类型“Options | "auto"”的参数。
```

还有一种字面量类型：`boolean` 字面量。只有两种布尔字面量类型，正如你所猜测的，它们是 `true` 和 `false` 类型。类型 `boolean` 本身实际上只是联合 `true | false` 的别名。

### Literal Inference - 字面量推断

当你用对象初始化变量时，TypeScript 假定该对象的属性稍后可能会改变值。例如，如果你写这样的代码：

```typescript
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript 不会认为之前为 `0` 的字段赋值为 `1` 是错误的。另一种说法是 `obj.counter` 必须具有类型 `number`，而不是 `0`，因为类型用于确定读和写行为。

这同样适用于字符串：

```typescript
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method); // 类型 "string" 的参数不能赋给类型 “"GET" | "POST"” 的参数。
```

在上面的例子中，`req.method` 被推断为 `string`，不是 `“GET”`。因为代码可以在创建 `req` 和调用 `handleRequest` 之间求值，`handleRequest` 可以为 `req.method` 分配一个像 `"GUESS"` 这样的新字符串。TypeScript 认为这段代码有错误。

有两种方法可以解决这个问题。

1. 你可以通过在任意位置添加类型断言来更改推断：

   ```typescript
   // Change 1
   const req = { url: "https://example.com", method: "GET" as "GET" };
   // Change 2
   handleRequest(req.url, req.method as "GET");
   ```

   change 1 意味着 "我打算 `req.method` 始终具有字面量类型 `"GET"`"，防止可能的 `“GUESS”` 分配到该字段之后。

   change 2 意味着 "我知道有还有其他原因 `req.method` 的值为 `“GET”`"。

2. 可以使用 `as const` 将整个对象转换为类型字面量：

   ```typescript
   const req = { url: "https://example.com", method: "GET" } as const;
   handleRequest(req.url, req.method);
   ```

   `as const` 后缀的作用类似于 `const`，但对于类型系统，确保了所有属性都被分配为字面量类型，而不是更通用的版本，如 `string` 或 `number`。

## `null` and `undefined`

JavaScript 有两个原始类型值用来表示缺少或未初始化的值：`null` 和 `undefined`。

TypeScript 有两个名称相同的对应类型，这些类型的行为方式取决于是否打开了 [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) 选项。

### `strictNullChecks` off

在 strictNullChecks 关闭的情况下，可能为 `null` 或 `undefined` 的值仍然可以正常访问，`null` 和 `undefined` 的值可以分配给任何类型的属性。这类似于没有空检查的语言 (如 C#、Java) 的行为。缺乏对这些值的检查往往是 bug 的主要来源；我们总是建议人们打开 strictNullChecks，如果在他们的代码库中这样做是可行的。

### `strictNullChecks` on

在 strictNullChecks 打开的情况下，当值为 `null` 或 `undefined` 时，你需要在对该值使用方法或属性之前测试这些值。就像在使用可选属性之前检查 `undefined` 一样，我们可以使用窄化来检查可能为 `null` 的值：

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### Non-null Assertion Operator (Postfix `!`) - 非空断言操作符 (后缀 `!`)

TypeScript 还有一个特殊的语法，用于从类型中删除 `null` 和 `undefined`，而不需要进行任何显式检查。编写 `!` 在任何表达式后面实际上都是一个类型断言，该值不是 `null` 或 `undefined`。

```typescript
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

与其他类型断言一样，这不会改变代码的运行时行为，当你知道值不为 `null` 或 `undefined` 时，这样仅使用 `!` 很重要。

## Enums - 枚举

枚举是 TypeScript 添加到 JavaScript 中的一个特性，它允许描述一个值，这个值可以是一组可能的命名常量中的一个。与大多数 TypeScript 特性不同的是，这不是添加到 JavaScript 的类型级别，而是添加到语言和运行时中。正因为如此，它是一个你应该知道存在的特性，但除非你确定，否则先不要用。你可以在 [Enum 参考页面](https://www.typescriptlang.org/docs/handbook/enums.html) 中阅读更多关于枚举的信息。

## Less Common Primitives - 不常见的原始类型

值得一提的是 JavaScript 中其他在类型系统中表示的原始类型。虽然我们不会在这里深入讨论。

**bigint**

从 ES2020 开始，JavaScript 中有一个用于非常大的整数的原始类型，`BigInt`：

```typescript
// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);

// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

你可以在 [TypeScript 3.2 发布说明](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html#bigint) 中了解更多关于 BigInt 的信息。

**symbol**

JavaScript 中有一个原始类型，用于通过 `Symbol()` 函数创建全局唯一引用。

```typescript
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // 此条件将始终返回 "false"，因为类型 "typeof firstName" 和 "typeof secondName" 没有重叠。
  // Can't ever happen
}
```

你可以在 [Symbols 参考页面](https://www.typescriptlang.org/docs/handbook/symbols.html) 中了解更多关于它们的信息。
