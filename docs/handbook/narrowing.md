# Narrowing

假设我们有一个函数叫做 `padLeft`。

```typescript
function padLeft(padding: number | string, input: string): string {
  throw new Error("Not implemented yet!");
}
```

如果 `padding` 是一个 `number`，它将其视为我们想要添加到 `input` 前的空格数。如果 `padding` 是一个 `string`，它应该在 `input` 前加上 `padding`。让我们尝试实现当 `padLeft` 被传递一个 `number` 作为 `padding` 时的逻辑。

```typescript
function padLeft(padding: number | string, input: string) {
  return " ".repeat(padding) + input;
  // 类型“string | number”的参数不能赋给类型“number”的参数。
  //  不能将类型“string”分配给类型“number”。
}
```

哦，我们在 `padding` 上出现了一个错误。TypeScript 警告我们，向 `number` 中添加一个 `number | string` 可能不会得到我们想要的结果，这是正确的。换句话说，我们没有显式地检查 `padding` 是否首先是一个 `number`，也没有处理它是一个 `string` 的情况，所以让我们这样做。

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

如果这看起来像是无趣的 JavaScript 代码，这就是问题所在。除了我们放置的注释之外，这个 TypeScript 代码看起来像 JavaScript。TypeScript 的类型系统的目的是让编写典型的 JavaScript 代码尽可能简单，而不必为了获得类型安全而绞尽脑汁。

虽然它可能看起来不多，但实际上有很多发生在幕后。就像 TypeScript 使用静态类型分析运行时值一样，它在 JavaScript 的运行时控制流构造上覆盖了类型分析，例如 `if/else`、条件三元组、循环、真实性检查等，都可能影响这些类型。

