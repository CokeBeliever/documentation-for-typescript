# More on Functions

函数是任何应用程序的基本构建块，无论它们是本地函数、还是从另一个模块导入的、或者是类上的方法。它们也是值，就像其他值一样，TypeScript 有很多方法来描述如何调用函数。让我们学习如何编写描述函数的类型。

## Function Type Expressions - 函数类型表达式

描述函数的最简单方法是使用函数类型表达式。这些类型在语法上类似于箭头函数：

```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

语法 `(a: string) => void` 意味着 "带有一个形参的函数，形参命名为 `a`，类型为 `string`，函数没有返回值"。就像是函数声明一样，如果没有指定形参类型，则隐式为 `any`。

> 注意，参数名称是必需的。函数类型 `(string) => void` 意味着 "带有一个形参的函数，形参命名为 `string`，类型为 `any`"！

当然，我们可以使用类型别名来命名函数类型：

```typescript
type GreetFunction = (a: string) => void;
function greeter(fn: GreetFunction) {
  // ...
}
```

## Call Signatures - 调用签名

在 JavaScript 中，函数除了可调用外还可以具有属性。然而，函数类型表达式语法不允许声明属性。如果我们想用属性描述一些可调用的东西，我们可以用对象类型编写调用签名：

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

注意，与函数类型表达式相比，语法略有不同 - 在参数列表和返回类型之间使用 `:` 而不是 `=>`。

## Construct Signatures - 构造签名

JavaScript 函数也可以用 `new` 操作符调用。TypeScript 将它们称为构造函数，因为它们通常会创建一个新对象。你可以编写一个构造签名，通过在调用签名前添加 `new` 关键字：

```typescript
type SomeConstructor = {
  new (s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

有些对象，比如 JavaScript 的 `Date` 对象，可以使用或不使用 `new` 来调用。你可以任意组合相同类型的调用签名和构造签名：

```typescript
interface CallOrConstruct {
  new (s: string): Date;
  (n?: number): number;
}
```

## Generic Functions - 泛型函数

通常会编写一个函数，其中输入的类型与输出的类型相关，或者说两个输入的类型以某种方式相关。让我们探讨一下返回数组第一个元素的函数：

```typescript
function firstElement(arr: any[]) {
  return arr[0];
}
```

这个函数完成了它的工作，但不幸的是返回类型为 `any`。如果函数返回数组元素的类型就更好了。

在 TypeScript 中，当我们想要描述两个值之间的对应关系时，会使用泛型。我们通过在函数签名中声明类型形参来做到这一点：

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

通过向该函数添加类型参数 `Type` 并在两个地方使用它，我们已经在函数的输入 (数组) 和输出 (返回值) 之间创建了一个链接。当我们调用它时，一个更具体的类型就会出现：

```typescript
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```

### Inference - 推断

注意，我们不必在这个示例中指定 `Type`。类型由 TypeScript 推断 - 自动选择。

我们也可以使用多个类型形参。例如，一个独立版本的 `map` 应该是这样的：

```typescript
function map<Input, Output>(
  arr: Input[],
  func: (arg: Input) => Output
): Output[] {
  return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

注意，在这个例子中，TypeScript 可以推断 `Input` 类型形参的类型 (从给定的 `string` 数组)，以及基于函数表达式 (`number`) 的返回值的 `Output` 类型形参。

### Constraints - 约束

我们已经编写了一些泛型函数，它们可以作用于任何类型的值。有时我们想要关联两个值，但只能操作值的某个子集。在这种情况下，我们可以使用约束来限制类型形参可以接受的各种类型。

让我们写一个函数，返回两个值中较长的那个。为此，我们需要一个 `length` 属性，它是一个数字。我们通过编写 `extends` 子句将类型形参约束为该类型：

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
// 类型“number”的参数不能赋给类型“{ length: number; }”的参数
```

在这个例子中有一些有趣的地方需要注意。我们允许 TypeScript 推断 `longest` 的返回类型。返回类型推断也适用于泛型函数。

因为我们将 `Type` 约束为 `{ length: number }`，我们被允许访问 `a` 和 `b` 形参的 `.length` 属性。如果没有类型约束，我们将无法访问这些属性，因为值可能是没有 `length` 属性的其他类型。

`longerArray` 和 `longerString` 的类型是根据参数推断的。记住，泛型都是关于将两个或多个值与相同的类型联系起来！

最后，正如我们所希望的那样，对 `longest(10, 100)` 的调用被拒绝，因为数字类型没有 `.length` 属性。

### Working with Constrained Values - 使用受约束值

这是使用泛型约束时的一个常见错误：

```typescript
function minimumLength<Type extends { length: number }>(
  obj: Type,
  minimum: number
): Type {
  if (obj.length >= minimum) {
    return obj;
  } else {
    return { length: minimum };
    // 不能将类型“{ length: number; }”分配给类型“Type”。
    //  "{ length: number; }" 可赋给 "Type" 类型的约束，但可以使用约束 "{ length: number; }" 的其他子类型实例化 "Type"。
  }
}
```

这个函数看起来是 OK 的 - `Type` 被约束为 `{ length: number }`，函数返回 `Type` 或与该约束匹配的值。问题是，函数承诺返回与传入的对象相同的对象，而不仅仅是与约束匹配的对象。如果这些代码是合法的，那么你就可以编写绝对不能运行的代码：

```typescript
// 'arr' gets value { length: 6 }
const arr = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have
// a 'slice' method, but not the returned object!
console.log(arr.slice(0));
```

### Specifying Type Arguments - 指定类型实参

TypeScript 通常可以在泛型调用中推断出预期的类型实参，但并不总是如此。例如，假设你编写了一个函数来组合两个数组：

```typescript
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

通常情况下，使用不匹配的数组调用此函数是错误的：

```typescript
const arr = combine([1, 2, 3], ["hello"]);
// 不能将类型“string”分配给类型“number”。
```

但是，如果你打算这样做，你可以手动指定 `Type`：

```typescript
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

### Guidelines for Writing Good Generic Functions - 编写良好泛型函数的指南

编写泛型函数很有趣，很容易被类型形参冲昏了头。拥有太多类型形参或在不需要它们的地方使用约束会使推断不太成功，使函数的调用者感到懊恼。

**Push Type Parameters Down** - 下推类型形参

下面是两种编写函数的方法，它们看起来很相似：

```typescript
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}

// a: number (good)
const a = firstElement1([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

乍一看，这两者似乎一模一样，但是 `firstElement1` 是编写这个函数更好的方法。它的推断返回类型是 `Type`，而 `firstElement2` 的推断返回类型是 `any`，因为 TypeScript 必须使用约束类型解析 `arr[0]` 表达式，而不是 "等待" 在调用期间解析元素。

> 规则：如果可能，使用类型形参本身，而不是约束它。

**Use Fewer Type Parameters** - 使用更少的类型形参

这是另一对类似的函数：

```typescript
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

我们创建了一个类型形参 `Func`，它不关联两个值。这总是一个危险信号，因为这意味着想要指定类型实参的调用者必须手动指定一个额外的类型实参，没有任何理由。`Func` 不做任何事情，只是使函数更难阅读和推理。

> 规则：总是使用尽可能少的类型形参。

**Type Parameters Should Appear Twice** - 类型形参应该出现两次

有时我们会忘记函数可能并不需要泛型：

```typescript
function greet<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}

greet("world");
```

我们完全可以写一个更简单的版本：

```typescript
function greet(s: string) {
  console.log("Hello, " + s);
}
```

记住，类型形参是用来关联多个值的类型。如果一个类型形参只在函数签名中使用一次，那么它是没有关联任何事物。

> 规则：如果一个类型形参只出现在一个位置，那么强烈地重新考虑是否真的需要它。

## Optional Parameters - 可选形参

JavaScript 中的函数通常接受数量不定的实参。例如，`number` 的 `toFixed` 方法采用一个可选的数字计数：

```typescript
function f(n: number) {
  console.log(n.toFixed()); // 0 arguments
  console.log(n.toFixed(3)); // 1 argument
}
```

我们可以在 TypeScript 中通过 `?` 将形参标记为可选的：

```typescript
function f(x?: number) {
  // ...
}
f(); // OK
f(10); // OK
```

尽管形参被指定为类型 `number`，但是 `x` 形参实际上具有的类型是 `number | undefined`，因为 JavaScript 中未指定的形参的值是 `undefined`。

你还可以提供一个默认形参：

```typescript
function f(x = 10) {
  // ...
}
```

现在在 `f` 的方法体中，`x` 的类型为 `number`，因为任何 `undefined` 的实参都将被替换为 `10`。注意，当形参是可选的时，调用者总是可以传递 `undefined`，因为这只是模拟一个 "缺失的" 实参：

```typescript
declare function f(x?: number): void;
// cut
// All OK
f();
f(10);
f(undefined);
```

### Optional Parameters in Callbacks - 在回调中的可选形参

一旦你了解了可选形参和函数类型表达式，在编写调用回调的函数时，很容易犯以下错误：

```typescript
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

人们在编写 `index?` 时通常打算做什么？作为一个可选形参，他们希望这两个调用都是合法的：

```typescript
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));
```

这实际上意味着回调可能只需要一个实参就可以被调用。换句话说，函数定义表示执行可能像这样：

```typescript
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    // I don't feel like providing the index today
    callback(arr[i]);
  }
}
```

反过来，TypeScript 会强制执行这个含义，并发出实际上不可能的错误：

```typescript
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
  // 对象可能为“未定义”。
});
```

在 JavaScript 中，如果调用的函数的实参多于形参，额外的实参被简单地忽略。TypeScript 的行为也是如此。具有较少形参 (相同类型) 的函数总是可以代替具有更多形参的函数。

> 在为回调函数编写函数类型时，永远不要编写可选形参，除非你打算在不传递实参的情况下调用函数。

## Function Overloads - 函数重载

一些 JavaScript 函数可以以不同的实参计数和类型调用。例如，你可能编写一个函数来生成一个 `Date`，该 `Date` 接受一个时间戳 (一个实参) 或者一个月/日/年规范 (三个实参)。

在 TypeScript 中，我们可以通过重载签名指定一个可以用不同方式调用的函数。为此，编写一些函数签名 (通常是两个或两个以上)，然后是函数体：

```typescript
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
// 没有需要 2 参数的重载，但存在需要 1 或 3 参数的重载。
```

在这个例子中，我们写了两个重载：一个接受一个实参，另一个接受三个实参。这前两个签名称为重载签名。

然后，我们编写了一个具有兼容签名的函数实现。函数实现签名，但这些签名不能直接调用。即使我们写了一个函数，在必需的形参之后有两个可选的形参，但它不能用两个形参调用。

### Overload Signatures and the Implementation Signature - 重载签名和实现签名

这是一个常见的混淆来源，通常人们会写这样的代码，但不理解为什么会有错误：

```typescript
function fn(x: string): void;
function fn() {
  // ...
}
// Expected to be able to call with zero arguments
fn();
// 应有 1 个参数，但获得 0 个。
```

然而，用于编写函数体的签名不能从外部 "看见"。

> 实现的签名从外部看不出来。在编写一个函数重载时，你应该总是在函数的实现上有两个或两个以上的签名。

实现签名还必须与重载签名兼容。例如，这些函数有错误，因为实现签名没有以正确的方式匹配重载。

```typescript
function fn(x: boolean): void;
// Argument type isn't right
function fn(x: string): void;
// 此重载签名与其实现签名不兼容。
function fn(x: boolean) {}
```

```typescript
function fn(x: string): string;
// Return type isn't right
function fn(x: number): boolean;
// 此重载签名与其实现签名不兼容。
function fn(x: string | number) {
  return "oops";
}
```

### Writing Good Overloads - 编写好的重载

与泛型一样，在使用函数重载时也应该遵循一些指导原则。遵循这些原则将使函数更容易调用、更容易理解和更容易实现。

让我们探讨一个返回字符串或数组长度的函数：

```typescript
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}
```

这个函数很好；我们可以用字符串或数组调用它。但是，我们不能用可能是字符串或数组的值来调用它，因为 TypeScript 只能将函数调用解析为单个重载。

```typescript
len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
// 没有与此调用匹配的重载。
//   第 1 个重载(共 2 个)，“(s: string): number”，出现以下错误。
//     类型“number[] | "hello"”的参数不能赋给类型“string”的参数。
//       不能将类型“number[]”分配给类型“string”。
//   第 2 个重载(共 2 个)，“(arr: any[]): number”，出现以下错误。
//     类型“number[] | "hello"”的参数不能赋给类型“any[]”的参数。
//       不能将类型“string”分配给类型“any[]”。
```

因为两个重载有相同的实参计数和相同的返回类型，我们可以写一个非重载版本的函数。

```typescript
function len(x: any[] | string) {
  return x.length;
}
```

这个好多了！调用者可以用任何一种类型的值调用它，作为一个额外的好处，我们不需要确定正确的实现签名。

> 在可能的情况下，总是首选联合类型的形参而不是重载。

## Declaring `this` in a Function - 在函数中声明 `this`

TypeScript 会通过代码流分析来推断函数中的 `this` 应该是什么，如下所示：

```typescript
const user = {
  id: 123,

  admin: false,
  becomeAdmin: function () {
    this.admin = true;
  },
};
```

TypeScript 理解 `user.becomeAdmin` 函数有一个对应的 `this`，它是外部对象 `user`。`this` 在很多情况下已经足够了，但在很多情况下，你需要对 `this` 所代表的对象进行更多的控制。JavaScript 规范规定不能有名为 `this` 的形参，所以 TypeScript 使用这个语法空间让你在函数体中声明 `this` 的类型。

```typescript
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

