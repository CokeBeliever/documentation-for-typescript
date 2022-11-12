# Object Types

在 JavaScript 中，我们对数据进行分组和传递的基本方式是通过对象。在 TypeScript 中，我们通过对象类型来表示它们。

正如我们所见，它们可以是匿名的：

```typescript
function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}
```

也可以通过使用接口来命名它们：

```typescript
interface Person {
  name: string;
  age: number;
}

function greet(person: Person) {
  return "Hello " + person.name;
}
```

或者类型别名。

```typescript
type Person = {
  name: string;
  age: number;
};

function greet(person: Person) {
  return "Hello " + person.name;
}
```

在上面的三个例子中，我们编写了接受包含属性 `name` (必须是 `string`) 和 `age`(必须是 `number`) 的对象的函数。

## Property Modifiers - 属性修饰符

对象类型中的每个属性都可以指定一些事物：类型、属性是否可选以及属性是否可写。

### Optional Properties - 可选属性

很多时候，我们会发现自己在处理可能具有属性集的对象。在这些情况下，我们可以通过在这些属性的名称后面添加问号 (`?`) 来将这些属性标记为可选的。

```typescript
interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  // ...
}

const shape = getShape();
paintShape({ shape });
paintShape({ shape, xPos: 100 });
paintShape({ shape, yPos: 100 });
paintShape({ shape, xPos: 100, yPos: 100 });
```

在本例中，`xPos` 和 `yPos` 都视为可选的。我们可以选择提供它们中的任何一个，因此上面对 `paintShape` 的每次调用都是有效的。所有的可选性实际上是说，如果设置了属性，它最好具有特定的类型。

我们也可以从这些属性中读取 - 但是当我们在 [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) 下读取时，TypeScript 会告诉我们它们可能是 `undefined`。

```typescript
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos; // (property) PaintOptions.xPos?: number | undefined
  let yPos = opts.yPos; // (property) PaintOptions.yPos?: number | undefined
  // ...
}
```

在 JavaScript 中，即使属性从未设置，我们仍然可以访问它 - 它只会给我们 `undefined` 值。我们应该专门处理 `undefined`。

```typescript
function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos === undefined ? 0 : opts.xPos;
  // let xPos: number
  let yPos = opts.yPos === undefined ? 0 : opts.yPos;
  // let yPos: number
  // ...
}
```

注意，这种为未指定值设置默认值的模式非常常见，JavaScript 有语法来支持它。

```typescript
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log("x coordinate at", xPos); // (parameter) xPos: number
  console.log("y coordinate at", yPos); // (parameter) yPos: number
  // ...
}
```

这里我们对 `paintShape` 的形参使用了 [解构模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)，并且为 `xPos` 和 `yPos` 提供 [默认值](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Default_values)。现在 `xPos` 和 `yPos` 都明确地出现在 `paintShape` 的方法体中，但对于 `paintShape` 的任何调用者来说都是可选的。

注意，目前没有办法在解构模式中放置类型注释。这是因为下面的语法在 JavaScript 中已经有了不同的含义。

```typescript
function draw({ shape: Shape, xPos: number = 100 /*...*/ }) {
  render(shape);
  // 找不到名称“shape”。你是否指的是“Shape”?
  render(xPos);
  // 找不到名称“xPos”。
}
```

在对象的解构模式中，`shape: Shape` 意味着 "获取属性 `shape` 并在本地将其重新定义为名为 `Shape` 的变量"。同样，`xPos: number` 创建一个名为 `number` 的变量，其值基于形参 `xPos`。

使用 [映射修饰符](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers)，你可以删除 `optional` 属性。

### `readonly` Properties - `readonly` 属性

对于 TypeScript，属性也可以被标记为 `readonly`。虽然它不会在运行时改变任何行为，但标记为 `readonly` 的属性不能在类型检查期间写入。

```typescript
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  // We can read from 'obj.prop'.
  console.log(`prop has the value '${obj.prop}'.`);

  // But we can't re-assign it.
  obj.prop = "hello";
  // 无法分配到 "prop" ，因为它是只读属性。
}
```

使用 `readonly` 修饰符并不一定意味着值是完全不可变的 - 换句话说，它的内部内容不能改变。它只是意味着属性本身不能被重写。