在 `if` 检查中，TypeScript 看到 `typeof padding === "number"`，并将其理解为一种称为类型守卫的特殊形式的代码。TypeScript 遵循我们的程序可能的执行路径来分析给定位置上的值的最具体的可能类型。它查看这些特有的检查 (称为类型守卫) 和赋值，将类型细化为比声明的类型更具体的过程称为窄化。在许多编辑器中，我们可以观察到这些变化，在我们的例子中我们也会这样做。

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input; // (parameter) padding: number
  }
  return padding + input; // (parameter) padding: string
}
```

对于窄化，TypeScript 理解几种不同的结构。

## `typeof` type guards - `typeof` 类型守卫

正如我们所看到的，JavaScript 支持 `typeof` 操作符，它可以提供关于运行时值的类型非常基本的信息。TypeScript 预计返回一组特定的字符串：

- `"string"`
- `"number"`
- `"bigint"`
- `"boolean"`
- `"symbol"`
- `"undefined"`
- `"object"`
- `"function"`

就像我们看到的 `padLeft` 一样，这个操作符经常出现在许多 JavaScript 库中，TypeScript 可以理解它用来窄化不同分支中的类型。

在 TypeScript 中，检查 `typeof` 返回的值是类型守卫。因为 TypeScript 编码了 `typeof` 对不同值的操作，所以它知道它在 JavaScript 中的一些怪僻之处。例如，注意在上面的列表中，`typeof` 不返回字符串 `null`。看看下面的示例：

```typescript
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    for (const s of strs) {
      // 对象可能为 "null"。
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    // do nothing
  }
}
```

在 `printAll` 函数中，我们尝试检查 `strs` 是否是一个对象，以确定它是否是数组类型 (现在是时候强调数组是 JavaScript 中的对象类型了)。但事实证明，在 JavaScript 中，`typeof null` 实际上是 `“object”`！这是历史上不幸的偶然事件之一。

有足够经验的用户可能不会感到惊讶，但并不是每个人都在 JavaScript 中遇到过这种情况；幸运的是，TypeScript 让我们知道 `strs` 只被缩小到 `string[] | null` 而不是 `string[]`。

这可能是我们所谓的 "Truthiness" 检查的一个很好的过渡。

## Truthiness narrowing - Truthiness 窄化

你可能在字典里找不到 Truthiness 这个词，但这是你在 JavaScript 中经常会听到的。

在 JavaScript 中，我们可以在条件语句中使用任何表达式，`&&`、`||`、`if` 语句，布尔否定 (`!`)，等等。例如，`if` 语句并不要求它们的条件总是具有 `boolean` 类型。

```typescript
function getUsersOnlineMessage(numUsersOnline: number) {
  if (numUsersOnline) {
    return `There are ${numUsersOnline} online now!`;
  }
  return "Nobody's here. :(";
}
```

在 JavaScript 中，像 `if` 这样的结构首先将它们的条件 "强制" 为布尔值，以使它们有意义，然后根据结果是 `true` 还是 `false` 选择它们的分支。值像是：

- `0`
- `NaN`
- `""` (空字符串)
- `0n` (`bigint` 版本的零)
- `null`
- `undefined`

所有强制为 `false`，其他值强制为 `true`。你可以通过 `Boolean` 函数或使用更短的双布尔否定来将值总是强制转换为 `boolean`。(后者的优点是，TypeScript 推断一个窄化的字面量布尔类型为 `true`，而推断第一个为 `boolean` 类型。)

```typescript
// both of these result in 'true'
Boolean("hello"); // type: boolean, value: true
!!"world"; // type: true,    value: true
```

利用这种行为是相当流行的，特别是在防止 `null` 或 `undefined` 等值时。作为示例，让我们试着在 `printAll` 函数中使用它。

```typescript
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  }
}
```

你会注意到，通过检查 `strs` 是否为真，我们已经消除了上面的错误。这至少可以防止我们在运行代码时出现可怕的错误，比如：

```
TypeError: null is not iterable
```

请记住，对原始类型的真实性检查通常容易出错。作为示例，考虑编写 `printAll` 的不同尝试：

```typescript
function printAll(strs: string | string[] | null) {
  // !!!!!!!!!!!!!!!!
  //  DON'T DO THIS!
  //   KEEP READING
  // !!!!!!!!!!!!!!!!
  if (strs) {
    if (typeof strs === "object") {
      for (const s of strs) {
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
    }
  }
}
```

我们将整个函数体包装在一个真实性检查中，但这有一个微妙的缺点：我们可能不再正确处理空字符串的情况。

TypeScript 在这里完全不会损害到我们，但是如果你不太熟悉 JavaScript，那么这种行为值得注意。TypeScript 通常可以帮助你在早期发现错误，但如果你选择对一个值不做任何操作，那么在不过度规定性的情况下，它只能做这么多事情。如果你愿意，你可以确保你处理这种情况。

最后说一句，truthiness 窄化是通过 `!` 布尔否定从否定的分支中过滤。

```typescript
function multiplyAll(
  values: number[] | undefined,
  factor: number
): number[] | undefined {
  if (!values) {
    return values;
  } else {
    return values.map((x) => x * factor);
  }
}
```

## Equality narrowing - 相等窄化

TypeScript 还使用 `switch` 语句和相等检查像是 `===`、`!==`、`==` 和 `!=` 等来窄化类型。例如：

```typescript
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // We can now call any 'string' method on 'x' or 'y'.
    x.toUpperCase();
    // (method) String.toUpperCase(): string
    y.toLowerCase();
    // (method) String.toLowerCase(): string
  } else {
    console.log(x);
    // (parameter) x: string | number
    console.log(y);
    // (parameter) y: string | boolean
  }
}
```

当我们在上面的例子中检查 `x` 和 `y` 是否相等时，TypeScript 知道它们的类型也必须相等。因为 `string` 是 `x` 和 `y` 都可以采用的唯一通用类型，所以在第一个分支中 TypeScript 知道 `x` 和 `y` 必须是 `string`。

检查特定的字面量 (而不是变量) 也可以。在关于 truthiness 窄化的部分中，我们编写了一个容易出错的 `printAll` 函数，因为它意外地不能正确处理空字符串。相反，我们可以做一个特定的检查来屏蔽 `null`，TypeScript 仍然正确地从 `strs` 类型中删除 `null`。

```typescript
function printAll(strs: string | string[] | null) {
  if (strs !== null) {
    if (typeof strs === "object") {
      for (const s of strs) {
        // (parameter) strs: string[]
        console.log(s);
      }
    } else if (typeof strs === "string") {
      console.log(strs);
      // (parameter) strs: string
    }
  }
}
```

JavaScript 宽松的相等检查 `==` 和 `!=` 也被正确窄化。如果你不熟悉，检查 `something == null` 实际上不仅检查它是否是特定的值 `null` - 它还检查它是否是潜在的 `undefined`。这同样适用于 `== undefined`：它检查一个值是 `null` 还是 `undefined`。

```typescript
interface Container {
  value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
  // Remove both 'null' and 'undefined' from the type.
  if (container.value != null) {
    console.log(container.value);
    // (property) Container.value: number

    // Now we can safely multiply 'container.value'.
    container.value *= factor;
  }
}
```

## The `in` operator narrowing - `in` 操纵符窄化

JavaScript 有一个操作符来确定对象是否具有某个名称的属性：`in` 操作符。TypeScript 考虑了这一点，将其作为一种窄化潜在类型的方法。

例如，用代码：`"value" in x`，`"value"` 是一个字符串字面量，`x` 是一个联合类型。"true" 分支窄化到具有可选或必选属性 `value` 的 `x` 的类型，以及 "false" 分支窄化到具有可选或缺失属性 `value` 的类型。

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

重复可选属性将存在于窄化的两侧，例如，一个人既能游泳又能飞 (如果有合适的装备)，因此应该出现在检查的两边：

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    animal;
    // (parameter) animal: Fish | Human
  } else {
    animal;
    // (parameter) animal: Bird | Human
  }
}
```

