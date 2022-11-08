# The Basics

欢迎来到手册的第一页。如果这是你第一次接触 TypeScript，你可能需要从 “[Getting Started](https://www.typescriptlang.org/docs/handbook/intro.html#get-started)” 指南开始。

JavaScript 中的每个值都有一组行为，可以通过运行不同的操作观察到。这听起来很抽象，但是作为一个简单的例子，考虑我们可能在名为 `message` 的变量上运行的一些操作。

```typescript
// Accessing the property 'toLowerCase'
// on 'message' and then calling it
message.toLowerCase();
// Calling 'message'
message();
```

如果我们将其分解，第一行可运行的代码将访问名为 `toLowerCase` 的属性，然后调用它。第二行尝试直接调用 `message`。

但假设我们不知道 `message` 的值 - 这是很常见的 - 我们不能可靠地表达，我们将从试图运行这些代码得到什么结果。每个操作的行为完全取决于我们首先得到的值。

- `message` 可调用的？
- 它是否有一个名为 `toLowerCase` 的属性？
- 如果是，`toLowerCase` 是否可以调用？
- 如果这两个值都是可调用的，它们返回什么？

当我们编写 JavaScript 时，这些问题的答案通常都在我们的头脑中，我们只能希望所有的细节都是正确的。

假设 `message` 是这样定义的：

```typescript
const message = "Hello World!";
```

你可能已经猜到了，如果我们试图运行 `message.toLowerCase()`，我们将得到相同的字符串，只是小写的。

那第二行代码呢？如果你熟悉 JavaScript，你就会知道这会以异常的形式失败：

```
TypeError: message is not a function
```

如果我们能避免这样的错误就好了。

当我们运行代码时，JavaScript 运行时选择做什么的方式是通过计算值的类型 - 它有什么样的行为和能力。这就是 `TypeError` 暗指的部分内容 - 它表示字符串 “Hello World!” 不能作为函数调用。

对于某些值，例如原始类型 `string` 和 `number`，我们可以在运行时使用 `typeof` 操作符识别它们的类型。但是对于像函数这样的其他事物，没有相应的运行时机制来标识它们的类型。例如，考虑这个函数：

```typescript
function fn(x) {
  return x.flip();
}
```

通过阅读代码，我们可以观察到，这个函数只有在给定具有可调用 `flip` 属性的对象时才会工作，但是 JavaScript 没有以一种我们可以在代码运行时检查的方式显示这些信息。在纯 JavaScript 中，要知道 `fn` 对特定值做了什么，唯一的方法是调用它并看看会发生什么。这种行为使得在代码运行之前很难预测它将做什么，这意味着在编写代码时更难知道它将做什么。

从这种角度看，类型就是描述哪些值可以传递给 `fn`，哪些值会崩溃的概念。JavaScript 只真正提供了动态类型 - 运行代码看看会发生什么。

另一种方法是使用静态类型系统，在运行代码之前对期望的代码进行预测。

## Static type-checking - 静态类型检查

回想一下我们之前尝试将 `string` 作为函数调用时得到的 `TypeError`。大多数人都不喜欢在运行代码时出现任何类型的错误 - 那些被认为是 bug！以及当我们编写新代码时，我们会努力避免引入新的 bug。

如果我们只加一点代码，保存我们的文件，重新运行代码，并立即看到错误，我们可能能够快速隔离问题；但这并非总是如此。我们可能还没有对这个功能进行足够彻底的测试，所以我们可能永远不会遇到会抛出的潜在错误！或者如果我们有幸目睹了这个错误，我们可能已经做了大量的重构，并添加了许多不同的代码，我们不得不寻找通过。

理想情况下，我们可以有一个工具在代码运行之前来帮助我们找到这些 bug。这就是像 TypeScript 这样的静态类型检查器所做的。静态类型系统描述了当我们运行程序时我们的值的形状和行为。像 TypeScript 这样的类型检查器使用这些信息，并告诉我们什么时候事物可能会偏离轨道。

```typescript
const message = "hello!";

message();
// 此表达式不可调用。
//  类型 "String" 没有调用签名。
```

在我们第一次运行代码之前，用 TypeScript 运行最后一个示例会给我们一个错误消息。

## Non-exception Failures - 非异常失败

到目前为止，我们一直在讨论某些问题，比如运行时错误 - JavaScript 运行时告诉我们它认为某些事物是无意义的，出现这些情况是因为 [ECMAScript 规范](https://tc39.github.io/ecma262/) 对语言在遇到意外情况时应该如何表现有明确的说明。

例如，规范认为尝试调用不可调用的东西会抛出错误。也许这听起来像是 "显而易见的行为"，但是你可以想象，访问对象上不存在的属性也会抛出错误。而不是，JavaScript 为我们提供了不同的行为并返回 `undefined` 的值。

```typescript
const user = {
  name: "Daniel",
  age: 26,
};
user.location; // returns undefined
```

最终，静态类型系统必须调用应该在其系统中标记为错误的代码，即使它是有效的 JavaScript，不会立即抛出错误。在 TypeScript 中，以下代码会产生关于没有定义 `location` 的错误：

```typescript
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
// 类型 “{ name: string; age: number; }” 上不存在属性 “location”。
```

虽然有时这意味着在表达内容上需要权衡，但其目的是捕获程序中合法的错误。TypeScript 能捕获很多合法的 bug。

例如：拼写错误

```typescript
const announcement = "Hello World!";

// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// We probably meant to write this...
announcement.toLocaleLowerCase();
```

或者基本逻辑错误

```typescript
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // This condition will always return 'false' since the types '"a"' and '"b"' have no overlap.
  // Oops, unreachable
}
```

## Types for Tooling - 类型工具

当我们在代码中出错时，TypeScript 可以捕获 bug。这很好，但 TypeScript 还可以防止我们在第一时间犯这些错误。

类型检查器具有检查例如是否正在变量上访问正确的属性以及其他属性的信息。一旦它有了这些信息，它还可以开始建议你可能需要使用哪些属性。

这意味着 TypeScript 也可以用来编辑代码，当你在编辑器中输入时，核心类型检查器可以提供错误消息和代码不补全。这就是人们在谈论 TypeScript 中的工具时经常提到的部分内容。

```typescript
const app = express();

app.get("/", function (req, res) {
  res.sen;
  // send
  // sendDate
  // sendfile
  // sendFile
  // sendStatus
});

app.listen(3000);
```

TypeScript 非常重视工具，而不仅仅是输入时的补全和错误。支持 TypeScript 的编辑器可以快速自动修复错误，重构可以轻松地重新组织代码，还有有用的导航功能，可以跳到变量的定义，或者找到对给定变量的所有引用。所有这些都构建在类型检查器之上，完全是跨平台的，所以很可能 [你最喜欢的编辑器有 TypeScript 支持](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support)。

## `tsc`, the TypeScript compiler - `tsc` TypeScript 编译器

我们一直在讨论类型检查，但是还没有使用类型检查器。让我们来认识一下我们的新朋友 `tsc`，TypeScript 编译器。首先，我们需要通过 npm 获取它。

```
npm install -g typescript
```

> 这将全局安装 TypeScript 编译器 `tsc`。如果你希望从本地 `node_modules` 包中运行 `tsc`，则可以使用 `npx` 或类似的工具。

现在让我们移到一个空文件夹，尝试编写我们的第一个 TypeScript 程序：`hello.ts`：

```typescript
// Greets the world.
console.log("Hello world!");
```

注意这里没有任何装饰；这个 "hello world" 程序看起来与用 JavaScript 编写的 "hello world" 程序相同。现在让我们通过运行 `tsc` 命令对它进行类型检查，这个命令是通过 `typescript` 包为我们安装的。

```
tsc hello.ts
```

等等，到底是什么？我们运行 `tsc` 之后什么都没发生！嗯，没有类型错误，所以我们在控制台中没有得到任何输出，因为没有什么要报告的。

但是再次检查 - 我们得到了一些文件输出。如果查看当前目录，会在 `hello.ts` 旁边看到一个 `hello.js` 文件。这是 `hello.ts` 文件的输出，`tsc` 编译或转换成普通 JavaScript 文件。如果我们检查内容，就会看到 TypeScript 在处理完 `.ts` 文件后吐出了什么：

```js
// Greets the world.
console.log("Hello world!");
```

在这种情况下，TypeScript 需要转换的内容很少，所以它看起来与我们编写的内容完全相同。编译器试图发出干净可读的代码，看起来像人写的东西。但这并不总是那么容易，TypeScript 始终保持缩进，注意我们的代码何时跨越了不同的代码行，并尽量保留注释。

如果我们引入了类型检查错误呢？让我们重写 `hello.ts`：

```typescript
// This is an industrial-grade general-purpose greeter function:
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date}!`);
}