```typescript
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // We can read and update properties from 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}!`);
  home.resident.age++;
}

function evict(home: Home) {
  // But we can't write to the 'resident' property itself on a 'Home'.
  home.resident = {
    // 无法分配到 "resident" ，因为它是只读属性。
    name: "Victor the Evictor",
    age: 42,
  };
}
```

管理对 `readonly` 含义的预期是很重要的。在 TypeScript 的开发过程中，对应该如何使用对象向意图标志是很有用的。TypeScript 在检查两种类型是否兼容时，不会考虑这两种类型的属性是否是只读的，所以 `readonly` 属性也可以通过混叠改变。

```typescript
interface Person {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person = {
  name: "Person McPersonface",
  age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'
```

使用 [映射修饰符](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers)，可以删除 `readonly` 属性。

### Index Signatures - 索引签名

有时，你无法提前知道类型属性的所有名称，但你知道值的形状。

在这些情况下，你可以使用索引签名来描述可能值的类型，例如：

```typescript
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = getStringArray();
const secondItem = myArray[1]; // const secondItem: string
```

在上面，我们有一个 `StringArray` 接口，它有一个索引签名。这个索引签名声明当 `StringArray` 用一个 `number` 建立索引时，它将返回一个 `string`。

索引签名属性类型必须是 `string` 或 `number`。

**可以同时支持两种类型的索引器 ...**

可以同时支持两种类型的索引器，但是从数值索引器返回的类型必须是从字符串索引器返回的类型的子类型。这是因为当索引一个 `number` 时，JavaScript 实际上会在索引对象之前将其转换为 `string`。这意味着索引 `100` (`number`) 和索引 `"100"` (`string`) 是一样的，因此两者需要保持一致。

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
  [x: number]: Animal;
  // “number”索引类型“Animal”不能分配给“string”索引类型“Dog”。
  [x: string]: Dog;
}
```

---

虽然字符串索引签名是描述 "字典" 模式的一种强大方法，但它们还强制所有属性都匹配其返回类型。这是因为字符串索引声明 `obj.property` 也可作为 `obj["property"]`。在以下示例中，`name` 的类型与字符串索引的类型不匹配，类型检查器给出一个错误：

```typescript
interface NumberDictionary {
  [index: string]: number;

  length: number; // ok
  name: string;
  // 类型“string”的属性“name”不能赋给“string”索引类型“number”。
}
```

但是，如果索引签名是属性类型的联合，则可以接受不同类型的属性：

```typescript
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

最后，你可以使索引签名为 `readonly`，以防止对其索引进行赋值：

```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

let myArray: ReadonlyStringArray = getReadOnlyStringArray();
myArray[2] = "Mallory"; // 类型“ReadonlyStringArray”中的索引签名仅允许读取。
```

因为索引签名是 `readonly`，所以不能设置 `myArray[2]`。

## Extending Types - 扩展类型

通常情况下，类型可能是其他类型的更特定版本。例如，我们可能有一个 `BasicAddress` 类型，它描述在美国发送信件和包裹所需的字段。

```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

在某些情况下，这就足够了，但如果一个地址有多个单元，地址通常会有一个单元号，我们可以描述一个 `AddressWithUnit`。

```typescript
interface AddressWithUnit {
  name?: string;
  unit: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}
```

这可以完成工作，但缺点是，当我们的更改纯粹是附加的时候，我们必须重复 `BasicAddress` 中的所有其他字段。相反，我们可以扩展原始的 `BasicAddress` 类型，只添加 `AddressWithUnit` 唯一的新字段。

```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

`interface` 上的 `extends` 关键字允许我们有效地从其他已命名类型复制成员，以及添加我们想要的任何新成员。这对于减少我们必须编写的类型声明样板的数量非常有用，对于表明相同属性的几个不同声明可能是相关的意图非常有用。例如，`AddressWithUnit` 不需要重复 `street` 属性，因为 `street` 源于 `BasicAddress`，因此读者会知道这两种类型在某种程度上是相关的。

`interface` 还可以从多种类型扩展。

```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

## Intersection Types - 交集类型

`interface` 允许我们通过扩展其他类型来构建新的类型。TypeScript 提供了另一种称为交集类型的结构，主要用于组合现有的对象类型。

使用 `&` 操作符定义交集类型。

```typescript
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

在这里，我们将 `“Colorful”` 和 `“Circle”` 交集，生成了 `“Colorful”` 和 `“Circle”` 的所有成员的新类型。

```typescript
function draw(circle: Colorful & Circle) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

// okay
draw({ color: "blue", radius: 42 });

// oops
draw({ color: "red", raidus: 42 });
// 类型“{ color: string; raidus: number; }”的参数不能赋给类型“Colorful & Circle”的参数。
//   对象文字只能指定已知的属性，但“raidus”中不存在类型“Colorful & Circle”。是否要写入 radius?
```

## Interfaces vs. Intersections - 接口 vs. 交集

我们刚刚研究了两种组合类型的方法，它们相似，但实际上略有不同。对于接口，我们可以使用 `extends` 子句从其他类型进行扩展，并且我们能够对交集进行类似的操作，并使用类型别名为结果命名。两者之间的主要区别在于如何处理冲突，而这种差异通常是你在接口和交集类型的类型别名之间选择其中一个的主要原因之一。

## Generic Object Types - 泛型对象类型

让我们想象一个可以包含任何值的 `Box` 类型 - `string`、`number`、`Giraffe` 等等。

```typescript
interface Box {
  contents: any;
}
```

现在，`contents` 属性的类型是 `any`，这是可行的，但可能会导致后续的事故。

我们可以使用 `unknown`，但这意味着在我们已经知道 `contents` 类型的情况下，我们需要进行预防性检查，或是使用易出错的类型断言。

```typescript
interface Box {
  contents: unknown;
}

let x: Box = {
  contents: "hello world",
};

// we could check 'x.contents'
if (typeof x.contents === "string") {
  console.log(x.contents.toLowerCase());
}

// or we could use a type assertion
console.log((x.contents as string).toLowerCase());
```

一种类型安全的方法是为每种类型的 `contents` 构建不同的 `Box` 类型。

```typescript
interface NumberBox {
  contents: number;
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean;
}
```

但这意味着我们必须创造不同的函数或函数重载，以对这些类型进行操作。

```typescript
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents;
}
```

那是很多的样板。此外，我们以后可能需要引入新的类型和重载。这很令人沮丧，因为我们的 box 类型和重载实际上都是一样的。

相反，我们可以创建声明一个类型形参的泛型 `Box` 类型。

```typescript
interface Box<Type> {
  contents: Type;
}
```

你可能会把它理解为 “`Type` 的 `Box`，即 `contents` 类型为 `Type` 的事物”。之后，当我们引用 `Box` 时，我们必须给出一个类型实参来代替 `Type`。

```typescript
let box: Box<string>;
```

可以把 `Box` 看作是实际类型的模板，其中 `Type` 是一个占位符，将被其他类型替换。当 TypeScript 看到 `Box<string>` 时，它将用 `string` 替换 `Box<Type>` 中的 `Type` 的每个实例，并最终使用类似 `{ contents: string }` 的事物。换句话说，`Box<string>` 和我们前面的 `StringBox` 的工作原理是相同的。

```typescript
interface Box<Type> {
  contents: Type;
}
interface StringBox {
  contents: string;
}

let boxA: Box<string> = { contents: "hello" };
boxA.contents; // (property) Box<string>.contents: string

let boxB: StringBox = { contents: "world" };
boxB.contents; // (property) StringBox.contents: string
```

`Box` 是可重用的，因为 `Type` 可以用任何事物替换。这意味着，当我们需要一个用于新类型的 `Box` 时，我们根本不需要声明一个新的 `Box` 类型 (当然，如果我们愿意，我们当然可以这样做)。

```typescript
interface Box<Type> {
  contents: Type;
}

interface Apple {
  // ....
}

// Same as '{ contents: Apple }'.
type AppleBox = Box<Apple>;
```

这也意味着我们可以通过使用 [泛型函数](https://www.typescriptlang.org/docs/handbook/2/functions.html#generic-functions) 来完全避免重载。

```typescript
function setContents<Type>(box: Box<Type>, newContents: Type) {
  box.contents = newContents;
}
```

值得注意的是，类型别名也可以是泛型的。我们可以定义新的 `Box<Type>` 接口，它是：

```typescript
interface Box<Type> {
  contents: Type;
}
```

通过使用类型别名来代替：

```typescript
type Box<Type> = {
  contents: Type;
};
```

由于类型别名与接口不同，它不仅可以描述对象类型，我们还可以使用它们编写其他种类的泛型帮助器类型。

```typescript
type OrNull<Type> = Type | null;

type OneOrMany<Type> = Type | Type[];

type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
// type OneOrManyOrNull<Type> = OneOrMany<Type> | null

type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
// type OneOrManyOrNullStrings = OneOrMany<string> | null
```

我们稍后将回到类型别名的问题上。

## The `Array` Type

泛型对象类型通常是某种容器类型，独立于它们所包含的元素类型工作。数据结构以这种方式工作是理想的，这样它们就可以跨不同的数据类型重用。

在这本手册中，我们一直在使用这样的类型：`Array` 类型。每当我们写出像 `number[]` 或 `string[]` 这样的类型时，那实际上只是 `Array<number>` 和 `Array<string>` 的速写。

```typescript
function doSomething(value: Array<string>) {
  // ...
}

let myArray: string[] = ["hello", "world"];

// either of these work!
doSomething(myArray);
doSomething(new Array("hello", "world"));
```

与上面的 `Box` 类型非常相似，`Array` 本身也是一个泛型类型。

```typescript
interface Array<Type> {
  /**
   * Gets or sets the length of the array.
   */
  length: number;