## `instanceof` narrowing - `instanceof` 窄化

JavaScript 有一个操作符，用于检查一个值是否是另一个值的 "实例"。更具体地说，在 JavaScript 中，`x instanceof Foo` 检查 `x` 的原型链是否包含 `Foo.prototype`。虽然我们在这里不会深入研究，并且在进入类时你将看到更多这方面的内容，但它们对于大多数可以用 `new` 构造的值仍然是有用的。正如你可能已经猜到的，`instanceof` 也是一个类型守卫，TypeScript 在由 `instanceof` 守卫的分支中窄化。

```typescript
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
    // (parameter) x: Date
  } else {
    console.log(x.toUpperCase());
    // (parameter) x: string
  }
}
```

## Assignments - 赋值

正如我们前面提到的，当我们给任何变量赋值时，TypeScript 会查看赋值的右边，并适当窄化左边的范围。

```typescript
let x = Math.random() < 0.5 ? 10 : "hello world!"; // let x: string | number

x = 1;
console.log(x); // let x: number

x = "goodbye!";
console.log(x); // let x: string
```

注意，这些赋值都是有效的。即使在第一次赋值后，观察到的 `x` 类型更改为 `number`，我们仍然能够将 `string` 赋值给 `x`。这是因为 `x` 的声明类型 - `x`开头的类型 - 是 `string | number`，并且可赋值性总是根据声明的类型进行检查。

如果我们将 `boolean` 赋值给 `x`，我们会看到一个错误，因为它不是声明类型的一部分。

```typescript
let x = Math.random() < 0.5 ? 10 : "hello world!"; // let x: string | number

x = 1;
console.log(x); // let x: number

x = true; // Type 'boolean' is not assignable to type 'string | number'.
console.log(x); // let x: string | number
```

## Control flow analysis - 控制流分析

到目前为止，我们已经了解了 TypeScript 如何在特定分支中窄化范围的一些基本示例。但是，除了从每个变量中查找 `if`、`while`、条件语句等类型守卫之外，还有更多的事情要做。例如：

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

`padLeft` 从它的第一个 `if` 块中返回。TypeScript 能够分析这段代码，并看到正文的其余部分 (`return padding + input;`) 在 `padding` 为 `number` 的情况下是不可达的。因此，它能够从 `padding` 的类型中删除 `number` (从 `string | number` 窄化到 `string`)，以完成函数的其余部分。

