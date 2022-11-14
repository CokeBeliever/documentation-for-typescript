import { defineConfig } from "vitepress";

export default defineConfig({
  title: "TypeScript",
  description: "TypeScript 中文文档",
  lang: "zh-CN",
  base: "/documentation-for-typescript",
  themeConfig: {
    logo: "/images/logo.svg",
    outline: "deep",
    nav: [
      {
        text: "官方文档",
        link: "https://www.typescriptlang.org/",
      },
    ],
    sidebar: [
      {
        text: "Get Started",
        collapsible: true,
        items: [
          {
            text: "TS for JS Programmers",
            link: "/get-started/ts-for-js-programmers",
          },
        ],
      },
      {
        text: "Handbook",
        collapsible: true,
        items: [
          {
            text: "The TypeScript Handbook",
            link: "/handbook/the-typescript-handbook",
          },
          {
            text: "The Basics",
            link: "/handbook/the-basics",
          },
          {
            text: "Everyday Types",
            link: "/handbook/everyday-types",
          },
          {
            text: "Narrowing",
            link: "/handbook/narrowing",
          },
          {
            text: "More on Functions",
            link: "/handbook/more-on-functions",
          },
          {
            text: "Object Types",
            link: "/handbook/object-types",
          },
          {
            text: "Type Manipulation",
            items: [
              {
                text: "Creating Type from Types",
                link: "/handbook/type-manipulation/creating-types-from-types",
              },
              {
                text: "Generics",
                link: "/handbook/type-manipulation/generics",
              },
              {
                text: "Keyof Type Operator",
                link: "/handbook/type-manipulation/keyof-type-operator",
              },
              {
                text: "Typeof Type Operator",
                link: "/handbook/type-manipulation/typeof-type-operator",
              },
              {
                text: "Indexed Access Types",
                link: "/handbook/type-manipulation/indexed-access-types",
              },
              {
                text: "Conditional Types",
                link: "/handbook/type-manipulation/conditional-types",
              },
              {
                text: "Mapped Types",
                link: "/handbook/type-manipulation/mapped-types",
              },
              {
                text: "Template Literal Types",
                link: "/handbook/type-manipulation/template-literal-types",
              },
            ],
          },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/CokeBeliever" }],
    editLink: {
      pattern:
        "https://github.com/CokeBeliever/documentation-for-typescript/edit/master/docs/:path",
      text: "在 GitHub 编辑此页",
    },
    footer: {
      copyright:
        'Copyright © 2022-present <a href="https://github.com/CokeBeliever">CokeBeliever</a>',
    },
  },
});
