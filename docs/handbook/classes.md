# Classes

> 背景阅读：
> [Classes (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

TypeScript 对 ES2015 中引入的 `class` 关键字提供了全面支持。

与其他 JavaScript 语言特性一样，TypeScript 添加了类型注释和其他语法，以允许你表达类和其他类型之间的关系。

## Class Members - Class 成员

这是最基本的类 - 一个空的类：

```typescript
class Point {}
```

这个类还不是很有用，所以让我们开始添加一些成员。

### Fields - 字段

字段声明在类上创建一个公共可写属性：

```typescript
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

与其他位置一样，类型注释是可选的，但如果不指定，则为隐式 `any`。

字段也可以有初始化设定式；这些将在类实例化时自动运行：

```typescript
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();
// Prints 0, 0
console.log(`${pt.x}, ${pt.y}`);
```

就像 `const`、`let` 和 `var` 一样，类属性的初始化设定式将用于推断其类型：

```typescript
const pt = new Point();
pt.x = "0"; // 不能将类型“string”分配给类型“number”。
```

### `--strictPropertyInitialization`

[`strictPropertyInitialization`](https://www.typescriptlang.org/tsconfig#strictPropertyInitialization) 设置控制是否需要在构造函数中初始化类字段。

```typescript
class BadGreeter {
  name: string; // 属性“name”没有初始化表达式，且未在构造函数中明确赋值。
}
```

```typescript
class GoodGreeter {
  name: string;

  constructor() {
    this.name = "hello";
  }
}
```

注意，该字段需要在构造函数本身中初始化。TypeScript 不会分析你从构造函数调用的方法来检测初始化，因为派生类可能会覆盖这些方法并未能做到初始化成员。

如果你打算明确地通过构造函数以外的方式初始化一个字段 (例如，可能是一个外部库为你填充了你的类的一部分)，你可以使用明确的赋值断言操作符 `!`。

```typescript
class OKGreeter {
  // Not initialized, but no error
  name!: string;
}
```

### `readonly`

字段可以用 `readonly` 修饰符作为前缀。这可以防止在构造函数的外部给字段赋值。

```typescript
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "not ok";
    // 无法分配到 "name" ，因为它是只读属性。
  }
}
const g = new Greeter();
g.name = "also not ok";
// 无法分配到 "name" ，因为它是只读属性。
```

### Constructors - 构造函数

> 背景阅读：
> [Constructor (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)

类构造函数与函数非常相似。你可以添加带有类型注释、默认值和重载的形参：

```typescript
class Point {
  x: number;
  y: number;

  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```typescript
class Point {
  // Overloads
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // TBD
  }
}
```

类构造函数签名和函数签名之间只有一些区别：

- 构造函数不能有类型形参 - 这些属于外部类声明，我们将在后面了解
- 构造函数不能有返回类型注释 - 总是返回类实例类型

#### Super Calls

就像在 JavaScript 中一样，如果你有一个基类，你需要在构造函数体中使用任何 `this.` 成员之前调用 `super();`：

```typescript
class Base {
  k = 4;
}

class Derived extends Base {
  constructor() {
    // Prints a wrong value in ES5; throws exception in ES6
    console.log(this.k);
    // 访问派生类的构造函数中的 "this" 前，必须调用 "super"。
    super();
  }
}
```

在 JavaScript 中，忘记调用 `super` 是一个很容易犯的错误，但是 TypeScript 会在必要的时候告诉你。

### Methods - 方法

> 背景阅读：
> [Method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)

类上的函数属性称为方法。方法可以使用与函数和构造函数相同的所有类型注释：

```typescript
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

除了标准的类型注释之外，TypeScript 没有向方法添加任何新的事物。

注意，在方法体内部，通过 `this.` 访问字段和其他方法仍然是强制的。方法体中的非限定名称将总是引用封闭作用域中的事物：

```typescript
let x: number = 0;

class C {
  x: string = "hello";