这种基于可达性的代码分析被称为控制流分析，TypeScript 在遇到类型守卫和赋值时使用这种流分析来窄化类型。当分析一个变量时，控制流可以一次又一次地分离和重新合并，并且可以观察到该变量在每个点上具有不同的类型。

```typescript
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;

  console.log(x); // let x: boolean

  if (Math.random() < 0.5) {
    x = "hello";
    console.log(x); // let x: string
  } else {
    x = 100;
    console.log(x); // let x: number
  }

  return x; // let x: string | number
}
```

## Using type predicates - 使用类型谓语

到目前为止，我们已经使用现有的 JavaScript 构造来处理窄化，然而，有时你希望更直接地控制整个代码中类型的更改方式。

要定义一个用户定义的类型守护，我们只需定义一个返回类型为类型谓词的函数。

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

`pet is Fish` 是本例中的类型谓词。谓词采用 `parameterName is Type` 的形式，其中 `parameterName` 必须是来自当前函数签名的形参的名称。

每当 `isFish` 与某个变量一起被调用时，如果原始类型是兼容的，TypeScript 会将该变量窄化到特定的类型。

```typescript
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

注意，TypeScript 不仅知道 `if` 分支中的 `pet` 是 `Fish`；它还知道在 `else` 分支中，你没有 `Fish`，那么你一定有 `Bird`。

你可以使用类型守卫 `isFish` 来过滤一个 `Fish | Bird` 数组，并获得一个 `Fish` 数组：

```typescript
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
  if (pet.name === "sharkey") return false;
  return isFish(pet);
});
```

此外，类可以 [使用 `this is Type`](https://www.typescriptlang.org/docs/handbook/2/classes.html#this-based-type-guards) 来窄化它们的类型。

## Discriminated unions - 辨别联合

到目前为止，我们看到的大多数示例都集中在使用简单类型 (如 `string`、`boolean` 和 `number`) 窄化单个变量。虽然这很常见，但在 JavaScript 中，大多数时候我们要处理稍微复杂一点的结构。

为了获得一些动机，让我们想象我们正在尝试对圆形和正方形等形状进行编码。圆表示半径，正方形表示边长。我们将使用一个名为 `kind` 的字段来告诉我们正在处理的是哪个形状。这是定义 `Shape` 的第一次尝试。

```typescript
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

注意，我们使用了字符串字面量类型的并集：`"circle"` 和 `"square"` 来告诉我们应该分别将形状视为圆形还是方形。通过使用 `“circle” | “square”` 而不是 `string`，我们可以避免拼写错误问题。

```typescript
function handleShape(shape: Shape) {
  // oops!
  if (shape.kind === "rect") {
    // 此条件将始终返回 "false"，因为类型 ""circle" | "square"" 和 ""rect"" 没有重叠。
    // ...
  }
}
```

我们可以编写一个 `getArea` 函数，根据它处理的是圆还是正方形应用正确的逻辑。我们首先尝试处理圆。

```typescript
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
  // 对象可能为“未定义”。
}
```

在 [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) 下，这会给我们一个错误 - 这是合适的，因为 `radius` 可能没有定义。但是如果我们对 `kind` 属性执行适当的检查呢？

```typescript
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // 对象可能为“未定义”。
  }
}
```

嗯，TypeScript 仍然不知道在这里做什么。我们已经到达了一个点，我们比类型检查器更了解我们的值。我们可以尝试使用非空断言 (`!` 在 `shape.radius` 之后) 表示半径肯定是存在的。

```typescript
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius! ** 2;
  }
}
```

但这感觉并不理想。我们不得不用那些非空断言 (`!`) 向类型检查器大喊一声，让它相信这个 `shape.radius` 的定义，但是如果我们开始移动代码，这些断言很容易出错。此外，在 strictNullChecks 之外，我们能够意外地访问这些字段中的任何一个 (因为可选属性只是假设在读取它们时总是存在)。我们肯定可以做得更好。

