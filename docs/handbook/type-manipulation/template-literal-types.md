# Template Literal Types

模板字面量类型建立在 [字符串字面量类型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) 的基础上，并且有能力通过联合扩展为多个字符串。

它们的语法与 [JavaScript 中的模板字面量字符串](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 相同，但用于类型位置。当与具体的字面量类型一起使用时，模板字面量通过连接内容生成新的字符串字面量类型。

```typescript
type World = "world";

type Greeting = `hello ${World}`;
// type Greeting = "hello world"
```

当在插值位置使用联合时，类型是每个联合成员可以表示的所有可能字符串文字的集合：

```typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

对于模板字面量中的每个插值位置，联合是交叉相乘：

```typescript
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
// type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
```

我们通常建议人们对大型字符串联合使用提前生成，但这在小型的情况下是有用的。

## String Unions in Types - 类型中的字符串联合

模板字面量的强大体现在基于一个类型内部信息定义一个新字符串时。

考虑这样一种情况，函数 (`makeWatchedObject`) 向传递的对象增加了一个名为 `on()` 的新函数。在 JavaScript 中，它的调用可能看起来像：`makeWatchedObject(baseObject)`。我们可以想象基础对象是这样的：

```typescript
const passedObject = {
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
};
```

增加到基础对象的 `on` 函数需要两个参数，一个 `eventName` (一个 `string`) 和一个 `callBack` (一个 `function`)。

`eventName` 的形式应该是 `attributeinthepasssedobject + "Changed"`；因此，`firstNameChanged` 是从基础对象中的 `firstName` 属性派生的。

`callBack` 函数，当被调用时：

- 应该传递一个与名称 `attributeInThePassedObject` 关联的类型的值；因此，由于 `firstName` 被输入为 `string`。`firstNameChanged` 事件的回调期望在调用时传递一个 `string` 给它。类似地，与 `age` 相关的事件应该使用 `number` 实参调用
- 应该有 `void` 返回类型 (为了演示简单)

`on()` 的原始函数签名可能是：`on(eventName: string, callBack: (newValue: any) => void)`。但是，在前面的描述中，我们确定了希望在代码中记录的重要类型约束。模板字面量类型允许我们在代码中引入这些约束。

```typescript
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

// makeWatchedObject has added `on` to the anonymous Object

person.on("firstNameChanged", (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

注意 `on` 监听的是 `"firstNameChanged"` 事件，而不是 `"firstName"` 事件。如果我们要确保符合条件的事件名称集受到所监视对象中属性名称的联合的约束，并在末尾添加了 `Changed`，那么 `on()` 的原始规范可以变得更加健壮。尽管我们很喜欢在 JavaScript 中进行这样的计算，例如 `Object.keys(passsedobject).map(x => ' ${x}Changed ')`，但是类型系统中的模板字面量提供了类似的字符串操作方法。

```typescript
type PropEventSource<Type> = {
  on(
    eventName: `${string & keyof Type}Changed`,
    callback: (newValue: any) => void
  ): void;
};

/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;
```

有了这个，我们可以构建一个在给定错误属性时出错的事物：

```typescript
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("firstNameChanged", () => {});

// Prevent easy human error (using the key instead of the event name)
person.on("firstName", () => {});
// 类型“"firstName"”的参数不能赋给类型“"firstNameChanged" | "lastNameChanged" | "ageChanged"”的参数。

// It's typo-resistant
person.on("frstNameChanged", () => {});
// 类型“"frstNameChanged"”的参数不能赋给类型“"firstNameChanged" | "lastNameChanged" | "ageChanged"”的参数。
```

## Inference with Template Literals - 用模板字面量推断

注意，我们并没有从最初传递的对象中提供的所有信息中获益。给定 `firstName` 的改变 (即 `firstNameChanged` 事件)，我们应该期望回调函数将接收一个类型为 `string` 的实参。类似地，改变 `age` 的回调应该接收一个 `number` 实参。我们天真地使用 `any` 来输入 `callBack` 函数的实参。同样，模板字面量类型可以确保属性的数据类型与该属性的回调参数的第一个参数的类型相同。

让这成为可能的关键见解是这样的：我们可以这样使用泛型函数：

1. 第一个实参中使用的字面量被捕获为字面量类型
2. 可以将该字面量类型验证为泛型中有效属性的联合
3. 可以使用索引访问在泛型结构中查找已验证属性的类型
4. 然后可以应用此类型信息以确保回调函数的实参具有相同的类型

```typescript
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("firstNameChanged", (newName) => {
  // (parameter) newName: string
  console.log(`new name is ${newName.toUpperCase()}`);
});

person.on("ageChanged", (newAge) => {
  // (parameter) newAge: number
  if (newAge < 0) {
    console.warn("warning! negative age");
  }
});
```

这里我们把 `on` 变成了一个泛型方法。

当用户调用字符串 `"firstNameChanged"`时，TypeScript 会尝试推断 `Key` 的正确类型。为此，它将 `Key` 与 `“Changed”` 之前的内容进行匹配，并推断字符串 `“firstName”`。一旦 TypeScript 弄清楚了，`on` 方法就可以在原始对象上获取 `firstName` 的类型，在本例中是 `string`。类似地，当 `"ageChanged"` 调用时，TypeScript 会找到属性 `age` 的类型，即 `number`。

推理可以由不同的方式组合，通常是为了解构字符串，并以不同的方式重构它们。

## Intrinsic String Manipulation Types - 固有的字符串操作类型

为了帮助进行字符串操作，TypeScript 包含了一组可用于字符串操作的类型。这些类型为提高性能而内置到编译器中，不能在 TypeScript 包含的 `.d.ts` 文件中找到。

### `Uppercase<StringType>`

将字符串中的每个字符转换为大写版本。

**例子**

```typescript
type Greeting = "Hello, world";
type ShoutyGreeting = Uppercase<Greeting>;
// type ShoutyGreeting = "HELLO, WORLD"

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`;
type MainID = ASCIICacheKey<"my_app">;
// type MainID = "ID-MY_APP"
```

### `Lowercase<StringType>`

将字符串中的每个字符转换为等效的小写字符。

**例子**

```typescript
type Greeting = "Hello, world";
type QuietGreeting = Lowercase<Greeting>;
// type QuietGreeting = "hello, world"

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`;
type MainID = ASCIICacheKey<"MY_APP">;
// type MainID = "id-my_app"
```

### `Capitalize<StringType>`

将字符串中的第一个字符转换为等效的大写字母。

**例子**

```typescript
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
// type Greeting = "Hello, world"
```

### `Uncapitalize<StringType>`

将字符串中的第一个字符转换为等效的小写字符。

**例子**

```typescript
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
// type UncomfortableGreeting = "hELLO WORLD"
```

---

关于固有字符串操作类型的技术细节

从 TypeScript 4.1 开始，这些固有函数的代码直接使用 JavaScript 字符串运行时函数进行操作，并且不支持区域设置。

```typescript
function applyStringMapping(symbol: Symbol, str: string) {
  switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
    case IntrinsicTypeKind.Uppercase:
      return str.toUpperCase();
    case IntrinsicTypeKind.Lowercase:
      return str.toLowerCase();
    case IntrinsicTypeKind.Capitalize:
      return str.charAt(0).toUpperCase() + str.slice(1);
    case IntrinsicTypeKind.Uncapitalize:
      return str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str;
}
```
