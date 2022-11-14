# Conditional Types

在大多数有用程序的核心，我们必须根据输入做出决策。JavaScript 程序也不例外，但是考虑到值可以很容易地进行自检，这些决策也是基于输入的类型。条件类型有助于描述输入和输出类型之间的关系。

```typescript
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
// type Example1 = number

type Example2 = RegExp extends Animal ? number : string;
// type Example2 = string
```

条件类型的形式在 JavaScript 中看起来有点像条件表达式 (`condition ? trueExpression : falseExpression`)：

```typescript
SomeType extends OtherType ? TrueType : FalseType;
```

当 `extends` 的左边的类型可以赋值给右边的类型时，你将获得第一个分支 ("true" 分支) 中的类型；否则，你将获得后一个分支 ("false" 分支) 中的类型。

从上面的例子中可以看出，条件类型可能没有马上的用处 - 我们可以告诉自己 `Dog extends Animal` 和是否选择 `number` 或 `string`！但是条件类型的强大之处在于与泛型一起使用它们。

例如，让我们由以下 `createLabel` 函数为例：

```typescript
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

`createLabel` 的重载描述了一个基于输入类型进行选择的 JavaScript 函数。注意以下几点：

1. 如果一个库必须在它的 API 中反复做出相同的选择，这就变得很麻烦。
2. 我们必须创建三个重载：当我们确定类型时，每种情况都有一个 (一个用于 `string`，一个用于`number`)，以及一个用于最一般的情况 (接受 `string | number`)。对于 `createLabel` 能够处理的每一个新类型，重载的数量都会呈指数增长。

相反，我们可以将该逻辑编码为条件类型：

```typescript
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

然后，我们可以使用该条件类型将重载简化为一个没有重载的函数。

```typescript
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript"); // let a: NameLabel

let b = createLabel(2.8); // let b: IdLabel

let c = createLabel(Math.random() ? "hello" : 42); // let c: NameLabel | IdLabel
```

## Conditional Type Constraints - 条件类型约束

通常，条件类型中的检查将为我们提供一些新信息。就像使用带有类型守卫的窄化可以为我们提供更具体的类型一样，条件类型的真正分支将根据我们检查的类型进一步约束泛型。

例如，让我们看以下示例：

```typescript
type MessageOf<T> = T["message"]; // 类型“"message"”无法用于索引类型“T”。
```

在这个例子中，TypeScript 会出错，因为 `T` 不知道有一个叫做 `message` 的属性。我们可以约束 `T`，TypeScript 就不会再抱怨了：

```typescript
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>; // type EmailMessageContents = string
```

但是，如果我们希望 `MessageOf` 接受任何类型，并且如果 `message` 属性不可用，则默认为 `never`，该怎么办呢？我们可以通过移出约束并引入条件类型来实现这一点：

```typescript
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>; // type EmailMessageContents = string

type DogMessageContents = MessageOf<Dog>; // type DogMessageContents = never
```

在 "true" 分支中，TypeScript 知道 `T` 将有一个 `message` 属性。

作为另一个例子，我们还可以编写一个名为 `Flatten` 的类型，它将数组类型扁平化为它们的元素类型，但在其他情况下保持不变：

```typescript
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
type Str = Flatten<string[]>; // type Str = string

// Leaves the type alone.
type Num = Flatten<number>; // type Num = number
```

当 `Flatten` 被指定数组类型时，它使用带 `number` 的索引访问来获取 `string[]` 的元素类型。否则，它只返回给定的类型。

## Inferring Within Conditional Types - 在条件类型中推断

我们发现自己正在使用条件类型来应用约束，然后提取类型。这是一种非常常见的操作，条件类型使其变得更容易。

条件类型为我们提供了一种使用 `infer` 关键字从 `true` 分支中比较的类型进行推断的方法。例如，我们可以推断 `Flatten` 中的元素类型，而不是使用索引访问类型手动获取它：

```typescript
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

这里，我们使用 `infer` 关键字以声明的方式引入了一个名为 `Item` 的新泛型类型变量，而不是指定如何在 `true` 分支中检索 `T` 的元素类型。这使我们不必思考如何挖掘和探索我们关心的类型的结构。

我们可以使用 `infer` 关键字编写一些有用的类型别名助手。例如，对于简单的情况，我们可以从函数类型中提取返回类型：

```typescript
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>; // type Num = number

type Str = GetReturnType<(x: string) => string>; // type Str = string

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>; // type Bools = boolean[]
```

当从具有多个调用签名的类型推断时 (比如重载函数的类型)，从最后一个签名进行推断 (这大概是最宽容笼统的情况)。它不可能根据实参类型列表执行重载解析。

```typescript
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>; // type T1 = string | number
```

## Distributive Conditional Types - 分发的条件类型

当条件类型作用于泛型类型，并给定联合类型时，条件类型就成为分发的。举个例子：

```typescript
type ToArray<Type> = Type extends any ? Type[] : never;
```

如果我们将联合类型插入 `ToArray`，那么条件类型将应用到该联合的每个成员。

```typescript
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// type StrArrOrNumArr = string[] | number[]
```

这里发生的是 `StrArrOrNumArr` 分发在：

```typescript
string | number;
```

并将联合的每个成员类型有效的映射：

```typescript
ToArray<string> | ToArray<number>;
```

这就留给我们：

```typescript
string[] | number[];
```

通常情况下，分发性是需要的行为。为了避免这种行为，可以用方括号围住 `extends` 关键字的每一方。

```typescript
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
// type StrArrOrNumArr = (string | number)[]
```