这种模式在回调风格的 API 中很常见，在回调风格的 API 中，通常由另一个对象控制何时调用函数。注意，你需要使用函数而不是箭头函数来获得这种行为。

```typescript
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();
const admins = db.filterUsers(() => this.admin);
// 包含箭头的函数捕获“this”的全局值。
// 元素隐式具有“any”类型，因为类型“typeof globalThis”没有索引签名。
```

## Other Types to Know About - 其他需要了解的类型

在处理函数类型时，还需要识别一些经常出现的附加类型。与所有类型一样，你可以在任何地方使用它们，但它们在函数上下文中特别相关。

### `void`

`void` 表示不返回值的函数的返回值。当函数没有任何 `return` 语句或没有从这些 `return` 语句返回任何显式值时，它就是推断出的类型。

```typescript
// The inferred return type is void
function noop() {
  return;
}
```

在 JavaScript 中，不返回任何值的函数将隐式返回 `undefined` 的值。然而，在 TypeScript 中，`void` 和 `undefined` 并不是一回事。在本章末尾有进一步的细节。

> `void` 和 `undefined` 不一样。

### `object`

特殊类型 `object` 是指不是原始类型的任何值 (`string`, `number`, `bigint`, `boolean`, `symbol`, `null`, or `undefined`)。这不同于空对象类型 `{}`，也不同于全局类型 `Object`。很可能你永远不会使用 `Object`。

