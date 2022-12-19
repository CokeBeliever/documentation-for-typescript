# Project References

项目 references 是 TypeScript 3.0 的一个新特性，它允许你将 TypeScript 程序组织成更小的片段。

通过这样做，你可以极大地改善构建时间，强制组件之间的逻辑分离，并以新的更好的方式组织代码。

我们还为 `tsc` 引入了一个新的模式 `--build` 标志，它与项目 references 一起工作，以实现更快的 TypeScript 构建。

## An Example Project - 一个例子项目

让我们看一个相当普通的程序，看看项目 references 如何帮助我们更好地组织它。假设你有一个包含两个模块的项目，`converter` 和 `units`，以及每个模块相应的测试文件：

```
/
├── src/
│   ├── converter.ts
│   └── units.ts
├── test/
│   ├── converter-tests.ts
│   └── units-tests.ts
└── tsconfig.json
```

测试文件导入实现文件并进行一些测试：

```typescript
// converter-tests.ts
import * as converter from "../converter";
assert.areEqual(converter.celsiusToFahrenheit(0), 32);
```

以前，如果使用单个 tsconfig 文件，那么这种结构处理起来相当笨拙：

- 实现文件可能会导入测试文件
- 如果不在输出文件夹名称中显示 `src`，就不可能同时构建 `test` 和 `src`，这可能是你不希望的
- 仅仅更改实现文件中的内部内容就需要再次对测试进行类型检查，尽管这不会导致新的错误
- 仅仅更改测试就需要再次对实现进行类型检查，即使什么都没有更改

你可以使用多个 tsconfig 文件来解决其中的一些问题，但是会出现新的问题：

- 没有内置的最新检查，所以最终总是运行两次 `tsc`
- 两次调用 `tsc` 会导致更多的启动时间开销
- `tsc -w` 不能同时运行在多个配置文件上

项目 references 可以解决所有这些问题，甚至更多。

## What is a Project Reference? - 什么是项目引用？

