# Keyof Type Operator

## The `keyof` type operator - `keyof` 类型操作符

keyof 操作符接受一个对象类型，并生成其键的一个字符串或数字字面量的联合。下面的类型 `P` 与 `"x" | "y"` 的类型相同。

```typescript
type Point = { x: number; y: number };
type P = keyof Point; // type P = keyof Point
```

如果该类型具有 `string` 或 `number` 索引签名，`keyof` 将返回这些类型替代：

```typescript
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // type M = string | number
```

注意，在本例中，`M` 是 `string | number` - 这是因为 JavaScript 对象的键总是被强制转换为字符串，所以 `obj[0]` 总是与 `obj["0"]` 相同。

当与映射类型结合使用时，`keyof` 类型变得特别有用，我们将在后面进一步了解映射类型。
