# Introduction

Declaration Files 部分是在教你如何编写高质量的 TypeScript 声明文件。在开始之前，我们需要具有对 TypeScript 语言基本的熟悉。

如果你还没有，你应该阅读 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)，以熟悉自己的基本概念，特别是 types 和 modules。

学习 .d.ts 文件如何工作的最常见的情况是，你输入的是一个没有类型的 npm 包。在这种情况下，你可以直接跳转到 [Modules .d.ts](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html)。

声明文件部分分为以下几个部分。

## [Declaration Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html) - 声明引用

当我们只有底层库的示例来指导我们时，我们经常要编写声明文件。[Declaration Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html) 部分展示了许多常见的 API 模式以及如何为每种模式编写声明。本指南针对的是 TypeScript 新手，他们可能还不熟悉 TypeScript 中的每个语言结构。

## [Library Structures](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html) - 库结构

[Library Structures](https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html) 指南帮助你理解常见的库格式，以及如何为每种格式编写适当的声明文件。如果你正在编辑一个现有的文件，你或许不需要阅读本节。强烈建议新声明文件的作者阅读本节，以正确理解库的格式如何影响声明文件的编写。

在 Template 一节中，你将发现许多声明文件，它们可以作为编写新文件的有用起点。如果你已经知道你的结构是什么，请参阅侧栏中的 .d.ts Template 部分。

## [Do’s and Don’ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) - 行为准则

声明文件中的许多常见错误可以很容易地避免。[Do’s and Don’ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html) 的部分确定了常见错误，描述了如何检测它们以及如何修复它们。每个人都应该阅读这一节来帮助自己避免常见的错误。

## [Deep Dive](https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html) - 深潜

对于对声明文件如何工作的底层机制感兴趣的经验丰富的作者，[Deep Dive](https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html) 部分解释了声明编写中的许多高级概念，并展示了如何利用这些概念创建更清晰、更直观的声明文件。

## [Publish to npm](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html) - 发布到 npm

发布部分解释了如何将你的声明文件发布到 npm 包中，并展示了如何管理你的依赖包。

## [Find and Install Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html) - 找到并安装声明文件

对于 JavaScript 库用户，[Consumption](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html) 部分提供了一些查找和安装相应声明文件的简单步骤。
