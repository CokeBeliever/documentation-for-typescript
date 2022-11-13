# Creating Types from Types

TypeScript 的类型系统非常强大，因为它允许用其他类型来表示类型。

这种思想的最简单形式是泛型，实际上我们有各种各样的类型操作符可供使用。它也可能用我们已有值的关系来表示类型。

通过组合各种类型运算符，我们可以用简洁、可维护的方式表示复杂的操作和值。在本节中，我们将介绍用现有类型或值表示新类型的方法。

- [Generics - 泛型](https://www.typescriptlang.org/docs/handbook/2/generics.html) - 接受形参的类型
- [Keyof Type Operator - Keyof 类型操作符](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html) - 使用 `keyof` 操作符创建新的类型
- [Typeof Type Operator - Typeof 类型操作符](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html) - 使用 `typeof` 操作符创建新的类型
- [Indexed Access Types - 索引访问类型](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) - 使用 `Type['a']` 语法访问类型的子集
- [Conditional Types - 条件类型](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html) - 类似于类型系统中的 `if` 语句的类型
- [Mapped Types - 映射类型](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html) - 通过映射现有类型中的每个属性来创建类型
- [Template Literal Types - 模板字面量类型](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) - 通过模板字面量字符串更改属性的映射类型