  m() {
    // This is trying to modify 'x' from line 1, not the class property
    x = "world";
    // 不能将类型“string”分配给类型“number”。
  }
}
```

### Getters / Setters - 获得器 / 设置器

类也可以有访问器。

```typescript
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

> 注意，不带额外逻辑的基于字段的 get/set 对在 JavaScript 中很少有用。如果你不需要在 get/set 操作期间添加额外的逻辑，暴露公共字段是可以的。

TypeScript 对访问器有一些特殊的推断规则：

- 如果 `get` 存在但没有 `set`，则该属性自动为 `readonly`
- 如果没有指定 setter 形参的类型，则从 getter 的返回类型推断出它的类型
- getter 和 setter 必须具有相同的 [成员可见性](https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility)

从 [TypeScript 4.3](https://devblogs.microsoft.com/typescript/announcing-typescript-4-3/) 开始，可以使用不同类型的访问器进行获取和设置。

```typescript
class Thing {
  _size = 0;

  get size(): number {
    return this._size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN, Infinity, etc

    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }

    this._size = num;
  }
}
```

### Index Signatures - 索引签名

类可以声明索引签名；它们的运行与 [其他对象类型的索引签名](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) 相同：

```typescript
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

因为索引签名类型还需要捕获方法的类型，所以要想有效地使用这些类型并不容易。通常，最好将索引数据存储在另一个地方，而不是类实例本身。

## Class Heritage - Class 遗产

与其他具有面向对象特性的语言一样，JavaScript 中的类可以从基类继承。

### `implements` Clauses - `implements` 子句

你可以使用 `implements` 子句检查类是否满足特定的 `interface`。如果一个类不能正确地实现它，就会发出一个错误。

```typescript
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

class Ball implements Pingable {
  // 类“Ball”错误实现接口“Pingable”。
  // 类型 "Ball" 中缺少属性 "ping"，但类型 "Pingable" 中需要该属性。
  pong() {
    console.log("pong!");
  }
}
```

类也可以实现多个接口，例如 `class C implements A, B {`。

#### Cautions - 注意事项

重要的是要理解，`implements` 子句只是检查类是否可以被视为接口类型。它根本不改变类或方法的类型。一个常见的错误来源是认为 `implements` 子句将改变类的类型 - 事实并非如此。

```typescript
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s) {
    // 参数“s”隐式具有“any”类型。
    // Notice no error here
    return s.toLowercse() === "ok"; // any
  }
}
```

在这个例子中，我们可能期望 `s` 的类型会受到 `check` 的 `name: string` 形参的影响。这并不会 - `implements` 子句不会改变如何检查类主体或推断其类型。

同样，实现带有可选属性的接口并不会创建该属性：

```typescript
interface A {
  x: number;
  y?: number;
}
class C implements A {
  x = 0;
}
const c = new C();
c.y = 10;
// 类型“C”上不存在属性“y”。
```

### `extends` Clauses - `extends` 子句

> 背景阅读：
> [extends keyword (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)

类可以从基类扩展。派生类具有基类的所有属性和方法，以及还定义了附加的成员。

```typescript
class Animal {
  move() {
    console.log("Moving along!");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("woof!");
    }
  }
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);
```

#### Overriding Methods - 覆盖方法

派生类还可以覆盖基类字段或属性。你可以用 `super.` 用于访问基类方法的语法。注意，因为 JavaScript 类是一个简单的查找对象，所以没有 "super 字段" 的概念。

TypeScript 强制派生类始终是其基类的子类型。

例如，这是一种覆盖方法的合法方式：

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();
d.greet("reader");
```

派生类遵循基类契约是很重要的。请记住，这很常见 (而且总是合法的！) 通过基类标记引用派生类实例：

```typescript
// Alias the derived instance through a base class reference
const b: Base = d;
// No problem
b.greet();
```

如果 `Derived` 不遵守 `Base` 的契约怎么办？

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  // Make this parameter required
  greet(name: string) {
    // 类型“Derived”中的属性“greet”不可分配给基类型“Base”中的同一属性。
    //   不能将类型“(name: string) => void”分配给类型“() => void”。
    console.log(`Hello, ${name.toUpperCase()}`);
  }
}
```

如果我们不顾错误编译这段代码，那么这个示例就会崩溃：

```typescript
const b: Base = new Derived();
// Crashes because "name" will be undefined
b.greet();
```

#### Type-only Field Declarations - 纯类型字段声明

当 `target >= ES2022` 或 [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields) 为 `true` 时，类字段在父类构造函数完成后初始化，重写父类设置的任何值。当你只想为继承的字段重新声明更精确的类型时，这可能会成为一个问题。要处理这些情况，你可以写 `declare` 来告诉 TypeScript 这个字段声明不应该有运行时效果。

```typescript
interface Animal {
  dateOfBirth: any;
}

