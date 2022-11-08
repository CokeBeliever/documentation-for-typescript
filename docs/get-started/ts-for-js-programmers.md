# TypeScript for JavaScript Programmers

TypeScript 与 JavaScript 的关系不同寻常。TypeScript 提供了 JavaScript 的所有特性，并且在这些特性之上还有一个额外的层：TypeScript 的类型系统。

例如，JavaScript 提供了像 `string` 和 `number` 这样的语言原始类型，但它不会检查你是否一致地分配了这些原始类型。TypeScript 会检查。

这意味着你现有的工作 JavaScript 代码也可以是 TypeScript 代码。TypeScript 的主要好处是它可以突出显示代码中的意外行为，降低出现 bug 的几率。

本教程将简要概述 TypeScript，重点介绍它的类型系统。

## Types by inference - 类型推断

TypeScript 了解 JavaScript 语言，在很多情况下会为你生成类型。例如，在创建一个变量并将其赋值时，TypeScript 将使用该值作为其类型。

```typescript
let helloWorld = "Hello World"; // let helloWorld: string
```

通过理解 JavaScript 的工作原理，TypeScript 可以构建一个接受 JavaScript 代码但拥有类型的类型系统。这提供了一个类型系统，而不需要添加额外的字符来在代码中显式地显示类型。这就是 TypeScript 在上面例子中知道 `helloWorld` 是一个 `string` 的原因。

你可能已经用 Visual Studio Code 写过 JavaScript，并且有编辑器自动完成功能。Visual Studio Code 在底层使用 TypeScript，以便更容易地使用 JavaScript。

## Defining Types - 定义类型

你可以在 JavaScript 中使用各种各样的设计模式。然而，有些设计模式使自动推断类型变得困难（例如，使用动态编程的模式）。为了涵盖这些情况，TypeScript 支持 JavaScript 语言的扩展，它为你提供了告诉 TypeScript 应该是什么类型的地方。

例如，要创建一个包含 `name: string` 和 `id: number` 的推断类型的对象，你可以写：

```typescript
const user = {
  name: "Hayes",
  id: 0,
};
```

可以使用 `interface` 声明显式地描述此对象的形状：

```typescript
interface User {
  name: string;
  id: number;
}
```

然后，通过在变量声明后使用 `: TypeName` 这样的语法，可以声明一个 JavaScript 对象符合新 `interface` 的形状：

```typescript
const user: User = {
  name: "Hayes",
  id: 0,
};
```

如果你提供的对象与你提供的接口不匹配，TypeScript 会警告你：

```typescript
interface User {
  name: string;
  id: number;
}

const user: User = {
  username: "Hayes",
  // 不能将类型 “{ username: string; id: number; }” 分配给类型 “User”。
  //  对象文字可以只指定已知属性，并且 “username” 不在类型 “User” 中。
  id: 0,
};
```

既然 JavaScript 支持类和面向对象编程，所以 TypeScript 也支持。可以对类使用接口声明：

```typescript
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
```

可以对函数使用接口去注释形参和返回值：

```typescript
function getAdminUser(): User {
  //...
}

function deleteUser(user: User) {
  // ...
}
```

JavaScript 中已经有了一个可用的基本类型小集：`boolean`、`bigint`、`null`、`number`、`string`、`symbol` 和 `undefined`，你可以在接口中使用它们。TypeScript 扩展了这个列表，比如 `any` （允许任何)、[`unknown`](https://www.typescriptlang.org/play#example/unknown-and-never)（确保某人使用这个类型声明了 "该类型是什么"），[`never`](https://www.typescriptlang.org/play#example/unknown-and-never)（这种事情不可能发生），以及 `void`（返回 `undefined` 或没有返回值的函数）。

你将看到构建类型有两种语法：[Interfaces and Types](https://www.typescriptlang.org/play/?e=83#example/types-vs-interfaces)。你应该更喜欢 `interface`。当你需要特定的特性时使用 `type`。

## Composing Types - 组合类型

在 TypeScript 中，你可以通过组合简单类型来创建复杂类型。有两种流行的方法：unions 和 generics。

### Unions - 联合

使用联合，你可以声明一个类型可以是许多类型中的一种。例如，你可以将 `boolean` 类型描述为 `true` 或 `false`。

```typescript
type MyBool = true | false;
```

注意：如果你将鼠标悬停在上面的 `MyBool` 上，你将看到它被分类为 `boolean`。这是结构类型系统的一个特性。下面是更多相关内容。

联合类型的一个流行用例是描述一个值所允许的 `string` 或 `number` [字面量](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) 的集合：

```typescript
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type PositiveOddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

联合也提供了一种处理不同类型的方法。例如，你可能有一个接受 `array` 或 `string` 的函数：

```typescript
function getLength(obj: string | string[]) {
  return obj.length;
}
```

学习变量的类型，使用 `typeof`：

| Type      | Predicate                          |
| :-------- | :--------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

例如，可以根据传递给函数的是字符串还是数组，让函数返回不同的值：

```typescript
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
  }
  return obj;
}
```

### Generics - 泛型

泛型为类型提供变量。

一个常见的例子是数组。没有泛型的数组可以包含任何事物。具有泛型的数组可以描述数组包含的值。

```typescript
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

你可以使用泛型声明你自己的类型：

```typescript
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from.
declare const backpack: Backpack<string>;

// object is a string, because we declared it above as the variable part of Backpack.
const object = backpack.get();

// Since the backpack variable is a string, you can't pass a number to the add function.
backpack.add(23);
// 类型 “number” 的参数不能赋给类型 “string” 的参数。
```

## Structural Type System - 结构类型系统

TypeScript 的核心原则之一是类型检查关注值的形状。这有时被称为 "鸭子类型" 或 "结构类型"。

在结构类型系统中，如果两个对象具有相同的形状，则认为它们具有相同的类型。

```typescript
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// logs "12, 26"
const point = { x: 12, y: 26 };
logPoint(point);
```

`point` 变量从未被声明为 `Point` 类型。然而，TypeScript 会在类型检查中将 `point` 的形状与 `Point` 的形状进行比较。它们有相同的形状，所以代码通过了。

形状匹配只需要对象字段的子集进行匹配。

```typescript
const point3 = { x: 12, y: 26, z: 89 };
logPoint(point3); // logs "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
logPoint(rect); // logs "33, 3"

const color = { hex: "#187ABF" };
logPoint(color);
// 类型 “{ hex: string; }” 的参数不能赋给类型 “Point” 的参数。
//  类型 “{ hex: string; }” 缺少类型 “Point” 中的以下属性: x, y
```

类和对象遵循形状的方式没有差异：

```typescript
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
logPoint(newVPoint); // logs "13, 56"
```

如果对象或类具有所有必需的属性，不管实现细节如何，TypeScript 都会认为它们是匹配的。

## Next Steps - 下一步

这是对 TypeScript 日常使用的语法和工具的简要概述。从这里，你可以：

- 阅读完整的手册 [从头到尾](https://www.typescriptlang.org/docs/handbook/intro.html) (30m)
- 探索 [Playground examples](https://www.typescriptlang.org/play#show-examples)
