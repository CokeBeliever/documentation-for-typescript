# Typeof Type Operator

## The `typeof` type operator - `typeof` 类型操作符

JavaScript 已经有了一个 `typeof` 操作符，可以在表达式上下文中使用：

```typescript
// Prints "string"
console.log(typeof "Hello world");
```

TypeScript 添加了一个 `typeof` 操作符，你可以在类型上下文中使用它来引用变量或属性的类型：

```typescript
let s = "hello";
let n: typeof s; // let n: string
```

这对于基本类型不是很有用，但是结合其他类型操作符，可以使用 `typeof` 方便地表示许多模式。作为一个示例，让我们通过看预定义类型 `ReturnType<T>` 开始。它接受一个函数类型并生成其返回类型：

```typescript
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
```

如果我们试图在函数名上使用 `ReturnType`，我们会看到一个有指导意义的错误：

```typescript
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>; // “f”表示值，但在此处用作类型。是否指“类型 f”?
```

记住，值和类型不是一回事。要引用 `f` 值的类型，我们使用 `typeof`：

```typescript
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
// type P = {
//		x: number;
//		y: number;
// }
```

## Limitations - 限制

TypeScript 有意地在表达式的种类上限制了可以使用 `typeof`。

具体来说，只有在标识符 (即变量名) 或其属性上使用 `typeof` 才是合法的。这有助于避免编写你认为正在执行但在实际上没有执行的代码的混乱陷阱。

```typescript
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
// 应为“,”。
```