  /**
   * Removes the last element from an array and returns it.
   */
  pop(): Type | undefined;

  /**
   * Appends new elements to an array, and returns the new length of the array.
   */
  push(...items: Type[]): number;

  // ...
}
```

现代 JavaScript 还提供了其他通用的数据结构，比如 `Map<K, V>`、`Set<T>` 和 `Promise<T>`。这实际上意味着它们可以处理任何类型集合，因为 `Map`、`Set` 和 `Promise` 的行为。

## The `ReadonlyArray` Type

`ReadonlyArray` 是一种特殊类型，用于描述不应更改的数组。

```typescript
function doStuff(values: ReadonlyArray<string>) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...but we can't mutate 'values'.
  values.push("hello!");
  // 类型“readonly string[]”上不存在属性“push”。
}
```

非常像属性的 `readonly` 修饰符，它主要是一个我们可以用于意图的工具。当我们看到一个返回 `ReadonlyArrays` 的函数时，它告诉我们，我们根本不打算改变内容，以及当我们看到一个函数使用 `ReadonlyArrays` 时，它告诉我们，我们可以将任何数组传递给该函数，而不必担心它会改变其内容。

与 `Array` 不同的是，没有可以使用的 `ReadonlyArray` 构造函数。

```typescript
new ReadonlyArray("red", "green", "blue");
// “ReadonlyArray”仅表示类型，但在此处却作为值使用。
```

相反，我们可以将常规 `Array` 分配给 `ReadonlyArrays`。

```typescript
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

