# Generics

软件工程的一个主要部分是构建不仅具有定义明确以及一致的 API，而且也可重复使用的组件。能够处理当前和未来数据的组件将为构建大型软件系统提供最灵活的功能。

在 C# 和 Java 等语言中，用于创建可重用组件的工具箱中的主要工具之一是泛型，也就是说，它能够创建一个可以处理多种类型而不是单一类型的组件。这允许用户使用这些组件并使用他们自己的类型。

## Hello World of Generics - 泛型 Hello World

开始，让我们做泛型 "hello world"：`identity` 函数。`identity` 函数是一个将返回传入的任何内容的函数。你可以用与 `echo` 命令类似的方式来考虑这一点。

如果没有泛型，我们要么必须给 `identity` 函数一个特定的类型：

```typescript
function identity(arg: number): number {
  return arg;
}
```

或者，我们可以用 `any` 类型来描述 `identity` 函数：

```typescript
function identity(arg: any): any {
  return arg;
}
```

而使用 `any` 肯定是泛型的，因为它将导致函数接受 `arg` 的类型是任何所有类型。当函数返回时，我们实际上失去了关于 `arg` 类型的信息。如果我们传入一个 `number`，我们所拥有的唯一信息就是可以返回 `any` 类型。

相反，我们需要一种方法来捕获参数的类型，这样我们也可以用它来表示返回的是什么。这里，我们将使用类型变量，这是一种特殊类型的变量，它作用于类型而不是值。

```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}
```

现在，我们向 `identity` 函数添加了一个类型变量 `Type`。这个 `Type` 允许我们捕获用户提供的类型 (例如 `number`)，以便我们以后使用该信息。这里，我们再次使用 `Type` 作为返回类型。通过检查，我们现在可以看到实参和返回类型使用了相同的类型。这允许我们在函数的一侧传输类型信息，并在另一侧输出。

我们认为这个版本的 `identity` 函数是泛型，因为它适用于一系列类型。与使用 `any` 不同，它与第一个使用数字作为实参以及返回类型的 `identity` 函数一样准确 (即，它不会丢失任何信息)。

```typescript
let output = identity<string>("myString"); // let output: string
```

这里，我们显式地将 `Type` 设置为 `string`，作为函数调用的实参之一，在参数周围使用 `<>` 而不是 `()` 表示。

第二种方式可能也是最常见的。这里我们使用类型实参推断 - 也就是说，我们想要编译器根据我们传入的实参的类型自动为我们设置 `Type` 的值：

```typescript
let output = identity("myString"); // let output: string
```

注意，我们不必显式地将类型传递到尖括号中 (`<>`)；编译器只看值 `"myString"`，并将 `Type` 设置为它的类型。虽然类型参数推断是保持代码更短、更可读的有用工具，但当编译器无法推断类型时 (在更复杂的示例中可能会发生这种情况)，你可能需要像我们在上一个示例中所做的那样显式地传入类型实参。

## Working with Generic Type Variables - 使用泛型类型变量

当你开始使用泛型时，你会注意到当你创建像 `identity` 这样的泛型函数时，编译器将强制你在函数体中正确使用任何泛型类型形参。也就是说，你实际上将这些形参视为可以是任何所有类型。

我们用之前的 `identity` 函数：

```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}
```

如果我们还想在每次调用时将实参 `arg` 的 `length` 记录到控制台呢？我们可能会想这么写：

```typescript
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // 类型“Type”上不存在属性“length”。
  return arg;
}
```

当我们这样做时，编译器会给我们一个错误，说我们正在使用 `arg` 的 `.length` 成员，但我们从未说过 `arg` 有这个成员。记住，我们前面说过，这些类型变量代表任何所有类型，因此，使用此函数的人可以传入一个没有 `.length` 成员的 `number`。

假设我们实际上打算让这个函数处理 `Type` 数组，而不是直接处理 `Type`。因为我们使用的是数组，所以 `.length` 成员应该是可用的。我们可以像创建其他类型的数组一样描述它：

```typescript
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(arg.length);
  return arg;
}
```

你可以读取 `loggingIdentity` 的类型，因为泛型函数 `loggingIdentity` 接受一个类型实参 `Type`，以及一个实参 `arg`，它是一个 `Type` 数组，并返回一个 `Type` 数组。如果传入一个 `number` 数组，则返回一个 `number` 数组，因为 `Type` 将绑定到 `number`。这允许我们使用泛型类型变量 `Type` 作为正在处理的类型的一部分，而不是完整的类型，从而提供了更大的灵活性。

另外，我们也可以用这种方式编写示例：

```typescript
function loggingIdentity<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length); // Array has a .length, so no more error
  return arg;
}
```