interface Dog extends Animal {
  breed: any;
}

class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}

class DogHouse extends AnimalHouse {
  // Does not emit JavaScript code,
  // only ensures the types are correct
  declare resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

#### Initialization Order - 初始化顺序

在某些情况下，JavaScript 类初始化的顺序可能令人惊讶。让我们考虑一下这段代码：

```typescript
class Base {
  name = "base";
  constructor() {
    console.log("My name is " + this.name);
  }
}

class Derived extends Base {
  name = "derived";
}

// Prints "base", not "derived"
const d = new Derived();
```

这里发生了什么？

根据 JavaScript 的定义，类初始化的顺序是：

- 基类字段被初始化
- 基类构造函数运行
- 派生类字段被初始化
- 派生类构造函数运行

这意味着基类构造函数在自己的构造函数中看到自己的 `name` 值，因为派生类字段初始化还没有运行。

#### Inheriting Built-in Types - 继承内置类型

> 注意：如果你不打算继承内置类型，如 `Array`、`Error`、`Map` 等，或如果你的编译 `target` 明确设置为 ES6/ES2015 或更高版本，你可以跳过本节。

在 ES2015 中，返回对象的构造函数隐式地将 `this` 的值替换为 `super(...)` 的任何调用者。生成的构造函数代码必须捕获 `super(...)` 的任何潜在返回值并将其替换为 `this`。

因此，子类化 `Error`、`Array` 和其他子类可能不再像预期的那样工作。这是因为 `Error`、`Array` 等函数的构造函数使用了 ECMAScript 6 的 `new.target` 调整原型链。然而，没有办法确保 `new.target` 的值，在调用 ECMAScript 5 中的构造函数时。其他底层编译器通常在默认情况下具有相同的限制。

对于像下面这样的子类：

```typescript
class MsgError extends Error {
  constructor(m: string) {
    super(m);
  }
  sayHello() {
    return "hello " + this.message;
  }
}
```

你会发现：

- 方法可能在构造这些子类返回的对象上未定义，因此调用 `sayHello` 将导致错误。
- `instanceof` 将在子类的实例及其实例之间被破坏，因此 `(new MsgError()) instanceof MsgError` 将返回 `false`。

作为建议，你可以在任何 `super(...)` 调用之后立即手动调整原型。

```typescript
class MsgError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, MsgError.prototype);
  }

  sayHello() {
    return "hello " + this.message;
  }
}
```

然而，`MsgError` 的任何子类也必须手动设置原型。用于不支持 [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf) 的运行时，你可以使用 [`__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)。

不幸的是，[这些变通方法在 Internet Explorer 10 或更早版本上无效](<https://msdn.microsoft.com/en-us/library/s4esdbwz(v=vs.94).aspx>)。可以手动将方法从原型复制到实例本身 (即 `MsgError.prototype` 到 `this`)，但是原型链本身不能固定。

## Member Visibility - 成员可见性

你可以使用 TypeScript 来控制某些方法或属性是否对类外部的代码可见。

### `public`

类成员的默认可见性是 `public` 的。一个 `public` 成员可以在任何地方访问：

```typescript
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

因为 `public` 已经是默认的可见性修饰符，所以你不需要在类成员上编写它，但出于样式/可读性的原因可能会选择这样做。

### `protected`

受 `protected` 成员仅对声明它们的类的子类可见。

```typescript
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // OK to access protected member here
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet(); // OK
g.getName(); // 属性“getName”受保护，只能在类“Greeter”及其子类中访问。
```

#### Exposure of `protected` members - `protected` 成员的暴露

派生类需要遵循它们的基类契约，但可以选择暴露具有更多功能的基类的子类型。这包括将 `protected` 成员 `public`：

```typescript
class Base {
  protected m = 10;
}
class Derived extends Base {
  // No modifier, so default is 'public'
  m = 15;
}
const d = new Derived();
console.log(d.m); // OK
```

注意，`Derived` 已经能够自由地读写 `m`，因此这不会对这种情况的 "安全性" 产生任何影响。这里要注意的主要事情是，在派生类中，如果这种暴露不是有意的，我们需要小心地重复 `protected` 的修饰符。

#### Cross-hierarchy `protected` access - 交叉层次 `protected` 访问

不同的 OOP 语言对于通过基类引用访问 `protected` 成员是否合法存在分歧：

```typescript
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10;
    // 属性“x”受保护，只能通过类“Derived2”的实例进行访问。这是类“Base”的实例。
  }
}
```

例如，Java 认为这是合法的。另一方面，C# 和 C++ 选择了这种代码应该是非法的。

在这里，TypeScript 支持 C# 和 C++，因为在 `Derived2` 中访问 `x` 应该只从 `Derived2` 的子类中合法，而 `Derived1` 不是其中之一。此外，如果通过 `Derived1` 引用访问 `x` 是非法的 (这当然应该是非法的！)，那么通过基类引用访问 `x` 将永远不会改善这种情况。

请参见 [为什么不能从派生类访问 Protected 的成员？](https://blogs.msdn.microsoft.com/ericlippert/2005/11/09/why-cant-i-access-a-protected-member-from-a-derived-class/) 这解释了更多 C# 的说明。

### `private`

`private` 类似于 `protected`，但不允许从子类访问成员：

```typescript
class Base {
  private x = 0;
}
const b = new Base();
// Can't access from outside the class
console.log(b.x); // 属性“x”为私有属性，只能在类“Base”中访问。
```

```typescript
class Derived extends Base {
  showX() {
    // Can't access in subclasses
    console.log(this.x);
    // 属性“x”为私有属性，只能在类“Base”中访问。
  }
}
```

由于 `private` 成员对派生类不可见，派生类不能增加其可见性：

```typescript
class Base {
  private x = 0;
}
class Derived extends Base {
  // 类“Derived”错误扩展基类“Base”。
  //   属性“x”在类型“Base”中是私有属性，但在类型“Derived”中不是。
  x = 1;
}
```

#### Cross-instance `private` access - 交叉层次 `private` 访问

不同的 OOP 语言对于同一类的不同实例是否可以访问彼此的 `private` 成员存在分歧。虽然 Java、C#、C++、Swift 和 PHP 等语言允许这样做，但 Ruby 不允许。

TypeScript 允许跨实例的 `private` 访问：

```typescript
class A {
  private x = 10;

  public sameAs(other: A) {
    // No error
    return other.x === this.x;
  }
}
```

#### Caveats - 说明

和 TypeScript 类型系统的其他方面一样，`private` 和 `protected` [只在类型检查时强制执行](https://www.typescriptlang.org/play?removeComments=true&target=99&ts=4.3.4#code/PTAEGMBsEMGddAEQPYHNQBMCmVoCcsEAHPASwDdoAXLUAM1K0gwQFdZSA7dAKWkoDK4MkSoByBAGJQJLAwAeAWABQIUH0HDSoiTLKUaoUggAW+DHorUsAOlABJcQlhUy4KpACeoLJzrI8cCwMGxU1ABVPIiwhESpMZEJQTmR4lxFQaQxWMm4IZABbIlIYKlJkTlDlXHgkNFAAbxVQTIAjfABrAEEC5FZOeIBeUAAGAG5mmSw8WAroSFIqb2GAIjMiIk8VieVJ8Ar01ncAgAoASkaAXxVr3dUwGoQAYWpMHBgCYn1rekZmNg4eUi0Vi2icoBWJCsNBWoA6WE8AHcAiEwmBgTEtDovtDaMZQLM6PEoQZbA5wSk0q5SO4vD4-AEghZoJwLGYEIRwNBoqAzFRwCZCFUIlFMXECdSiAhId8YZgclx0PsiiVqOVOAAaUAFLAsxWgKiC35MFigfC0FKgSAVVDTSyk+W5dB4fplHVVR6gF7xJrKFotEk-HXIRE9PoDUDDcaTAPTWaceaLZYQlmoPBbHYx-KcQ7HPDnK43FQqfY5+IMDDISPJLCIuqoc47UsuUCofAME3Vzi1r3URvF5QV5A2STtPDdXqunZDgDaYlHnTDrrEAF0dm28B3mDZg6HJwN1+2-hg57ulwNV2NQGoZbjYfNrYiENBwEFaojFiZQK08C-4fFKTVCozWfTgfFgLkeT5AUqiAA)。

这意味着 JavaScript 运行时结构，如 `in` 或简单的属性查找，仍然可以访问 `private` 成员或 `protected` 成员：

```typescript
class MySafe {
  private secretKey = 12345;
}
```

```js
// In a JavaScript file...
const s = new MySafe();
// Will print 12345
console.log(s.secretKey);
```

`private` 还允许在类型检查期间使用括号符号进行访问。这使得 `private` 声明的字段可能更容易被诸如单元测试之类的事情访问，缺点是这些字段是软私有，不严格执行私有：

```typescript
class MySafe {
  private secretKey = 12345;
}

const s = new MySafe();

// Not allowed during type checking
console.log(s.secretKey); // 属性“secretKey”为私有属性，只能在类“MySafe”中访问。

// OK
console.log(s["secretKey"]);
```

与 TypeScripts 的 `private` 不同，JavaScript 的 [私有字段](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) (`#`) 在编译后仍然是私有的，并且不提供前面提到的像括号符号访问这样的泄露舱口，这使得它们是隐隐私。

```typescript
class Dog {
  #barkAmount = 0;
  personality = "happy";

  constructor() {}
}
```

```js
"use strict";
class Dog {
  #barkAmount = 0;
  personality = "happy";
  constructor() {}
}
```

当编译到 ES2021 或更低版本时，TypeScript 将在 `#` 的地方使用 `WeakMap`。

```typescript
"use strict";
var _Dog_barkAmount;
class Dog {
  constructor() {
    _Dog_barkAmount.set(this, 0);
    this.personality = "happy";
  }
}
_Dog_barkAmount = new WeakMap();
```

如果需要保护类中的值不受恶意行为者的伤害，你应该使用提供运行时硬隐私机制，例如闭包、`WeakMap` 或私有字段。注意，这些在运行时添加的隐私检查可能会影响性能。

## Static Members - 静态成员

类可以有 `static` 成员。这些成员不与类的特定实例相关联。它们可以通过类构造函数对象本身访问：

```typescript
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

静态成员还可以使用相同的 `public`、`protected` 和 `private` 可见性修饰符：

```typescript
class MyClass {
  private static x = 0;
}
console.log(MyClass.x);
// 属性“x”为私有属性，只能在类“MyClass”中访问。
```

静态成员也可以被继承：

```typescript
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### Special Static Names - 特殊静态名称

从 `Function` 原型中重写属性通常是不安全的/可能的。因为类本身就是可以用 `new` 调用的函数，所以不能使用某些静态名称，像 `name`、`length` 和 `call` 这样的函数属性不能定义为 `static` 成员。

```typescript
class S {
  static name = "S!";
  // 静态属性“name”与构造函数“S”的内置属性函数“name”冲突。
}
```

### Why No Static Classes? - 为什么没有静态类？

TypeScript (和 JavaScript) 不像 C# 那样有一个叫做 `static class` 的构造。

这些构造之所以存在，是因为这些语言强制所有数据和函数都在一个类中；因为 TypeScript 中不存在该限制，所以不需要它们。只有一个实例的类通常只表示为 JavaScript/TypeScript 中的普通对象。

例如，在 TypeScript 中，我们不需要 "static class" 语法，因为常规对象 (甚至顶级函数) 可以完成同样的工作：

```typescript
// Unnecessary "static" class
class MyStaticClass {
  static doSomething() {}
}

// Preferred (alternative 1)
function doSomething() {}

// Preferred (alternative 2)
const MyHelperObject = {
  dosomething() {},
};
```

## `static` Blocks in Classes - 类中的 `static` 块

静态块允许你编写具有自己作用域的语句序列，这些语句可以访问包含类中的私有字段。这意味着我们可以编写具有编写语句的所有功能的初始化代码，而不泄漏变量，并完全访问类的内部。

```typescript
class Foo {
  static #count = 0;

  get count() {
    return Foo.#count;
  }

  static {
    try {
      const lastInstances = loadLastInstances();
      Foo.#count += lastInstances.length;
    } catch {}
  }
}
```

## Generic Classes - 泛型类

类很像接口，可以是泛型的。当泛型类用 `new` 实例化时，其类型形参的推断方式与函数调用中相同：

```typescript
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box("hello!"); // const b: Box<string>
```

类可以像接口一样使用泛型约束和默认值。

### Type Parameters in Static Members - 在静态成员中的类型形参

这代码是不合法的，原因可能不太明显：

```typescript
class Box<Type> {
  static defaultValue: Type; // 静态成员不能引用类类型形参。
}
```

记住，类型总是完全擦除的！在运行时，只有一个 `Box.defaultValue` 属性槽位。这意味着设置 `Box<string>.defaultValue` (如果可能的话) 也将改变 `Box<number>.defaultValue` - 不好的。泛型类的 `static` 成员永远不能引用类的类型形参。

## `this` at Runtime in Classes - 在类的运行时的 `this`

> 背景阅读：
> [this keyword (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

重要的是要记住 TypeScript 不会改变 JavaScript 的运行时行为，并且 JavaScript 以其特殊的运行时行为而闻名。

JavaScript 对 `this` 的处理确实不同寻常：

```typescript
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};

// Prints "obj", not "MyClass"
console.log(obj.getName());
```

长话短说，默认情况下，函数中 `this` 的值取决于函数的调用方式。在这个例子中，因为函数是通过 `obj` 引用调用的，所以它的 `this` 值是 `obj` 而不是类实例。

这很少是你想要发生的！TypeScript 提供了一些方法来减轻或防止这类错误。

### Arrow Functions - 箭头函数

> 背景阅读：
> [Arrow functions (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

如果你有一个函数，它经常以一种失去它的 `this` 上下文的方式被调用，那么使用箭头函数属性而不是方法定义是有意义的：

```typescript
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c = new MyClass();
const g = c.getName;
// Prints "MyClass" instead of crashing
console.log(g());
```

这有一些权衡：

- 这个 `this` 值保证在运行时是正确的，即使是没有使用 TypeScript 检查的代码
- 这将使用更多的内存，因为每个类实例都有以这种方式定义的每个函数的自己的副本
- 你不能在派生类中使用 `super.getName`，因为在原型链中没有获取基类方法的入口

### `this` parameters - `this` 形参

在方法或函数定义中，名为 `this` 的初始形参在 `TypeScript` 中具有特殊含义。这些形参在编译期间被擦除：

```typescript
// TypeScript input with 'this' parameter
function fn(this: SomeType, x: number) {
  /* ... */
}
```

```js
// JavaScript output
function fn(x) {
  /* ... */
}
```

TypeScript 检查调用带有 `this` 形参的函数时是否使用了正确的上下文。我们可以在方法定义中添加 `this` 形参，而不是使用箭头函数，以静态地强制正确地调用方法：

```typescript
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();

// Error, would crash
const g = c.getName;
console.log(g());
// 类型为“void”的 "this" 上下文不能分配给类型为“MyClass”的方法的 "this"。
```

这个方法与箭头函数方法进行了截然不同的权衡：

- JavaScript 调用者可能仍然错误地使用类方法而没有意识到它
- 每个类定义只分配一个函数，而不是每个类实例分配一个函数
- 基方法定义仍然可以通过 `super` 调用。

## `this` Types - `this` 类型

在类中，一种名为 `this` 的特殊类型动态引用当前类的类型。让我们看看这有什么用：

```typescript
class Box {
  contents: string = "";
  set(value: string) {
    // (method) Box.set(value: string): this
    this.contents = value;
    return this;
  }
}
```

这里，TypeScript 推断 `set` 的返回类型是 `this`，而不是 `Box`。现在让我们创建 `Box` 的一个子类：

```typescript
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello"); // const b: ClearableBox
```

你也可以在形参类型注释中使用 `this`：

```typescript
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

这与编写 `other: Box` 是不同的 - 如果你有一个派生类，它的 `sameAs` 方法现在只接受该派生类的其他实例：

```typescript
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}

class DerivedBox extends Box {
  otherContent: string = "?";
}

const base = new Box();
const derived = new DerivedBox();
derived.sameAs(base);
// 类型“Box”的参数不能赋给类型“DerivedBox”的参数。
//   类型 "Box" 中缺少属性 "otherContent"，但类型 "DerivedBox" 中需要该属性。
```

### `this` - based type guards - `this` - 基于类型守卫

你可以在类和接口中的方法的返回位置使用 `this is Type`。当混合使用类型窄化时 (例如 `if` 语句)，目标对象的类型将被窄化到指定的 `Type`。

```typescript
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}

class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[];
}

interface Networked {
  host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

if (fso.isFile()) {
  fso.content; // const fso: FileRep
} else if (fso.isDirectory()) {
  fso.children; // const fso: Directory
} else if (fso.isNetworked()) {
  fso.host; // const fso: Networked & FileSystemObject
}
```

基于 `this` 的类型守卫的一个常见用例是允许对特定字段进行延迟验证。例如，这种情况下，当 `hasValue` 被验证为 `true` 时，从 `box` 内持有的 `value` 中删除 `undefined`。

```typescript
class Box<T> {
  value?: T;

  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}

const box = new Box();
box.value = "Gameboy";

box.value; // (property) Box<unknown>.value?: unknown

if (box.hasValue()) {
  box.value; // (property) value: unknown
}
```

## Parameter Properties - 形参属性

TypeScript 提供了将构造函数形参转换为具有相同名称和值的类属性的特殊语法。这些被称为形参属性，是通过在构造函数参数前加上一个可见性修饰符 `public`、`private`、`protected` 或 `readonly` 来创建的。结果字段得到这些修饰符：

```typescript
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x); // (property) Params.x: number
console.log(a.z); // 属性“z”为私有属性，只能在类“Params”中访问。
```

## Class Expressions - Class 表达式

> 背景阅读：
> [Class expressions (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class)

类表达式非常类似于类声明。唯一真正的区别是类表达式不需要名称，尽管我们可以通过它们最终绑定到的任何标识符来引用它们。

```typescript
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};

const m = new someClass("Hello, world");
// const m: someClass<string>
```

## `abstract` Classes and Members - `abstract` 类和成员

TypeScript 中的类、方法和字段可以是抽象的。

抽象方法或抽象字段是没有提供实现的方法或字段。这些成员必须存在于抽象类中，而抽象类不能直接实例化。

抽象类的作用是作为实现所有抽象成员的子类的基类。当一个类没有任何抽象成员时，它被称为具体的。

让我们看一个例子：

```typescript
abstract class Base {
  abstract getName(): string;

  printName() {
    console.log("Hello, " + this.getName());
  }
}

const b = new Base(); // 无法创建抽象类的实例。
```

我们不能用 `new` 实例化 `Base`，因为它是抽象的。相反，我们需要创建一个派生类并实现抽象成员：

```typescript
class Derived extends Base {
  getName() {
    return "world";
  }
}

const d = new Derived();
d.printName();
```

注意，如果我们忘记实现基类的抽象成员，就会得到一个错误：

```typescript
class Derived extends Base {
  // 非抽象类“Derived”不会实现继承自“Base”类的抽象成员“getName”。
  // forgot to do anything
}
```

### Abstract Construct Signatures - 抽象构造签名

有时，你希望接受一些类构造函数，从该函数生成从抽象类派生的类的实例。

例如，你可能想要编写这样的代码：

```typescript
function greet(ctor: typeof Base) {
  const instance = new ctor();
  // 无法创建抽象类的实例。
  instance.printName();
}
```

TypeScript 会正确地告诉你，你正在尝试实例化一个抽象类。毕竟，根据 `greet` 的定义，编写这段代码是完全合法的，它最终将构建一个抽象类：

```typescript
// Bad!
greet(Base);
```

相反，你希望编写一个函数来接受具有构造签名的事物：

```typescript
function greet(ctor: new () => Base) {
  const instance = new ctor();
  instance.printName();
}
greet(Derived);
greet(Base);
// 类型“typeof Base”的参数不能赋给类型“new () => Base”的参数。
//   无法将抽象构造函数类型分配给非抽象构造函数类型。
```

现在 TypeScript 可以正确地告诉你哪些类构造函数可以调用 - `Derived` 可以，因为它是具体的，但 `Base` 不可以。

## Relationships Between Classes - 类之间的关系

在大多数情况下，TypeScript 中的类与其他类型一样，都是在结构上进行比较的。

例如，这两个类可以代替彼此使用，因为它们是相同的：

```typescript
class Point1 {
  x = 0;
  y = 0;
}

class Point2 {
  x = 0;
  y = 0;
}

// OK
const p: Point1 = new Point2();
```

类似地，即使没有显式继承，类之间也存在子类型关系：

```typescript
class Person {
  name: string;
  age: number;
}

class Employee {
  name: string;
  age: number;
  salary: number;
}

// OK
const p: Person = new Employee();
```

这听起来很简单，但有一些情况似乎比其他情况更奇怪。

空类没有成员。在结构类型系统中，没有成员的类型通常是其他任何类型的超类型。因此，如果你编写一个空类 (不建议！)，任何事物都可以用来代替它：

```typescript
class Empty {}

function fn(x: Empty) {
  // can't do anything with 'x', so I won't
}

// All OK!
fn(window);
fn({});
fn(fn);
```
