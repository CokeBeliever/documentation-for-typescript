# Mapped Types

当你不想重复自己的时候，有时一种类型需要以另一种类型为基础。

映射类型构建在索引签名的语法之上，索引签名用于声明未提前声明的属性的类型：

```typescript
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

映射类型是一种泛型类型，它使用 `Propertykey` 的联合 (通常 [通过 `keyof`](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) 创建) 来迭代键以创建类型：

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

在本例中，`OptionsFlags` 将从类型 `Type` 获取所有属性，并将它们的值更改为布尔值。

```typescript
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = {
//     darkMode: boolean;
//     newUserProfile: boolean;
// }
```

## Mapping Modifiers - 映射修饰符

在映射过程中可以应用另外两个修饰符：`readonly` 和 `?` 分别影响可变性和可选性。

你可以通过在前面加上 `-` 或 `+` 来删除或添加这些修饰符。如果不添加前缀，则假定为 `+`。

```typescript
// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
// type UnlockedAccount = {
//     id: string;
//     name: string;
// }
```

```typescript
// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
// type User = {
//     id: string;
//     name: string;
//     age: number;
// }
```

## Key Remapping via `as` - 通过 `as` 键重新映射

在 TypeScript 4.1 及以后的版本中，你可以用映射类型中的 `as` 子句在映射类型中重新映射键：

```typescript
type MappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties];
};
```

你可以利用 [模板字面量类型](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) 等特性从以前的属性名称中创建新的属性名称：

```typescript
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
// type LazyPerson = {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }
```

可以通过条件类型生成 `never` 来过滤掉键：

```typescript
// Remove the 'kind' property
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property];
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
// type KindlessCircle = {
//     radius: number;
// }
```

你可以映射任意的联合，不仅仅是 `string | number | symbol` 的联合，还可以映射任何类型的联合：

```typescript
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void;
};

type SquareEvent = { kind: "square"; x: number; y: number };
type CircleEvent = { kind: "circle"; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;
// type Config = {
//     square: (event: SquareEvent) => void;
//     circle: (event: CircleEvent) => void;
// }
```

## Further Exploration - 进一步探索

映射类型与类型操作部分中的其他特性配合得很好，例如，这里是 [一个使用条件类型的映射类型](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)，该类型返回 `true` 或 `false` 取决于对象是否将属性 `pii` 设置为字面量 `true`：

```typescript
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
// type ObjectsNeedingGDPRDeletion = {
//     id: false;
//     name: true;
// }
```
