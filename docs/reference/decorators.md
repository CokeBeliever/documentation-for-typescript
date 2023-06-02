# Decorators

## introduction - 介绍

> 进一步阅读：[A Complete Guide to TypeScript Decorators](https://saul-mirone.github.io/a-complete-guide-to-typescript-decorator/)

随着 class 在 TypeScript 和 ES6 中的引入，现在存在一些场景需要额外的特性来支持注释或修改 class 和 class 成员。Decorator 装饰器提供了一种为 class 声明和成员添加注释和元编程语法的方法。装饰器是 JavaScript 的[第二阶段提案](https://github.com/tc39/proposal-decorators)，可以作为 TypeScript 的一个实验特性使用。

> 注：装饰器是一个实验性的特性，在未来的版本中可能会发生变化。

要启用对装饰器的实验性支持，你必须在命令行或 `tsconfig.json` 中启用 experimentalDecorators 编译器选项：

**Command Line:**

```
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**:

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```



## Decorators - 装饰器

Decorator 是一种特殊类型的声明，可以附加到 [class 声明](https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators)、[method 方法](https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators)、[accessor 访问器](https://www.typescriptlang.org/docs/handbook/decorators.html#accessor-decorators)、[property 属性](https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators) 或 [parameter 参数](https://www.typescriptlang.org/docs/handbook/decorators.html#parameter-decorators)上。

Decorator 使用 `@expression` 的形式，其中 `expression` 必须求值为一个函数，该函数将在运行时调用，并提供有关装饰声明的信息。

例如，给定装饰器 `@sealed`，我们可以这样编写 sealed 函数：

```typescript
function sealed(target) {
  // do something with 'target' ...
}
```



## Decorator Factories - 装饰器工厂

如果我们想自定义如何将 Decorator 应用于声明，我们可以编写一个装饰器工厂。装饰器工厂只是一个函数，它返回将在运行时由 Decorator 调用的表达式。

我们可以按照下面的方式编写一个装饰器工厂：

```typescript
function color(value: string) {
  // this is the decorator factory, it sets up
  // the returned decorator function
  return function (target) {
    // this is the decorator
    // do something with 'target' and 'value'...
  };
}
```



## Decorator Composition - 装饰器组成

多个装饰符可以应用到一个声明中，例如在单行中：

```typescript
@f @g x
```

在多行中：

```typescript
@f
@g
x
```

当多个装饰器应用于单个声明时，它们的求值类似于[数学中的函数组合](https://wikipedia.org/wiki/Function_composition)。在该模型中，当组合函数 *f* 和 *g* 时，得到的复合函数 (*f* ∘ *g*)(*x*) 等价于 *f*(*g*(*x*))。

因此，当在 TypeScript 中对单个声明求值多个装饰器时，将执行以下步骤：

1. 每个装饰器的表达式都是从上到下求值的。
2. 然后，从下到上将结果作为函数调用。

如果我们要使用[装饰器工厂](https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories)，我们可以通过下面的示例观察这个求值顺序：

```typescript
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}
 
function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}
 
class ExampleClass {
  @first()
  @second()
  method() {}
}
```

这将打印输出到控制台：

```
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```



## Decorator Evaluation - 装饰器评估

在 class 内部的各种声明中应用装饰器的顺序有一个很好的定义：

1. 对每个实例成员应用装饰器：参数、然后是方法、访问器或属性装饰器。
2. 对每个静态成员应用装饰器：参数、然后是方法、访问器或属性装饰器。
3. 对 constructor 构造函数应用装饰器：参数装饰器。
4. 对 class 类应用装饰器：类装饰器。



## Class Decorators - 类的装饰器

类装饰器在类声明之前声明。类装饰器应用于类的构造函数，可用于观察、修改或替换类定义。类装饰器不能在声明文件或任何其他环境上下文中使用 (例如在 `declare` 类中)。

类装饰器的表达式将在运行时作为函数调用，装饰类的构造函数作为其唯一参数。

如果类装饰器返回一个值，它将用提供的构造函数替换类声明。

> 注：如果你选择返回一个新的构造函数，你必须注意保持原来的 prototype 原型。在运行时应用装饰器的逻辑不会为你做这些。

下面是一个应用于 `BugReport` 类的类装饰器 (`@sealed`) 的例子：

```typescript
@sealed
class BugReport {
  type = "report";
  title: string;
 
  constructor(t: string) {
    this.title = t;
  }
}
```

我们可以使用下面的函数声明来定义 `@sealed` 装饰器：

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

当 `@sealed` 被执行时，它将密封构造函数和它的原型，因此将防止在运行时通过访问 BugReport 向该类添加或删除任何进一步的功能。或者在 BugReport 上定义属性 (请注意，ES2015 类实际上只是基于原型的构造函数的语法糖)。这个装饰器不会阻止类子类化 BugReport。

接下来，我们有一个如何重写构造函数以设置新默认值的示例。

```typescript
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www...";
  };
}
 
@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;
 
  constructor(t: string) {
    this.title = t;
  }
}
 
const bug = new BugReport("Needs dark mode");
console.log(bug.title); // Prints "Needs dark mode"
console.log(bug.type); // Prints "report"
 
// Note that the decorator _does not_ change the TypeScript type
// and so the new property `reportingURL` is not known
// to the type system:
bug.reportingURL; // 类型 "BugReport" 上不存在属性 "reportingURL"。
```



## Method Decorators - 方法装饰器

方法装饰器在方法声明之前声明。装饰器应用于方法的属性描述符，可用于观察、修改或替换方法定义。方法装饰器不能在声明文件、重载或任何其他环境上下文中 (例如在 `declare` 类中) 使用。

方法装饰器的表达式将在运行时作为函数调用，带有以下三个参数

1. 静态成员的类构造函数或实例成员的类原型。
2. 成员的名称。
3. 成员的属性描述符。

> 注：如果你的 script target 小于 ES5，则属性描述符将未定义。

如果方法装饰器返回一个值，它将被用作该方法的属性描述符。

> 注：如果你的 script target 小于 ES5，则忽略返回值。

下面是一个方法装饰器 (`@enumerable`) 应用于 Greeter 类方法的例子：

```typescript
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
 
  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

我们可以使用下面的函数声明来定义 `@enumerable` 装饰器：

```typescript
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
```

这里的 `@enumerable(false)` 装饰器是一个装饰器工厂。当 `@enumerable(false)` 装饰器被调用时，它会修改属性描述符的 enumerable 属性。



## Accessor Decorators - 访问器装饰器

在访问器声明之前声明访问器装饰器。访问器装饰器应用于访问器的属性描述符，可用于观察、修改或替换访问器的定义。访问器装饰器不能在声明文件中使用，也不能在任何其他环境上下文中使用 (例如在 `declare` 类中)。

> 注：TypeScript 不允许装饰单个成员的 get 和 set 访问器。相反，成员的所有装饰器必须应用于按文档顺序指定的第一个访问器。这是因为装饰器应用于属性描述符，它结合了 get 和 set 访问器，而不是单独的每个声明。

访问器装饰器的表达式将在运行时作为函数调用，带有以下三个参数：

1. 静态成员的类构造函数或实例成员的类原型。
2. 成员的名称。
3. 成员的属性描述符。

> 注：如果你的 script target 小于 ES5，则属性描述符将未定义。

如果访问器装饰器返回一个值，它将被用作成员的属性描述符。

> 注：如果你的 script target 小于 ES5，则忽略返回值。

下面是一个应用于 Point 类成员的访问器装饰器 (`@configurable`) 的例子：

```typescript
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
 
  @configurable(false)
  get x() {
    return this._x;
  }
 
  @configurable(false)
  get y() {
    return this._y;
  }
}
```

我们可以使用下面的函数声明来定义 `@configurable` 装饰器：

```typescript
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
```



## Property Decorators - 属性装饰器

在属性声明之前声明属性装饰器。属性装饰器不能在声明文件中使用，也不能在任何其他环境上下文中使用 (例如在 `declare` 类中)。

属性装饰器的表达式将在运行时作为函数调用，带有以下两个参数：

1. 静态成员的类构造函数或实例成员的类原型。
2. 成员的名称。

> 注：由于 TypeScript 中属性装饰器的初始化方式，属性描述符没有作为属性装饰器的参数提供。这是因为在定义原型成员时，目前没有机制来描述实例属性，也没有办法观察或修改属性的初始化项。返回值也会被忽略。因此，属性装饰器只能用于观察为类声明了特定名称的属性。

我们可以使用这些信息来记录关于属性的元数据，如下面的示例所示：

```typescript
class Greeter {
  @format("Hello, %s")
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}
```

然后我们可以使用下面的函数声明来定义 `@format` 装饰器和 `getFormat` 函数：

```typescript
import "reflect-metadata";
const formatMetadataKey = Symbol("format");
function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}
function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```

这里的 `@format("Hello， %s")` 装饰器是一个 [装饰器工厂](https://www.typescriptlang.org/docs/handbook/decorators.html#decorator-factories)。当 `@format("Hello， %s")` 被调用时，它使用来自 `reflect-metadata` 库的元数据函数 `Reflect.metadata` 为属性添加一个元数据条目。当调用 `getFormat` 时，它读取该格式的元数据值。

> 注：本例需要使用 `reflect-metadata` 库。有关 `reflect-metadata` 库的详细信息，请参阅 [Metadata](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)。



## Parameter Decorators - 参数装饰器

在参数声明之前声明参数装饰器。参数装饰器应用于类构造函数或方法声明的函数。参数装饰器不能在声明文件、重载或任何其他环境上下文中使用 (例如在 `declare` 类中)。

参数装饰器的表达式将在运行时作为函数调用，带有以下三个实参：

1. 静态成员的类构造函数或实例成员的类原型。
2. 成员的名称。
3. 函数参数列表中参数的序数索引。

> 注：参数装饰器只能用于观察在方法上声明的参数。

参数装饰器的返回值将被忽略。

下面是一个参数装饰器 (`@required`) 应用于 BugReport 类成员的参数的例子：

```typescript
class BugReport {
  type = "report";
  title: string;
 
  constructor(t: string) {
    this.title = t;
  }
 
  @validate
  print(@required verbose: boolean) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`;
    } else {
     return this.title; 
    }
  }
}
```

然后我们可以使用下面的函数声明来定义 `@required` 和 `@validate` 装饰器：

```typescript
import "reflect-metadata";
const requiredMetadataKey = Symbol("required");
 
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata( requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}
 
function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  let method = descriptor.value!;
 
  descriptor.value = function () {
    let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
          throw new Error("Missing required argument.");
        }
      }
    }
    return method.apply(this, arguments);
  };
}
```

`@required` 装饰器添加了一个元数据条目，将参数标记为必需的。然后，`@validate` 装饰器将现有的 `print` 方法包装在一个函数中，该函数在调用原始方法之前验证参数。

> 注：本例需要使用 reflect-metadata 库。有关 reflect-metadata 库的详细信息，请参阅 [Metadata](https://www.typescriptlang.org/docs/handbook/decorators.html#metadata)。



## Metadata - 元数据

一些例子使用了 reflect-metadata 库，它为实验性的[元数据 API](https://github.com/rbuckton/ReflectDecorators) 添加了一个 polyfill。这个库还不是 ECMAScript (JavaScript) 标准的一部分。然而，一旦装饰器作为 ECMAScript 标准的一部分被正式采用，这些扩展就会被提议采用。

你可以通过 npm 安装这个库：

```
npm i reflect-metadata --save
```

TypeScript 包含实验性支持，可以为带有装饰器的声明发出特定类型的元数据。要启用这种实验性支持，你必须在命令行或 `tsconfig.json` 中设置 emitDecoratorMetadata 编译器选项：

**Command Line:**

```
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

启用后，只要导入了 `reflect-metadata` 库，就会在运行时公开额外的设计时类型信息。

我们可以在下面的示例中看到这一点：

```typescript
import "reflect-metadata";
 
class Point {
  constructor(public x: number, public y: number) {}
}
 
class Line {
  private _start: Point;
  private _end: Point;
 
  @validate
  set start(value: Point) {
    this._start = value;
  }
 
  get start() {
    return this._start;
  }
 
  @validate
  set end(value: Point) {
    this._end = value;
  }
 
  get end() {
    return this._end;
  }
}
 
function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let set = descriptor.set!;
  
  descriptor.set = function (value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);
 
    if (!(value instanceof type)) {
      throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`);
    }
 
    set.call(this, value);
  };
}
 
const line = new Line()
line.start = new Point(0, 0)
 
// @ts-ignore
// line.end = {}
 
// Fails at runtime with:
// > Invalid type, got object not Point
```

TypeScript 编译器会使用 `@Reflect.metadata` 注入设计时类型信息。你可以认为它相当于下面的 TypeScript：

```typescript
class Line {
  private _start: Point;
  private _end: Point;
  @validate
  @Reflect.metadata("design:type", Point)
  set start(value: Point) {
    this._start = value;
  }
  get start() {
    return this._start;
  }
  @validate
  @Reflect.metadata("design:type", Point)
  set end(value: Point) {
    this._end = value;
  }
  get end() {
    return this._end;
  }
}
```

> 注：装饰器元数据是一个实验性的特性，可能会在未来的版本中引入破坏性的变化。