greet("Brendan");
```

如果我们再次运行 `tsc hello.ts`，注意我们在命令行上得到一个错误！

```
Expected 2 arguments, but got 1.
```

TypeScript 告诉我们，我们忘记给 `greet` 函数传递一个参数，这是正确的。到目前为止，我们只编写了标准的 JavaScript，但是类型检查仍然能够发现代码中的问题。感谢 TypeScript！

## Emitting with Errors - 发出错误

从上一个例子中，你可能没有注意到的一件事是，我们的 `hello.js` 文件再次更改了。如果我们打开该文件，那么我们将看到内容基本上仍然与我们的输入文件相同。考虑到 `tsc` 报告了一个关于我们代码的错误，这可能有点令人惊讶，但这是基于 TypeScript 的核心价值之一：很多时候，你会比 TypeScript 懂得更多。

重申一下前面提到的，类型检查代码限制了你可以运行的程序的种类，因此在类型检查器可接受的内容的种类上需要权衡。大多数情况下，这是可以的，但也有一些情况下，这些检查会成为障碍。例如，想象你自己将 JavaScript 代码迁移到 TypeScript，并引入了类型检查错误。最终你将为类型检查器清理一些东西，但是原始的 JavaScript 代码已经可以工作了！为什么把它转换成 TypeScript 要阻止你运行它呢？

所以 TypeScript 不会妨碍你。当然，随着时间的推移，你可能想要对错误进行更多的防御，并让 TypeScript 的行为更严格一些。在这种情况下，可以使用 [`noEmitOnError`](https://www.typescriptlang.org/tsconfig#noEmitOnError) 编译器选项。试着改变你的 `hello.ts` 文件，并使用该标志运行 `tsc`：

```
tsc --noEmitOnError hello.ts
```

你会注意到 `hello.js` 从未更新。

## Explicit Types - 显式类型

到目前为止，我们还没有告诉 TypeScript `person` 和 `date` 是什么。让我们编辑代码，告诉 TypeScript `person` 是一个 `string`，而 `date` 应该是一个 `Date` 对象。我们还将在 `date` 上使用 `toDateString()` 方法。

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

我们所做的是在 `person` 和 `date` 上添加类型注释，以描述可以用什么类型的值调用 `greet`。你可以将签名读为 `greet` 接受类型为 `string` 的 `person` 和类型为 `Date` 的 `date`。

有了这个，TypeScript 可以告诉我们其他可能错误调用了 `greet` 的情况。例如...

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date());
// 类型“string”的参数不能赋给类型“Date”的参数。
```