就像 TypeScript 用 `Type[]` 为 `Array<Type>` 提供了一个简写语法一样，它也用 `readonly Type[]` 为 `ReadonlyArray<Type>` 提供了一个简写语法。

```typescript
function doStuff(values: readonly string[]) {
  // We can read from 'values'...
  const copy = values.slice();
  console.log(`The first value is ${values[0]}`);

  // ...but we can't mutate 'values'.
  values.push("hello!");
  // 类型“readonly string[]”上不存在属性“push”。
}
```

最后要注意的一点是，与 `readonly` 属性修饰符不同，常规 `Array` 和 `ReadonlyArrays` 之间的可赋值性不是双向的。

```typescript
let x: readonly string[] = [];
let y: string[] = [];

x = y;
y = x;
// 类型 "readonly string[]" 为 "readonly"，不能分配给可变类型 "string[]"。
```

## Tuple Types - 元组类型

元组类型是另一种 `Array` 类型，它确切地知道它包含了多少个元素，以及在特定位置包含了哪些类型。

```typescript
type StringNumberPair = [string, number];
```

在这里，`StringNumberPair` 是 `string` 和 `number` 的元组类型。和 `ReadonlyArray` 一样，它在运行时没有表示，但对 TypeScript 很重要。对于类型系统，`StringNumberPair` 描述的是索引 `0` 包含 `string`；索引 `1` 包含 `number` 的数组。