`tsconfig.json` 文件有一个新的顶级属性，[`references`](https://www.typescriptlang.org/tsconfig#references)。它是指定要引用的项目的对象数组：

```json
{
  "compilerOptions": {
    // The usual
  },
  "references": [{ "path": "../src" }]
}
```

每个引用的 `path` 属性可以指向包含 `tsconfig.json` 文件的目录，或配置文件本身 (可能有任何名称)。

当你引用一个项目时，新事情就会发生：

- 从引用的项目导入模块将加载其输出声明文件 (`.d.ts`)
- 如果引用的项目产生一个 [`outFile`](https://www.typescriptlang.org/tsconfig#outFile)，则输出文件 `.d.ts` 文件的声明将在此项目中可见
- 如果需要，构建模式 (见下面) 将自动构建引用的项目

通过分成多个项目，你可以极大地改善类型检查和编译的速度，在使用编辑器时减少内存使用，并改善程序逻辑分组的执行。

## `composite`

引用的项目必须有新的 [`composite`](https://www.typescriptlang.org/tsconfig#composite) 设置启用。这个设置需要来确保 TypeScript 可以快速确定在哪里找到引用项目的输出。启用 [`composite`](https://www.typescriptlang.org/tsconfig#composite) 标志会改变一些事情：

- 如果没有显式设置，[`rootDir`](https://www.typescriptlang.org/tsconfig#rootDir) 默认设置为包含 `tsconfig` 文件的目录。
- 所有实现文件必须由 [`include`](https://www.typescriptlang.org/tsconfig#include) 模式匹配或列在 [`files`](https://www.typescriptlang.org/tsconfig#files) 数组中。如果违反了此约束，`tsc` 将通知你没有指定哪些文件
- [`declaration`](https://www.typescriptlang.org/tsconfig#declaration) 必须打开

## `declarationMap`

我们还添加了对 [declaration source maps](https://github.com/Microsoft/TypeScript/issues/14479) 的支持。如果启用了 [`declarationMap`](https://www.typescriptlang.org/tsconfig#declarationMap)，就可以使用 “转到定义” 和 “重命名” 等编辑器特性，在支持的编辑器中跨项目边界透明地导航和编辑代码。

## `prepend` with `outFile`

还可以使用 reference 中的 `prepend` 选项启用对依赖项的输出进行前置：

```json
   "references": [
       { "path": "../utils", "prepend": true }
   ]
```

项目的前置将把项目的输出包含在当前项目的输出之上。所有输出文件 (`.js`，`.d.ts`，`.js.map`，`.d.ts.map`) 将正确发出。

`tsc` 将只使用磁盘上现有文件来执行此程序，因此，有可能创建一个无法生成正确输出文件的项目，因为某些项目的输出会在结果文件中出现不止一次。例如：

```
   A
  ^ ^
 /   \
B     C
 ^   ^
  \ /
   D
```

在这种情况下，重要的是不要前置每个引用，因为你最终会在 `D` 的输出中得到两个 `A` 的副本 - 这可能会导致意想不到的结果。

## Caveats for Project References - 项目 References 注意事项

项目 references 有一些你应该注意的权衡。

因为依赖的项目使用 `.d.ts` 文件是从它们的依赖关系构建的，你要么必须检查某些构建输出，要么在克隆后构建项目，然后才能在编辑器中浏览项目而不会看到虚假错误。

当使用 VS Code (从 TS 3.7 开始) 时，我们在内存中有一个幕后的 `.d.ts` 生成程序应该能够缓解这一点，但是它有一些性能的影响。对于非常大的组合项目，你可能需要使用 [disableSourceOfProjectReferenceRedirect option](https://www.typescriptlang.org/tsconfig#disableSourceOfProjectReferenceRedirect) 禁用它。

此外，为了保持与现有构建工作流的兼容性，`tsc` 不会自动构建依赖项，除非使用 `--build` 开关调用。让我们了解更多关于 `--build`。

## Build Mode for TypeScript - TypeScript 的构建模式

人们期待已久的一个特性是 TypeScript 项目的智能增量构建。在 3.0 中，你可以在 `tsc` 中使用 `--build` 标志。这是 `tsc` 的一个有效的新入口点，它的行为比起是一个简单的编译器更像一个构建协调器。

运行 `tsc --build` (简短的 `tsc -b`) 将执行以下操作：

- 查找所有引用的项目
- 检测它们是否是最新的
- 按照正确的顺序构建过时的项目

你可以为 `tsc -b` 提供多个配置文件路径 (例如 `tsc -b src test`)。就像 `tsc -p` 一样，如果配置文件命名为 `tsconfig.json`，那么指定配置文件名本身是不必要的。

## `tsc -b` Commandline - `tsc -b` 命令行

可以指定任意数量的配置文件：

```
 > tsc -b                            # Use the tsconfig.json in the current directory
 > tsc -b src                        # Use src/tsconfig.json
 > tsc -b foo/prd.tsconfig.json bar  # Use foo/prd.tsconfig.json and bar/tsconfig.json
```

不要担心对在命令行上传递的文件进行排序 - 如果需要，`tsc` 将对它们进行重新排序，所以依赖关系总是先建立的。

还有一些 `tsc -b` 特有的标志：

- [`--verbose`](https://www.typescriptlang.org/tsconfig#verbose): 打印冗长的日志记录以解释发生了什么 (可能与任何其他标志结合)
- `--dry`: 显示了要做什么，但实际上没有构建任何东西
- `--clean`: 删除指定项目的输出 (可以与 `--dry` 组合使用)
- [`--force`](https://www.typescriptlang.org/tsconfig#force): 就好像所有的项目都过时了一样
- `--watch`: 监视模式 (不能与任何标志组合，除了 [`--verbose`](https://www.typescriptlang.org/tsconfig#verbose))

## Caveats - 说明

通常，当出现语法或类型错误时，`tsc` 将生成输出 (`.js` 和 `.d.ts`)，除非 [`noEmitOnError`](https://www.typescriptlang.org/tsconfig#noEmitOnError) 是打开的。在增量构建系统中这样做是非常糟糕的 - 如果某个过时的依赖项有一个新的错误，你将只能看到它一次，因为后续构建将跳过构建当前最新的项目。由于这个原因，`tsc -b` 实际上表现为所有项目都启用了[`noEmitOnError`](https://www.typescriptlang.org/tsconfig#noEmitOnError)。

如果检查任何构建输出 (`.js`, `.d.ts`, `.d.ts.map` 等)，你可能需要在某些版本控制操作之后运行 [`--force`](https://www.typescriptlang.org/tsconfig#force) 构建，这取决于你的版本控制工具是否在本地副本和远程副本之间保留时间戳。

## MSBuild

如果你有一个 msbuild 项目，你可以通过添加启用构建模式：

```
<TypeScriptBuildMode>true</TypeScriptBuildMode>
```

到你的 proj 文件。这将启动自动增量构建和清理。

注意，与 `tsconfig.json` / `-p` 一样，现有的 TypeScript 项目属性将不被尊重 - 所有的设置都应该使用你的 tsconfig 文件进行管理。

一些团队建立了基于 msbuild 的工作流，其中 tsconfig 文件具有与它们配对的托管项目相同的隐式图顺序。如果你的解决方案是这样的，你可以继续使用 msbuild 和 `tsc -p` 以及项目 references；它们是完全可共同操作的。

## Guidance - 指导

### Overall Structure - 整体结构

使用更多 `tsconfig.json` 文件，你通常需要使用 [配置文件继承](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)来集中你的常用编译器选项。通过这种方式，你可以在一个文件中更改一个设置，而不必编辑多个文件。

另一个好的实践是有一个 "解决方案" `tsconfig.json` 文件，它只 [`references`](https://www.typescriptlang.org/tsconfig#references) 所有叶子节点项目，并将 [`files`](https://www.typescriptlang.org/tsconfig#files) 设置为空数组 (否则，解决方案文件将导致文件的双重编译)。注意，从 3.0 开始，如果 `tsconfig.json` 文件中至少有一个 `reference`，那么使用空 [`files`](https://www.typescriptlang.org/tsconfig#files) 数组就不再是错误了。

这提供了一个简单的入口点；例如，在 TypeScript repo 中，我们只需运行 `tsc -b src` 来构建所有端点，因为我们在 `src/tsconfig.json` 中列出了所有子项目。

你可以在 TypeScript repo 中看到这些模式 - 请参见 `src/tsconfig_base.json`，`src/tsconfig.json` 和 `src/tsc/tsconfig.json` 作为关键示例。

### Structuring for relative modules - 相关模块的结构

通常，使用相关模块转换 repo 不需要太多操作。只需放置一个 `tsconfig.json` 文件，并向这些配置文件添加 `reference`，以匹配程序的预期分层。你需要将 [`outDir`](https://www.typescriptlang.org/tsconfig#outDir) 设置为输出文件夹的显式子文件夹，或者将 [`rootDir`](https://www.typescriptlang.org/tsconfig#rootDir) 设置为所有项目文件夹的公共根。

### Structuring for outFiles - 输出文件的结构

使用 [`outFile`](https://www.typescriptlang.org/tsconfig#outFile) 进行编译的布局更加灵活，因为相对路径并不那么重要。要记住的一件事是，你通常希望直到 "最后" 一个项目才使用 `prepend` - 这将缩短构建时间，减少任何给定构建所需的 I/O 量。TypeScript repo 本身就是一个很好的参考 - 我们有一些 "library" 项目和一些 "endpoint" 项目；"endpoint" 项目保持尽可能小，只引入它们需要的库。
