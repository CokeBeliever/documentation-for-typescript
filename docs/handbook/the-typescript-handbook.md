# The TypeScript Handbook

## About this Handbook 关于本手册

在它被引入编程社区 20 多年后，JavaScript 现在是有史以来最普遍的跨平台语言之一。作为一种小型脚本语言开始，为网页添加琐碎的交互性，JavaScript 已经成为各种规模的前端和后端应用程序的首选语言。而用 JavaScript 编写的程序的规模、范围和复杂性都呈指数级增长，JavaScript 语言却没有表达不同代码单元之间关系的能力。结合 JavaScript 相当不寻常的运行时语义，这种语言和程序复杂性之间的不匹配使得 JavaScript 开发是一项难以大规模管理的任务。

程序员编写的最常见的错误类型可以描述为类型错误：在期望使用不同类型值的地方使用特定类型的值。这可能是由于简单的拼写错误、无法理解库的 API 表面、对运行时行为的错误假设、或其他错误。TypeScript 的目标是成为 JavaScript 程序的静态类型检查器 - 换句话说，在代码运行 (静态) 之前运行的工具，并确保程序的类型是正确的 (类型检查)。

如果你没有 JavaScript 背景，只是想让 TypeScript 成为你的第一语言，我们建议您首先阅读 [Microsoft Learn JavaScript tutorial](https://docs.microsoft.com/javascript/) 中的文档，或者阅读 [JavaScript at the Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide)。如果您有使用其他语言的经验，您应该能够通过阅读手册快速掌握 JavaScript 语法。

## How is this Handbook Structured 这本手册的结构是怎样的

这本手册分为两部分：

- **The Handbook**

  TypeScript 手册旨在成为向日常程序员解释 TypeScript 的综合性文档。你可以在左侧导航栏中从上到下浏览手册。

  你应该期望每一章或每一页都能让你对所给的概念有一个深刻的理解。TypeScript 手册不是一个完整的语言规范，但它的目的是成为一个全面的指南，朝着所有的语言的特点和行为。

  完成了本演练的读者应该能够：

  - 阅读并理解常用的 TypeScript 语法和模式
  - 解释重要编译器选项的效果
  - 在大多数情况下正确预测类型系统行为

  为了清晰和简洁，本手册的主要内容将不探讨所涵盖功能的每一个边缘情况或细节，您可以在参考文章中找到关于特定概念的更多详细信息。

- **Reference Files**

  导航手册下方的参考部分是为了提供对 TypeScript 特定部分如何工作的更丰富的理解，你可以从头到尾阅读，但每一部分都旨在对单个概念提供更深入的解释 - 这意味着没有连续性的目标。

### Non-Goals 非目标

这本手册也打算成为一份简短的文件，可以在几个小时内轻松阅读。为了保持内容简短，某些主题将不涉及。

具体来说，手册并没有完全介绍核心的 JavaScript 基础知识，比如函数、类、以及闭包。在适当的地方，我们将包括背景阅读的链接，你可以用来阅读这些概念。

这本手册也不打算取代语言规范，在某些情况下，将跳过边缘情况或行为的正式描述，以支持高级描述、比较容易理解的解释。取而代之的是独立的参考页面，它们更精确、更正式地描述了 TypeScript 行为的许多方面。参考页面不是为不熟悉 TypeScript 的读者准备的，因此，他们可能会使用高级术语或你还没有读过的参考主题。

最后，手册不会介绍 TypeScript 如何与其他工具交互，除非在必要时。诸如如何使用 webpack、rollup、parcel、react、babel、closure、lerna、rush、bazel、preact、vue、angular、slivelte、jquery、yarn 或 npm 配置 TypeScript 等主题不在讨论范围内 - 你可以在 web 的其他地方找到这些资源。

## Get Started 开始

在开始学习 [The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html) 之前，我们建议阅读以下介绍页中的一页。这些介绍旨在突出 TypeScript 和您喜欢的编程语言之间的关键相似点和不同点，并澄清特定于这些语言的常见误解。

- [TypeScript for New Programmers](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript for OOP Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)
- [TypeScript for Functional Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html)

否则，跳到 [The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html) 或抓一份 [Epub](https://www.typescriptlang.org/assets/typescript-handbook.epub) 或 [PDF](https://www.typescriptlang.org/assets/typescript-handbook.pdf) 格式的拷贝。