```typescript
function doSomething(pair: [string, number]) {
  const a = pair[0]; // const a: string
  const b = pair[1]; // const b: number
  // ...
}

doSomething(["hello", 42]);
```

如果我们试图索引超过元素的数量，就会得到一个错误。

```typescript
function doSomething(pair: [string, number]) {
  // ...

  const c = pair[2];
  // 长度为 "2" 的元组类型 "[string, number]" 在索引 "2" 处没有元素。
}
```

我们也可以使用 JavaScript 的数组解构来 [解构元组](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)。

```typescript
function doSomething(stringHash: [string, number]) {
  const [inputString, hash] = stringHash;

  console.log(inputString); // const inputString: string

  console.log(hash); // const hash: number
}
```

> 元组类型在高度基于约定的 API 中非常有用，其中每个元素的含义都是 "明显的"。这使得我们在解构变量时可以灵活地命名它们。在上面的例子中，我们可以将元素 0 和 1 命名为我们想要的任何名称。
>
> 然而，因为不是每个用户都对显而易见的事物持有相同的看法，它可能值得重新考虑是否使用具有描述性属性名的对象对你的 API 更好。

除了那些长度检查，像这样的简单元组类型等价于声明特定索引属性的 `Array` 版本的类型，并使用数值字面量类型声明 `length`。

```typescript
interface StringNumberPair {
  // specialized properties
  length: 2;
  0: string;
  1: number;

  // Other 'Array<string | number>' members...
  slice(start?: number, end?: number): Array<string | number>;
}
```

你可能感兴趣的另一件事是，在元组可以通过写一个问号 (`?` 在元素类型后面)。可选的元组元素只能出现在末尾，也会影响 `length` 的类型。

```typescript
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord; // const z: number | undefined

  console.log(`Provided coordinates had ${coord.length} dimensions`);
  // (property) length: 2 | 3
}
```

元组也可以有 rest 元素，这些元素必须是一个数组/元组类型。

```typescript
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

- `Stringnumberboolean` 描述了一个元组，其前两个元素分别为 `string` 和 `number`，但后面可能有任意数量的 `boolean`。
- `StringBooleansNumber` 描述了一个元组，它的第一个元素是 `string`，然后是任意数量的 `boolean`，最后以 `number` 结尾。
- `BooleansStringNumber` 描述了一个元组，它的起始元素是任意数量的 `boolean`，以 `string` 和 `number` 结尾。

带有 rest 元素的元组没有固定的 "长度" - 它只是在不同的位置有一组众所周知的元素。

```typescript
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];
```

为什么可选元素和 rest 元素可能是有用的？它允许 TypeScript 将元组与形参列表对应起来。元组类型可以在 [rest 形参和实参中](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments) 使用，从而实现以下：

```typescript
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // ...
}
```

基本上相当于：

```typescript
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```

当你希望用一个 rest 形参接受数量可变的实参时，并且需要最小数量的元素，但又不想引入中间变量时，这非常方便。

## `readonly` Tuple Types - `readonly` 元组类型

关于元组类型的最后一点注意 - 元组类型有 `readonly` 变体，可以通过在它们前面插入 `readonly` 修饰符来指定 - 就像数组简写语法一样。

```typescript
function doSomething(pair: readonly [string, number]) {
  // ...
}
```

如你所料，TypeScript 不允许写入 `readonly` 元组的任何属性。

```typescript
function doSomething(pair: readonly [string, number]) {
  pair[0] = "hello!";
  // 无法分配到 "0" ，因为它是只读属性。
}
```

在大多数代码中，元组往往被创建并保持不变，因此，尽可能将类型注释为 `readonly` 元组是一种很好的默认做法。这一点也很重要，因为具有 `const` 断言的数组字面量将使用 `readonly` 元组类型进行推断。

```typescript
let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);
// 类型“readonly [3, 4]”的参数不能赋给类型“[number, number]”的参数。
//   类型 "readonly [3, 4]" 为 "readonly"，不能分配给可变类型 "[number, number]"。
```

在这里，`distanceFromOrigin` 从不修改它的元素，但期望一个可变的元组。由于 `point` 的类型被推断为 `readonly [3,4]`，它不能与 `[number, number]` 兼容，因为该类型不能保证 `point` 的元素不会发生改变。
