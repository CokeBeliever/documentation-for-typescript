# Indexed Access Types

我们可以使用索引访问类型来查找另一类型的特定属性：

```typescript
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // type Age = number
```

索引类型本身就是一种类型，因此我们可以完整地使用联合、`keyof` 或其他类型：

```typescript
type I1 = Person["age" | "name"]; // type I1 = string | number

type I2 = Person[keyof Person]; // type I2 = string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName]; // type I3 = string | boolean
```

如果试图索引不存在的属性，甚至会看到错误：

```typescript
type I1 = Person["alve"]; // 类型“Person”上不存在属性“alve”。
```

另一个使用任意类型进行索引的示例是使用 `number` 获取数组元素的类型。我们可以结合 `typeof` 来方便地捕获数组字面量的元素类型。

```typescript
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number];
// type Person = {
//     name: string;
//     age: number;
// }
type Age = typeof MyArray[number]["age"]; // type Age = number
// Or
type Age2 = Person["age"]; // type Age2 = number
```

在建立索引时只能使用类型，这意味着不能使用 `const` 进行变量引用：

```typescript
const key = "age";
type Age = Person[key];
// 类型“key”不能作为索引类型使用。
// “key”表示值，但在此处用作类型。是否指“typeof key”?
```

但是，你可以为类似风格的重构使用类型别名：

```typescript
type key = "age";
type Age = Person[key];
```