> `object` 不是 `Object`。总是使用 `object`！

注意，在 JavaScript 中，函数值是 `object`：它们有属性，有 `Object.prototype` 中的原型链，是 `instance Object`，你可以在它们上调用 `Object.keys`，等等。因此，函数类型被认为是 TypeScript 中的 `object`。

### `unknown`

`unknown` 类型表示任何值。这类似于 `any` 类型，但更安全，因为对一个 `unknown` 值进行操作是不合法的。

```typescript
function f1(a: any) {
  a.b(); // OK
}
function f2(a: unknown) {
  a.b();
  // 对象的类型为 "unknown"。
}
```

这在描述函数类型时非常有用，因为可以在函数体中不包含 `any` 值的情况下描述接受任何值的函数。

相反，你可以描述返回未知类型值的函数：

```typescript
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

// Need to be careful with 'obj'!
const obj = safeParse(someRandomString);
```

### `never`

有些函数从不返回值：

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}
```

`never` 类型表示从未观察到的值。在返回类型中，这意味着函数抛出异常或终止程序的执行。

`never` 也会在 TypeScript 判断联合中什么都没有的时候出现。

```typescript
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

### `Function`

全局类型 `Function` 描述了在 JavaScript 中比如 `bind`、`call`、`apply` 以及其他出现在全部函数值的属性。它还有一个特殊的属性，`Function` 类型的值总是可以被调用；这些调用返回 `any`：