嗯？TypeScript 在第二个参数上报告了一个错误，但是为什么呢？

也许令人惊讶的是，在 JavaScript 中调用 `Date()` 返回一个字符串。另一方面，使用 `new Date()` 构造 `Date` 实际上给了我们所期望的结果。

不管怎样，我们可以很快修复这个错误：

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

请记住，我们并不总是必须编写显式类型注释。在很多情况下，TypeScript 甚至可以为我们推断 (或 "算出") 类型，即使我们忽略了它们。

```typescript
let msg = "hello there!"; // let msg: string
```

虽然我们没有告诉 TypeScript `msg` 有 `string` 类型，它也能算出来。这是一个特性，当类型系统最终推断出相同的类型时，最好不要添加注释。

> 注意：如果将鼠标悬停在单词上，编辑器就会显示前面代码示例中的消息气泡。

## Erased Types - 擦除类型

让我们看看用 `tsc` 编译上面的 `greet` 函数以输出 JavaScript 时会发生什么：

```js
"use strict";
function greet(person, date) {
  console.log(
    "Hello ".concat(person, ", today is ").concat(date.toDateString(), "!")
  );
}
greet("Maddison", new Date());
```

注意两点：

1. 我们的 `person` 和 `date` 参数不再有类型注释。
2. 我们的 "模板字符串" - 那个使用反引号的字符串 ( `` ` 字符) - 被转换为带有连接的普通字符串。

第二点稍后再谈，现在让我们关注第一点。类型注释不是 JavaScript (或者说是 ECMAScript) 的一部分，所以真的没有任何浏览器或其他运行时可以不加修改地运行 TypeScript。这就是 TypeScript 首先需要编译器的原因 - 它需要某种方法来剥离或转换任何 Typescript 特定的代码，以便你可以运行它。大多数 Typescript 特定的代码都被擦除了，同样，我们的类型注释也被完全擦除了。

> 记住：类型注释永远不会改变程序的运行时行为。

## Downleveling - 降级

与上面的另一个不同之处在于，我们的模板字符串是从

```typescript
`Hello ${person}, today is ${date.toDateString()}!`;
```

到

```js
"Hello " + person + ", today is " + date.toDateString() + "!";
```

为什么会这样？

模板字符串是 ECMAScript 2015 (又名 ECMAScript 6, ES2015, ES6 等) 的一个特性。TypeScript 可以将 ECMAScript 新版本的代码重写为 ECMAScript 3 或 ECMAScript 5 (又称 ES3 和 ES5) 等旧版本的代码。从更新的或更高的版本的 ECMAScript 向下移动到旧的版本或更低的版本的过程有时称为降级。

默认情况下，TypeScript 的目标是 ES3，这是 ECMAScript 的一个非常老的版本。我们可以使用 [`target`](https://www.typescriptlang.org/tsconfig#target) 选项来选择更近期的版本。使用 `--target es2015` 将 TypeScript 更改为目标 ECMAScript 2015，这意味着代码应该能够在支持 ECMAScript 2015 的地方运行。运行 `tsc --target es2015 hello.ts` 给我们以下输出：

```typescript
function greet(person, date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
greet("Maddison", new Date());
```

> 虽然默认目标是 ES3，但绝大多数当前浏览器都支持 ES2015。因此，大多数开发人员可以安全地指定 ES2015 或更高版本作为目标，除非与某些古老浏览器的兼容性很重要。

## Strictness - 严格

不同的用户使用 TypeScript 在类型检查器中寻找不同的事物。有些人正在寻找一种更宽松的选择体验，它可以帮助验证他们程序的某些部分，而且仍然有不错的使用工具。这是使用 TypeScript 的默认体验，在类型是可选的情况下，推理采用最宽松的类型，并且没有检查潜在地 `null/undefined` 值。就像 `tsc` 在遇到错误时发出的信号一样，设置这些默认值是为了不妨碍你的工作。如果你正在迁移现有的 JavaScript，这可能是理想的第一步。

相比之下，许多用户更喜欢让 TypeScript 直接进行尽可能多的验证，这就是为什么该语言也提供了严格设置。这些严格设置将静态类型检查从一个开关 (不管你的代码是否被检查) 变成一个更接近于调节器的东西。你越往上拨，TypeScript 就会为你检查得越多。这可能需要一些额外的工作，但一般来说，从长远来看，这是值得的，并且支持更彻底的检查和更精确的工具。在可能的情况下，新的代码库应该始终打开这些严格性检查。

TypeScript 有几个可以打开或关闭的类型检查严格标志，我们所有的示例都将启用这些标志，除非另有说明。在 CLI 中的 [`strict`](https://www.typescriptlang.org/tsconfig#strict) 标志，或在 [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 中的 `"strict": true` 同时将它们全部打开，但我们也可以单独选择退出它们。你应该知道的最大的两个是 [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) 和 [`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks)。

### `noImplicitAny`

回想一下，在某些地方，TypeScript 不尝试为我们推断类型，而是退回到最宽松的类型：`any`。这并不是最糟糕的事情 - 毕竟，回到 `any` 只是简单的 JavaScript 体验。

然而，使用 `any` 通常违背了使用 TypeScript 的初衷。程序的类型越多，得到的验证和工具就越多，这意味着在编写代码时遇到的错误就越少。打开 [`noImplicitAny`](https://www.typescriptlang.org/tsconfig#noImplicitAny) 标志将对任何类型隐式推断为 `any` 的变量发出错误。

### `strictNullChecks`

默认情况下，`null` 和 `undefined` 等值可赋值给任何其他类型。这可以使编写一些代码更容易，但忘记处理 `null` 和 `undefined` 是世界上无数错误的原因。有人认为这是一个 [价值十亿美元](https://www.youtube.com/watch?v=ybrQvs4x0Ps) 的错误！[`strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) 标志使 `null` 和 `undefined` 的处理更加明确，并使我们不必担心是否忘记处理 `null` 和 `undefined`。
