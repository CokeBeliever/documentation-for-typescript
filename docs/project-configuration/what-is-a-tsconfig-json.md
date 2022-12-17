# What is a tsconfig.json

## Overview - 概述

在一个目录中有 `tsconfig.json` 文件的存在，表示该目录是 TypeScript 项目的根目录。`tsconfig.json` 文件指定编译项目所需的根文件和编译器选项。

JavaScript 项目可以使用 `jsconfig.json` 文件代替，它的作用几乎相同，但有一些 Javascript 相关的编译器标志默认启用。

一个项目是通过以下方式之一编译的：

## Using `tsconfig.json` or `jsconfig.json` - 使用 `tsconfig.json` 或 `jsconfig.json`

- 通过调用不带输入文件的 tsc，在这种情况下，编译器搜索 `tsconfig.json` 文件从当前目录开始，并沿着父目录链继续向上搜索。
- 通过调用不带输入文件的 tsc，并通过 `--project`（或仅为 `-p`）命令行选项指定包含 `tsconfig.json` 文件的目录路径，或包含配置的有效 `.json` 的文件路径。

当在命令行上指定输入文件时，`tsconfig.json` 文件会被忽略。

## Examples - 例子

`tsconfig.json` 文件示例：

- 使用 [`files`](https://www.typescriptlang.org/tsconfig#files) 属性

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "sourceMap": true
  },
  "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "emitter.ts",
    "program.ts",
    "commandLineParser.ts",
    "tsc.ts",
    "diagnosticInformationMap.generated.ts"
  ]
}
```

- 使用 [`include`](https://www.typescriptlang.org/tsconfig#include) 和 `exclude` 属性

```json
{
  "compilerOptions": {
    "module": "system",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outFile": "../../built/local/tsc.js",
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

## TSConfig Bases - TSConfig 库

这取决于你打算在其中运行代码的 JavaScript 运行时环境，根据你打算在其中运行代码的 JavaScript 运行时环境的不同，在 [github.com/tsconfig/bases](https://github.com/tsconfig/bases/) 上可能会有一个你可以使用的基本配置。这些是你项目扩展的 `tsconfig.json` 文件，通过处理运行时支持来简化你的 `tsconfig.json`。

例如，如果你正在编写一个使用 Node.js 版本 12 或更高版本的项目，那么你可以使用 npm 模块 [`@tsconfig/node12`](https://www.npmjs.com/package/@tsconfig/node12)。

```json
{
  "extends": "@tsconfig/node12/tsconfig.json",
  "compilerOptions": {
    "preserveConstEnums": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

这让你的 `tsconfig.json` 专注于项目的独特选择，而不是所有的运行时机制。现在已经有了一些 tsconfig 库，我们希望社区可以为不同的环境添加更多。

- [Recommended](https://www.npmjs.com/package/@tsconfig/recommended)
- [Node 10](https://www.npmjs.com/package/@tsconfig/node10)
- [Node 12](https://www.npmjs.com/package/@tsconfig/node12)
- [Node 14](https://www.npmjs.com/package/@tsconfig/node14)
- [Node 16](https://www.npmjs.com/package/@tsconfig/node16)
- [Deno](https://www.npmjs.com/package/@tsconfig/deno)
- [React Native](https://www.npmjs.com/package/@tsconfig/react-native)
- [Svelte](https://www.npmjs.com/package/@tsconfig/svelte)

## Details

`"compilerOptions"` 属性可以省略，在这种情况下使用编译器的默认值。查看我们支持的 [Compiler Options](https://www.typescriptlang.org/tsconfig) 的完整列表。

## TSConfig Reference

在 [TSConfig Reference](https://www.typescriptlang.org/tsconfig) 中学习有关数百个配置选项的更多信息。

## Schema

`tsconfig.json` Schema 可以在 [the JSON Schema Store](http://json.schemastore.org/tsconfig) 中找到。