你可能已经从其他语言中熟悉了这种类型的风格。在下一节中，我们将介绍如何创建自己的泛型类型，如 `Array<Type>`。

## Generic Types - 泛型类型

在前几节中，我们创建了适用于一系列类型的泛型特性函数。在本节中，我们将探讨函数本身的类型以及如何创建泛型接口。

泛型函数的类型与非泛型函数的类型一样，首先列出类型形参，类似于函数声明：

```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;
```

我们还可以为类型中的泛型类型形参使用不同的名称，只要类型变量的数量和类型变量的使用方式一致。

```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;
```

我们还可以像对象字面量类型的调用签名一样编写泛型类型：

```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: { <Type>(arg: Type): Type } = identity;
```

这指引我们编写第一个泛型接口。让我们从前面的例子中获取对象字面量，并将其移到一个接口：

```typescript
interface GenericIdentityFn {
  <Type>(arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

在类似的示例中，我们可能想要将泛型形参移动为整个接口的形参。这可以让我们看到我们对哪些类型进行泛型 (例如 `Dictionary<string>` 而不是 `Dictionary`)。这使得类型形参对接口的所有其他成员可见。

```typescript
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

注意，我们的示例发生了一些细微的变化。我们现在不再描述泛型函数，而是使用作为泛型类型一部分的非泛型函数签名。当我们使用 `GenericIdentityFn` 时，我们现在还需要指定相应的类型实参 (这里是 `number`)，有效地锁定底层调用签名将使用的内容。理解何时将类型形参直接放在调用签名上，何时将它放在接口本身上，将有助于描述类型的哪些方面是泛型的。

除了泛型接口外，我们还可以创建泛型类。注意，不可能创建泛型枚举和名称空间。

## Generic Classes - 泛型类

泛型类的形状与泛型接口类似。泛型类在类名后面的尖括号 (`<>`) 中有一个泛型类型形参列表。

```typescript
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

这是对 `GenericNumber` 类非常实际的使用，但你可能已经注意到，没有任何事物限制它只使用 `number` 类型。相反，我们可以使用 `string` 或更复杂的对象。

```typescript
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

与接口一样，将类型形参放在类本身上可以确保类的所有属性都使用相同的类型。

正如我们在 [关于类的部分](https://www.typescriptlang.org/docs/handbook/2/classes.html) 中所讨论的，类的类型有两个方面：静态方面和实例方面。泛型类只在其实例方面泛型，而不是在其静态方面泛型，因此在使用类时，静态成员不能使用类的类型形参。

## Generic Constraints - 泛型约束

如果你还记得前面的例子，你有时可能想要编写一个泛型函数，用于处理一组类型，并且你对这组类型将具有哪些功能有一定的了解。在我们的 `loggingIdentity` 示例中，我们希望能够访问 `arg` 的 `.length` 属性，但编译器无法证明每种类型都有 `.length` 属性，因此它警告我们不能这样做。

```typescript
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // 类型“Type”上不存在属性“length”。
  return arg;
}
```

我们想要将此函数约束为处理具有 `.length` 属性的任何所有类型，而不是处理任何所有类型。只要类型有这个成员，我们就允许它，但它必须至少有这个成员。要做到这一点，我们必须列出我们的必要条件作为 `Type` 可以是什么的约束。

为此，我们将创建一个描述约束的接口。在这里，我们将创建一个具有单个 `.length` 属性的接口，然后使用该接口以及 `extends` 关键字来表示我们的约束：

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

由于泛型函数现在受到了约束，它将不再适用于任何所有类型。

```typescript
loggingIdentity(3); // 类型“number”的参数不能赋给类型“Lengthwise”的参数。
```

相反，我们需要传入具有所有必需属性的类型的值：

```typescript
loggingIdentity({ length: 10, value: 3 });
```

## Using Type Parameters in Generic Constraints - 在泛型约束中使用类型形参

你可以由另一个类型形参约束来声明一个类型形参。例如，在这里，我们希望从给定名称的对象中获取一个属性。我们希望确保不会意外地获取一个在 `obj` 上不存在的属性，因此我们将在这两种类型之间设置一个约束：

```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m"); // 类型“"m"”的参数不能赋给类型“"a" | "b" | "c" | "d"”的参数。
```

## Using Class Types in Generics - 在泛型中使用 Class 类型

当使用泛型在 TypeScript 中创建工厂时，有必要通过 class 的构造函数来引用 class 类型。例如：

```typescript
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

一个更高级的示例使用 prototype 属性来推断和约束构造函数和 class 类型的实例方面之间的关系。

```typescript
class BeeKeeper {
  hasMask: boolean = true;
}

class ZooKeeper {
  nametag: string = "Mikle";
}

class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```

此模式用于增强 [mixins](https://www.typescriptlang.org/docs/handbook/mixins.html) 设计模式。