```typescript
function doSomething(f: Function) {
  return f(1, 2, 3);
}
```

这是一个无类型函数调用，由于 `any` 返回类型不安全，通常最好避免。

如果需要接受一个任意的函数但不打算调用它，类型 `() => void` 通常更安全。

## Rest Parameters and Arguments - Rest 形参和实参

> 背景阅读：
> [Rest Parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) > [Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

### Rest Parameters - Rest 形参

除了使用可选形参或重载来制作可以接受各种固定实参计数的函数之外，我们还可以使用 rest 形参定义具有无限量实参的函数。

rest 形参出现在所有其他形参之后，并使用 `...` 语法：

```typescript
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a = multiply(10, 1, 2, 3, 4);
```

在 TypeScript 中，这些参数的类型注释是隐式的 `any[]` 而不是 `any`，并且给出的任何类型注释必须是 `Array<T>` 或 `T[]` 的形式，或者是元组类型 (我们将在后面学习)。

### Rest Arguments - Rest 实参

相反，我们可以使用扩张语法从数组中提供数量可变的参数。例如，数组的 `push` 方法接受任意数量的实参：

```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);
```

注意，通常情况下，TypeScript 并不假设数组是不可变的。这可能会导致一些令人惊讶的行为：

```typescript
// Inferred type is number[] -- "an array with zero or more numbers",
// not specifically two numbers
const args = [8, 5];
const angle = Math.atan2(...args);
// 扩张参数必须具有元组类型或传递给 rest 参数。
```

解决这种情况的最佳方法取决于你的代码，但一般来说，`const` 上下文是最直接的解决方案：

```typescript
// Inferred as 2-length tuple
const args = [8, 5] as const;
// OK
const angle = Math.atan2(...args);
```

当针对较旧的运行时的时候，使用 rest 实参可能需要打开 [`downlevelIteration`](https://www.typescriptlang.org/tsconfig#downlevelIteration)。

## Parameter Destructuring - 形参解构

> 背景阅读：
> [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

你可以使用形参解构来方便地将实参提供的对象解包到函数体中的一个或多个局部变量中。在 JavaScript 中，它看起来像这样：

```js
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
```

对象的类型注释位于解构语法之后：

```typescript
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}
```

这看起来有点冗长，但你也可以在这里使用命名类型：

```typescript
// Same as prior example
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

## Assignability of Functions - 函数的可分配性

### Return type `void` - 返回类型 `void`

函数的 `void` 返回类型可能会产生一些不寻常但预期的行为。

返回类型为 `void` 的上下文类型不会强制函数不返回任何东西。换句话说，这是一个上下文函数类型，具有一个 `void` 返回类型 (`type vf = () => void`)，实现时，可以返回任何其他值，但它将被忽略。

因此，类型 `() => void` 的以下实现是有效的：

```typescript
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true;
};

const f2: voidFunc = () => true;

const f3: voidFunc = function () {
  return true;
};
```

当其中一个函数的返回值被赋值给另一个变量时，它将保留 `void` 的类型：

```typescript
const v1 = f1();

const v2 = f2();

const v3 = f3();
```

此行为的存在使得以下代码仍然有效，即使 `Array.prototype.push` 返回一个数字，而 `Array.prototype.forEach` 方法期望返回类型为 `void` 的函数。

```typescript
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
```

还有一种需要注意的特殊情况，当字面量函数定义具有 `void` 返回类型时，该函数必须不返回任何事物。

```typescript
function f2(): void {
  // @ts-expect-error
  return true;
}

const f3 = function (): void {
  // @ts-expect-error
  return true;
};
```

有关 `void` 的更多信息，请参考这些其他文档条目：

- [v1 handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html#void)
- [v2 handbook](https://www.typescriptlang.org/docs/handbook/2/functions.html#void)
- [FAQ - “Why are functions returning non-void assignable to function returning void?”](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-are-functions-returning-non-void-assignable-to-function-returning-void)