这种 `Shape` 编码的问题是类型检查器没有任何方法根据 `kind` 属性知道是否存在 `radius` 或 `sideLength`。我们需要将我们知道的信息传递给类型检查器。考虑到这一点，让我们再次尝试定义 `Shape`。

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

在这里，我们正确地将 `Shape` 分离为两种类型，它们的 `kind` 属性值不同，但 `radius` 和 `sideLength` 在它们各自的类型中被声明为必需的属性。

让我们看看当我们尝试访问一个 `Shape` 的 `radius` 时会发生什么。

```typescript
function getArea(shape: Shape) {
  return Math.PI * shape.radius ** 2;
  // 类型“Shape”上不存在属性“radius”。
  //  类型“Square”上不存在属性“radius”。
}
```

就像我们对 `Shape` 的第一个定义一样，这仍然是一个错误。当 `radius` 为可选时，我们会得到一个错误 (启用 strictNullChecks)，因为 TypeScript 无法判断该属性是否存在。现在 `Shape` 是一个并集，TypeScript 告诉我们 `Shape` 可能是一个 `Square`，而 `Square` 上没有定义 `radius`！两种解释都是正确的，但是只有 `Shape` 的联合编码会导致错误，无论 strictNullChecks 如何配置。

但如果我们再次检查 `kind` 属性呢？

```typescript
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
    // (parameter) shape: Circle
  }
}
```

这样就消除了错误！当联合中的每个类型都包含一个带有字面量类型的公共属性时，TypeScript 会认为这是一个有区别的联合，并可以窄化联合的成员范围。

在这种情况下，`kind` 是公共属性 (被认为是 `Shape` 的辨别属性)。检查 `kind` 属性是否为 `“circle”` 可以去掉 `Shape` 中所有没有 `“circle”` 类型的 `kind` 属性的类型。把形状窄化为 `Circle`。

同样的检查也适用于 `switch` 语句。现在我们可以尝试编写完整的 `getArea` 而不需要任何麻烦的 `!` 非空的断言。

```typescript
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    // (parameter) shape: Circle
    case "square":
      return shape.sideLength ** 2;
    // (parameter) shape: Square
  }
}
```

这里最重要的是对 `Shape` 的编码。向 TypeScript 传递正确的信息 - `Circle` 和 `Square` 实际上是两种具有特定的 `kind` 字段的独立类型 - 是至关重要的。这样做可以让我们编写类型安全的 TypeScript 代码，看起来与我们本来编写的 JavaScript 没有什么不同。从那里开始，类型系统能够做 "正确的" 事情，并找出 `switch` 语句的每个分支中的类型。

> 作为题外话，请尝试一下上面的示例并删除一些返回关键字。你将看到，类型检查可以帮助避免在 switch 语句中意外地错误穿过不同的子句时的 bug。

辨别联合的用途不仅仅是讨论圆形和正方形。它们很适合在 JavaScript 表示任何类型的消息传递方案，比如通过网络发送消息 (client/server 通信)，或者在状态管理框架中编码变化。

## The `never` type - `never` 类型

在窄化时，你可以将联合的选项减少到删除所有可能性且什么都不剩下的程度。在这些情况下，TypeScript 会使用 `never` 类型来表示不应该存在的状态。

### Exhaustiveness checking 穷尽性检查

`never` 类型可赋值给所有类型；但是，没有类型可以赋值给 `never` (除了 `never` 本身)。这意味着你可以在 `switch` 语句中使用窄化并依赖于永不出现来执行详尽的检查。

例如，向 `getArea` 函数添加一个 `default`，它试图将形状分配给 `never`，当所有可能的情况都没有处理时，将会引发错误。

```typescript
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

向 `Shape` 联合中添加新成员将导致 TypeScript 错误：

```typescript
interface Triangle {
  kind: "triangle";
  sideLength: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      // 不能将类型“Triangle”分配给类型“never”。
      return _exhaustiveCheck;
  }
}
```
